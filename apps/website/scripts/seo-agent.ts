// OpenSEO self-improving SEO loop — local read-modify scaffold (PR automation is a
// separate future ticket). Research: research/openseo-storyframe.md.
//
// Contract: mutate ONLY the description string literals inside `indexPages` of
// apps/website/src/seo.ts. The script never touches metadata() logic, entry
// paths, titles or the rest of the file, and never writes anywhere else.
// It writes the local file only; a human reviews the diff and opens the PR.
// Credentials are runtime env only; tests inject a stub MCP server and stub chat.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

// ---------- configuration (env only; never baked into a bundle) ----------
const env = (key: string): string => (process.env[key] || '').trim();
const SITE_PATH = resolve(dirname(fileURLToPath(import.meta.url)), '../src/seo.ts');
const OPENSEO_URL = env('OPENSEO_MCP_URL') || 'https://app.openseo.so/mcp';
const SITE_ORIGIN = env('SEO_SITE_ORIGIN') || 'https://storyframe.yamu.app';
// Credentials, model and mode are read lazily so tests (which import this module
// and mutate process.env) can never hit a live paid endpoint by load order.
const chatConfig = () => {
  const base = (env('N9ROUTER_BASE_URL') || 'https://router.darshgun.com/v1').replace(/\/+$/, '');
  return {
    key: env('N9ROUTER_API_KEY'),
    url: `${base.endsWith('/v1') ? base : `${base}/v1`}/chat/completions`,
    model: env('SEO_AGENT_MODEL') || 'ag/gemini-3.8-flash-high',
  };
};
const DRY_RUN = ['1', 'true'].includes(env('SEO_AGENT_DRY_RUN').toLowerCase());

export const DESC_MIN = 50;
export const DESC_MAX = 160;

export class McpError extends Error {}
export class ConfigError extends Error {}

// ---------- tiny streamable-HTTP MCP client (JSON-RPC 2.0, no SDK in this repo) ----------
type Json = Record<string, unknown>;

const contentTypeOf = (res: Response): string => res.headers.get('content-type') ?? '';
const isSse = (res: Response): boolean => contentTypeOf(res).includes('text/event-stream');

/** Extract the first JSON-RPC message from an SSE body (spec: data lines joined by newline). */
export function firstSseMessage(text: string): string {
  for (const chunk of text.split(/\n\n+/)) {
    const data = chunk
      .split('\n')
      .filter((l) => l.startsWith('data:'))
      .map((l) => l.slice(5).trim())
      .join('\n');
    if (data.trimStart().startsWith('{')) return data;
  }
  throw new McpError(`MCP SSE body carried no JSON-RPC message: ${text.slice(0, 120)}`);
}

export async function mcpRequest(
  url: string,
  method: string,
  params: Json,
  opts: { apiKey?: string; sessionId?: string; fetchFn?: typeof fetch } = {},
): Promise<{ result: Json; sessionId?: string }> {
  const doFetch = opts.fetchFn ?? fetch;
  const res = await doFetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json, text/event-stream',
      ...(opts.apiKey ? { Authorization: `Bearer ${opts.apiKey}` } : {}),
      ...(opts.sessionId ? { 'Mcp-Session-Id': opts.sessionId } : {}),
    },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
    signal: AbortSignal.timeout(60_000),
  });
  if (!res.ok) throw new McpError(`MCP HTTP ${res.status} from ${url} (${method})`);
  const sessionId = res.headers.get('mcp-session-id') ?? opts.sessionId;
  const bodyText = isSse(res) ? firstSseMessage(await res.text()) : await res.text();
  let msg: { result?: Json; error?: { code: number; message: string } };
  try {
    msg = JSON.parse(bodyText);
  } catch {
    throw new McpError(`MCP returned non-JSON from ${url}: ${bodyText.slice(0, 120)}`);
  }
  if (msg.error) throw new McpError(`MCP error ${msg.error.code}: ${msg.error.message}`);
  return { result: msg.result ?? {}, sessionId };
}

export type McpClient = {
  listTools: () => Promise<Json[]>;
  callTool: (name: string, args: Json) => Promise<string>;
};

export function connectMcp(opts: { fetchFn?: typeof fetch; url?: string } = {}): McpClient {
  // URL is read per call: tests import this module once and re-point
  // OPENSEO_MCP_URL between stub servers; load-time capture would go stale.
  const urlOf = () => opts.url ?? (env('OPENSEO_MCP_URL') || 'https://app.openseo.so/mcp');
  let sessionId: string | undefined;
  let tools: Json[] | null = null;
  const call = async (method: string, params: Json): Promise<Json> => {
    const r = await mcpRequest(urlOf(), method, params, {
      apiKey: env('OPENSEO_API_KEY') || undefined,
      sessionId,
      fetchFn: opts.fetchFn,
    });
    sessionId = r.sessionId ?? sessionId;
    return r.result;
  };
  // Best-effort lifecycle notification; the spec answers it with 202 and no body.
  const notify = async () => {
    try {
      await doNotify();
    } catch {
      /* optional per spec; a rejection here must not abort the loop */
    }
  };
  const doNotify = () =>
    (opts.fetchFn ?? fetch)(urlOf(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(env('OPENSEO_API_KEY') ? { Authorization: `Bearer ${env('OPENSEO_API_KEY')}` } : {}),
        ...(sessionId ? { 'Mcp-Session-Id': sessionId } : {}),
      },
      body: JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }),
      signal: AbortSignal.timeout(15_000),
    });
  return {
    async listTools() {
      if (!tools) {
        await call('initialize', {
          protocolVersion: '2025-06-18',
          capabilities: {},
          clientInfo: { name: 'storyframe-seo-agent', version: '0.1.0' },
        });
        await notify();
        const listed = await call('tools/list', {});
        tools = Array.isArray(listed.tools) ? (listed.tools as Json[]) : [];
      }
      return tools;
    },
    async callTool(name, args) {
      const out = await call('tools/call', { name, arguments: args });
      if (out.isError) throw new McpError(`MCP tool ${name} failed: ${JSON.stringify(out).slice(0, 200)}`);
      const content = Array.isArray(out.content) ? out.content : [];
      const text = content
        .map((c) => (c && typeof c === 'object' && typeof (c as Json).text === 'string' ? ((c as Json).text as string) : ''))
        .join('\n')
        .trim();
      return text || JSON.stringify(out.structuredContent ?? {});
    },
  };
}

/** Pick the Search-Console-performance tool: pinned via params, else name/description heuristic. */
export function selectTool(
  tools: Json[],
  pin: { name?: string; argsJson?: string } = {},
): { name: string; args: Json } {
  let tool = pin.name ? tools.find((t) => t.name === pin.name) : undefined;
  if (!tool && !pin.name) {
    tool = tools.find((t) => /search.?console|gsc|performance/i.test(`${t.name ?? ''} ${t.description ?? ''}`));
  }
  if (!tool || typeof tool.name !== 'string') {
    throw new ConfigError(
      `No OpenSEO tool identified for Search Console performance. Set OPENSEO_QUERY_TOOL to one of: ${
        tools.map((t) => t.name).join(', ') || '(server listed no tools)'
      }`,
    );
  }
  let args: Json = {};
  if (pin.argsJson) {
    try {
      args = JSON.parse(pin.argsJson) as Json;
    } catch {
      throw new ConfigError('OPENSEO_QUERY_ARGS is not valid JSON');
    }
  }
  const schema = (tool.inputSchema ?? {}) as Json;
  const required = Array.isArray(schema.required) ? (schema.required as string[]) : [];
  const missing = required.filter((key) => !(key in args));
  if (missing.length) {
    throw new ConfigError(
      `OpenSEO tool ${tool.name} requires ${missing.join(', ')}. Provide them as JSON in OPENSEO_QUERY_ARGS. Schema: ${JSON.stringify(schema).slice(0, 400)}`,
    );
  }
  return { name: tool.name, args };
}

// ---------- 9Router chat completion (same pattern as services/brag/gemini.mjs) ----------
export type ChatMessage = { role: string; content: string };
export type ChatFn = (messages: ChatMessage[]) => Promise<string>;

export const defaultChat: ChatFn = async (messages) => {
  const cfg = chatConfig();
  if (!cfg.key) throw new ConfigError('N9ROUTER_API_KEY not configured; refusing to suggest copy without a provider');
  const res = await fetch(cfg.url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${cfg.key}` },
    body: JSON.stringify({ model: cfg.model, messages, temperature: 0.4, max_tokens: 2000, stream: false }),
    signal: AbortSignal.timeout(90_000),
  });
  if (!res.ok) throw new ConfigError(`Generation provider error (${res.status})`);
  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  const text = data?.choices?.[0]?.message?.content;
  if (!text) throw new ConfigError('Generation provider returned no content');
  return text;
};

// ---------- seo.ts parsing: indexPages description strings only ----------
export type SiteEntry = { path: string; title: string; description: string };

/** Matches one `'/path':['Title','Description'],` line (values may carry \' escapes). */
const ENTRY_LINE = /^'((?:[^'\\]|\\.)*)':\['((?:[^'\\]|\\.)*)','((?:[^'\\]|\\.)*)'\](,)?$/;

export function escapeTs(text: string): string {
  return text.replaceAll('\\', '\\\\').replaceAll("'", "\\'").replaceAll('\n', '\\n');
}

export function unescapeTs(text: string): string {
  return text.replace(/\\(.)/g, (_, c: string) => (c === 'n' ? '\n' : c));
}

function indexBlockLines(source: string): { lines: string[]; blockStart: number; blockEnd: number } {
  const lines = source.split('\n');
  const blockStart = lines.findIndex((l) => l.includes('const indexPages'));
  if (blockStart < 0) throw new Error('seo-agent: indexPages block not found in seo.ts');
  let blockEnd = -1;
  for (let i = blockStart + 1; i < lines.length; i++) {
    if (lines[i].trim() === '};') {
      blockEnd = i;
      break;
    }
  }
  if (blockEnd < 0) throw new Error('seo-agent: indexPages block is not terminated');
  return { lines, blockStart, blockEnd };
}

export function parseIndexPages(source: string): SiteEntry[] {
  const { lines, blockStart, blockEnd } = indexBlockLines(source);
  const entries: SiteEntry[] = [];
  for (let i = blockStart + 1; i < blockEnd; i++) {
    const trimmed = lines[i].trim();
    if (!trimmed || trimmed.startsWith('//') || trimmed === '{') continue;
    const m = ENTRY_LINE.exec(trimmed);
    if (!m) throw new Error(`seo-agent: unrecognized line inside indexPages: "${trimmed.slice(0, 80)}"`);
    entries.push({ path: unescapeTs(m[1]), title: unescapeTs(m[2]), description: unescapeTs(m[3]) });
  }
  if (!entries.length) throw new Error('seo-agent: no indexPages entries parsed');
  return entries;
}

export function currentDescriptions(source: string): Map<string, string> {
  return new Map(parseIndexPages(source).map((e) => [e.path, e.description]));
}

/** Replace exactly one entry's description string literal; nothing else may change. */
export function applyDescription(source: string, path: string, description: string): string {
  const { lines, blockStart, blockEnd } = indexBlockLines(source);
  for (let i = blockStart + 1; i < blockEnd; i++) {
    const trimmed = lines[i].trim();
    const m = ENTRY_LINE.exec(trimmed);
    if (!m || unescapeTs(m[1]) !== path) continue;
    const indent = lines[i].slice(0, lines[i].length - lines[i].trimStart().length);
    lines[i] = `${indent}'${escapeTs(path)}':['${m[2]}','${escapeTs(description)}']${m[4] ?? ''}`;
    return lines.join('\n');
  }
  throw new Error(`seo-agent: no indexPages entry for ${path}`);
}

/** Assert the mutation changed only the targeted description literals. */
export function verifyMutations(
  original: string,
  mutated: string,
  edits: { path: string; description: string }[],
): void {
  const before = parseIndexPages(original);
  const after = parseIndexPages(mutated);
  if (before.length !== after.length) throw new Error('seo-agent: entry count changed');
  for (let i = 0; i < before.length; i++) {
    if (before[i].path !== after[i].path || before[i].title !== after[i].title) {
      throw new Error(`seo-agent: structure drift at entry ${i} (path/title changed)`);
    }
    const edit = edits.find((e) => e.path === before[i].path);
    const expected = edit ? edit.description : before[i].description;
    if (after[i].description !== expected) {
      throw new Error(`seo-agent: unexpected description change at ${before[i].path}`);
    }
  }
  const a = original.split('\n');
  const b = mutated.split('\n');
  if (a.length !== b.length) throw new Error('seo-agent: line count changed');
  const changedLines = a.filter((line, i) => line !== b[i]).length;
  if (changedLines !== edits.length) {
    throw new Error(`seo-agent: expected ${edits.length} changed lines, saw ${changedLines}`);
  }
}

export function lineDiff(before: string, after: string): string[] {
  const a = before.split('\n');
  const b = after.split('\n');
  const out: string[] = [];
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    if (a[i] !== b[i]) {
      if (a[i] !== undefined) out.push(`- ${a[i].trim()}`);
      if (b[i] !== undefined) out.push(`+ ${b[i].trim()}`);
    }
  }
  return out;
}

// ---------- MCP result -> page metric rows ----------
export type PageRow = { path: string; impressions: number; clicks: number; ctr?: number; position?: number };

const URL_KEYS = ['url', 'page', 'pagePath', 'page_path', 'landingPage', 'landing_page', 'path'];
const METRIC_KEYS = {
  impressions: ['impressions'],
  clicks: ['clicks'],
  ctr: ['ctr'],
  position: ['position', 'ranking', 'avg_position', 'avgPosition'],
} as const;

export function coerceNumber(value: unknown): number | undefined {
  if (typeof value === 'number') return Number.isFinite(value) ? value : undefined;
  if (typeof value === 'string') {
    const s = value.trim();
    if (s.endsWith('%')) {
      const n = Number(s.slice(0, -1));
      return Number.isFinite(n) ? n / 100 : undefined;
    }
    const n = Number(s.replaceAll(',', ''));
    return s !== '' && Number.isFinite(n) ? n : undefined;
  }
  return undefined;
}

function rowPathOf(row: Json): string | undefined {
  for (const key of URL_KEYS) {
    const v = row[key];
    if (typeof v === 'string' && v.trim()) {
      const s = v.trim();
      if (s.startsWith('http://') || s.startsWith('https://')) {
        try {
          return new URL(s).pathname;
        } catch {
          return undefined;
        }
      }
      return s.startsWith('/') ? s : `/${s}`;
    }
  }
  const keys = row.keys;
  if (Array.isArray(keys) && typeof keys[0] === 'string' && keys[0].trim()) {
    const s = keys[0].trim();
    if (s.startsWith('http')) {
      try {
        return new URL(s).pathname;
      } catch {
        return undefined;
      }
    }
    return s.startsWith('/') ? s : `/${s}`;
  }
  return undefined;
}

function metricsOf(row: Json): Omit<PageRow, 'path'> | undefined {
  const pick = (names: readonly string[]): number | undefined => {
    for (const n of names) {
      const v = coerceNumber(row[n]);
      if (v !== undefined) return v;
    }
    return undefined;
  };
  const impressions = pick(METRIC_KEYS.impressions);
  const clicks = pick(METRIC_KEYS.clicks);
  if (impressions === undefined && clicks === undefined) return undefined;
  return { impressions: impressions ?? 0, clicks: clicks ?? 0, ctr: pick(METRIC_KEYS.ctr), position: pick(METRIC_KEYS.position) };
}

/** Find the first array of URL+metric objects anywhere inside the tool result text. */
export function extractPageRows(text: string): PageRow[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new ConfigError(`OpenSEO tool result was not JSON: ${text.slice(0, 200)}`);
  }
  const found: PageRow[] = [];
  const visit = (node: unknown): void => {
    if (found.length || node === null || typeof node !== 'object') return;
    if (Array.isArray(node)) {
      const rows: PageRow[] = [];
      for (const item of node) {
        if (!item || typeof item !== 'object' || Array.isArray(item)) return void (rows.length = 0);
        const row = item as Json;
        const path = rowPathOf(row);
        const metrics = metricsOf(row);
        if (!path || !metrics) return void (rows.length = 0);
        rows.push({ path, ...metrics });
      }
      if (rows.length) found.push(...rows);
      return;
    }
    for (const value of Object.values(node as Json)) visit(value);
  };
  visit(parsed);
  if (!found.length) throw new ConfigError(`OpenSEO tool result carried no page/metric rows: ${text.slice(0, 200)}`);
  return found;
}

/** Heuristic candidates: high impressions, weak CTR, not buried in the rankings. */
export function pickCandidates(
  rows: PageRow[],
  entries: SiteEntry[],
  opts: { minImpressions?: number; maxCtr?: number; maxPosition?: number; limit?: number } = {},
): (PageRow & { title: string; description: string })[] {
  const minImpressions = opts.minImpressions ?? 200;
  const maxCtr = opts.maxCtr ?? 0.02;
  const maxPosition = opts.maxPosition ?? 20;
  const limit = opts.limit ?? 3;
  const byPath = new Map(entries.map((e) => [e.path, e]));
  const seen = new Set<string>();
  const out: (PageRow & { title: string; description: string })[] = [];
  for (const row of [...rows].sort((a, b) => b.impressions - a.impressions)) {
    const entry = byPath.get(row.path);
    if (!entry || seen.has(row.path)) continue;
    if (row.impressions < minImpressions) continue;
    if ((row.ctr ?? 0) > maxCtr) continue;
    if (row.position !== undefined && row.position > maxPosition) continue;
    seen.add(row.path);
    out.push({ ...row, title: entry.title, description: entry.description });
    if (out.length >= limit) break;
  }
  return out;
}

// ---------- AI suggestion ----------
const SYSTEM_PROMPT =
  'You improve SEO meta descriptions for the Storyframe marketing site (a video editor for product videos). ' +
  'Return ONLY a JSON array, one object per page you genuinely improve: {"path":string,"description":string}. ' +
  `Each description must be ${DESC_MIN}-${DESC_MAX} characters, one paragraph, sentence case, concrete product copy that states what the page actually offers. ` +
  'Never invent features, prices or claims; no vague slogans or hype; no quotes, HTML or markdown; keep the Storyframe name when it reads naturally. ' +
  'Use the provided search metrics (impressions, clicks, ctr, position) to address what searchers are evidently looking for. ' +
  'Every description must differ from the current one. Return [] if no page can be genuinely improved.';

export function buildPrompt(candidates: (PageRow & { title: string; description: string })[], origin: string): ChatMessage[] {
  return [
    { role: 'system', content: SYSTEM_PROMPT },
    {
      role: 'user',
      content: JSON.stringify({
        site: origin,
        pages: candidates.map((c) => ({
          path: c.path,
          title: c.title,
          currentDescription: c.description,
          impressions: c.impressions,
          clicks: c.clicks,
          ctr: c.ctr,
          position: c.position,
        })),
      }),
    },
  ];
}

export type Suggestion = { path: string; description: string };

/** Parse and validate the model reply; invalid rows are reported, never applied. */
export function parseSuggestions(
  text: string,
  entries: SiteEntry[],
  current: Map<string, string>,
): { accepted: Suggestion[]; rejected: { path: string; reason: string }[] } {
  const cleaned = text.replaceAll('```', '');
  const start = cleaned.indexOf('[');
  const end = cleaned.lastIndexOf(']');
  if (start < 0 || end <= start) throw new Error(`seo-agent: model reply carried no JSON array: ${text.slice(0, 120)}`);
  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned.slice(start, end + 1));
  } catch {
    throw new Error(`seo-agent: model reply was not valid JSON: ${text.slice(0, 120)}`);
  }
  if (!Array.isArray(parsed)) throw new Error('seo-agent: model reply is not an array');
  const known = new Set(entries.map((e) => e.path));
  const accepted: Suggestion[] = [];
  const rejected: { path: string; reason: string }[] = [];
  const seen = new Set<string>();
  for (const item of parsed) {
    const path = item && typeof item === 'object' ? (item as Json).path : undefined;
    const description = item && typeof item === 'object' ? (item as Json).description : undefined;
    const bad = (reason: string): void => {
      rejected.push({ path: typeof path === 'string' ? path : '(missing)', reason });
    };
    if (typeof path !== 'string' || typeof description !== 'string') {
      bad('row must be {path, description}');
      continue;
    }
    if (seen.has(path)) {
      bad('duplicate path');
      continue;
    }
    seen.add(path);
    if (!known.has(path)) {
      bad('not an indexPages path');
      continue;
    }
    const trimmed = description.trim();
    if (trimmed.length < DESC_MIN || trimmed.length > DESC_MAX) {
      bad(`length ${trimmed.length} outside ${DESC_MIN}-${DESC_MAX}`);
      continue;
    }
    if (/[\r\n<>]/.test(trimmed)) {
      bad('contains newline or angle brackets');
      continue;
    }
    if (trimmed === current.get(path)) {
      bad('identical to current description');
      continue;
    }
    accepted.push({ path, description: trimmed });
  }
  return { accepted, rejected };
}

// ---------- loop ----------
export type LoopDeps = {
  mcp: Pick<McpClient, 'listTools' | 'callTool'>;
  chat: ChatFn;
  sourcePath: string;
  write: boolean;
  origin?: string;
  tool?: { name?: string; argsJson?: string };
  heuristics?: { minImpressions?: number; maxCtr?: number; maxPosition?: number; limit?: number };
  log?: (message: string) => void;
};

export type LoopResult = {
  changed: boolean;
  written: boolean;
  tool: string;
  candidates: (PageRow & { title: string; description: string })[];
  edits: Suggestion[];
  rejected: { path: string; reason: string }[];
  diff: string[];
  sourcePath: string;
};

export async function runLoop(deps: LoopDeps): Promise<LoopResult> {
  const log = deps.log ?? (() => {});
  const origin = deps.origin ?? SITE_ORIGIN;
  const source = readFileSync(deps.sourcePath, 'utf8');
  const entries = parseIndexPages(source);
  log(`Parsed ${entries.length} index pages from ${deps.sourcePath}`);

  const tools = await deps.mcp.listTools();
  const { name, args } = selectTool(tools, deps.tool ?? {});
  log(`Querying OpenSEO tool "${name}"`);
  const raw = await deps.mcp.callTool(name, args);
  const rows = extractPageRows(raw);
  log(`Received ${rows.length} page rows from OpenSEO`);

  const candidates = pickCandidates(rows, entries, deps.heuristics);
  if (!candidates.length) {
    log('No page passed the improvement heuristics; seo.ts left unchanged.');
    return { changed: false, written: false, tool: name, candidates: [], edits: [], rejected: [], diff: [], sourcePath: deps.sourcePath };
  }
  for (const c of candidates) {
    log(`Candidate ${c.path}: ${c.impressions} impressions, ctr ${c.ctr ?? 'n/a'}, position ${c.position ?? 'n/a'}`);
  }

  const reply = await deps.chat(buildPrompt(candidates, origin));
  const current = currentDescriptions(source);
  const { accepted, rejected } = parseSuggestions(reply, entries, current);
  for (const r of rejected) log(`Rejected suggestion for ${r.path}: ${r.reason}`);
  if (!accepted.length) throw new Error('seo-agent: no usable suggestions produced; seo.ts left unchanged');

  const edits = accepted.slice(0, candidates.length);
  let mutated = source;
  for (const edit of edits) {
    const before = current.get(edit.path);
    if (before === undefined) throw new Error(`seo-agent: ${edit.path} vanished mid-run`);
    mutated = applyDescription(mutated, edit.path, edit.description);
  }
  verifyMutations(source, mutated, edits);
  if (deps.write) writeFileSync(deps.sourcePath, mutated);
  log(`${edits.length} description(s) ${deps.write ? 'written to' : 'prepared for'} ${deps.sourcePath}`);
  return {
    changed: true,
    written: deps.write,
    tool: name,
    candidates,
    edits,
    rejected,
    diff: lineDiff(source, mutated),
    sourcePath: deps.sourcePath,
  };
}

// ---------- CLI ----------
export function parseHeuristicsFromEnv(): LoopDeps['heuristics'] {
  return {
    minImpressions: Number(env('SEO_AGENT_MIN_IMPRESSIONS')) || undefined,
    maxCtr: Number(env('SEO_AGENT_MAX_CTR')) || undefined,
    maxPosition: Number(env('SEO_AGENT_MAX_POSITION')) || undefined,
    limit: Number(env('SEO_AGENT_MAX_EDITS')) || undefined,
  };
}

export async function main(argv: string[]): Promise<number> {
  if (argv.includes('--parse-only')) {
    for (const entry of parseIndexPages(readFileSync(SITE_PATH, 'utf8'))) {
      console.log(`${entry.path}\n  title: ${entry.title}\n  description: ${entry.description}`);
    }
    return 0;
  }
  if (argv.includes('--help') || argv.includes('-h')) {
    console.log('Usage: tsx scripts/seo-agent.ts [--parse-only] [--dry-run]\nEnv: see docs/SEO-AGENT.md');
    return 0;
  }
  if (!env('OPENSEO_API_KEY') && (env('OPENSEO_MCP_URL') || 'https://app.openseo.so/mcp') === 'https://app.openseo.so/mcp') {
    console.error('Configuration needed: set OPENSEO_API_KEY (OpenSEO → Settings → API keys) or point OPENSEO_MCP_URL at a self-hosted instance.');
    return 2;
  }
  const write = !argv.includes('--dry-run') && !DRY_RUN;
  try {
    const result = await runLoop({
      mcp: connectMcp(),
      chat: defaultChat,
      sourcePath: SITE_PATH,
      write,
      origin: SITE_ORIGIN,
      tool: { name: env('OPENSEO_QUERY_TOOL') || undefined, argsJson: env('OPENSEO_QUERY_ARGS') || undefined },
      heuristics: parseHeuristicsFromEnv(),
      log: (m) => console.log(m),
    });
    if (result.changed) {
      console.log('\nProposed diff (human review required; no commit is made):\n');
      for (const line of result.diff) console.log(line);
      console.log('\nNext: review the diff, then run npm test and npm run build before opening a PR.');
      if (!result.written) console.log('Dry run only; rerun without --dry-run to write the file.');
    }
    return 0;
  } catch (error) {
    if (error instanceof ConfigError) {
      console.error(`Configuration needed: ${error.message}`);
      return 2;
    }
    console.error(`seo-agent failed: ${error instanceof Error ? error.message : String(error)}`);
    return 1;
  }
}

const invokedDirectly = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (invokedDirectly) void main(process.argv.slice(2)).then((code) => process.exitCode = code);
