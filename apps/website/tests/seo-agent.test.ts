// Offline tests for the OpenSEO SEO agent. The MCP server and chat provider are
// stubs on loopback/temp files; no live OpenSEO call and no live 9Router call.
// Env is snapshotted and restored around every test: this machine's shell may
// carry a real N9ROUTER_API_KEY, and the agent reads env lazily by design.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer, type Server, type IncomingMessage, type ServerResponse } from 'node:http';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const REPO_SEO = readFileSync(new URL('../src/seo.ts', import.meta.url), 'utf8');

const ENV_KEYS = [
  'OPENSEO_MCP_URL',
  'OPENSEO_API_KEY',
  'OPENSEO_QUERY_TOOL',
  'OPENSEO_QUERY_ARGS',
  'N9ROUTER_API_KEY',
  'N9ROUTER_BASE_URL',
  'SEO_AGENT_MODEL',
  'SEO_AGENT_MIN_IMPRESSIONS',
  'SEO_AGENT_MAX_CTR',
  'SEO_AGENT_MAX_POSITION',
  'SEO_AGENT_MAX_EDITS',
  'SEO_SITE_ORIGIN',
  'SEO_AGENT_DRY_RUN',
];
const envSnapshot = new Map(ENV_KEYS.map((k) => [k, process.env[k]]));
const clearEnv = () => {
  for (const key of ENV_KEYS) delete process.env[key];
};

test('env is isolated for the whole file', async (t) => {
  t.after(() => {
    for (const [k, v] of envSnapshot) {
      if (v === undefined) delete process.env[k];
      else process.env[k] = v;
    }
  });
  clearEnv();
});

// Fixture rows: an obvious candidate (/), a high-CTR page (/templates), a
// low-impression page (/blog), an unranked page (/docs), and a path that is
// not an indexPages entry (/made-up).
type Json = Record<string, unknown>;
const GSC_ROWS: Json[] = [
  { url: 'https://storyframe.yamu.app/', impressions: 5000, clicks: 40, ctr: '0.8%', position: 4.5 },
  { keys: ['/templates'], impressions: 3000, clicks: 90, ctr: '3%', position: 2 },
  { url: '/blog', impressions: 100, clicks: 1, ctr: '1%', position: 6 },
  { url: '/docs', impressions: 800, clicks: 5, ctr: '0.625%', position: 35 },
  { url: '/made-up', impressions: 9000, clicks: 10, ctr: '0.1%', position: 1 },
];

let toolCallCount = 0;
const seenMethods: string[] = [];

function stubMcpServer(rows: Json[]): Promise<{ server: Server; url: string }> {
  return new Promise((resolvePromise) => {
    const server = createServer((req: IncomingMessage, res: ServerResponse) => {
      let body = '';
      req.on('data', (chunk: Buffer) => {
        body += chunk.toString();
      });
      req.on('end', () => {
        const msg = JSON.parse(body) as { id?: number; method: string; params?: Json };
        seenMethods.push(msg.method);
        const reply = (result: Json) => {
          res.setHeader('Content-Type', 'application/json');
          if (msg.method === 'initialize') res.setHeader('Mcp-Session-Id', 'stub-session-1');
          res.end(JSON.stringify({ jsonrpc: '2.0', id: msg.id ?? null, result }));
        };
        if (msg.method === 'initialize') {
          reply({
            protocolVersion: '2025-06-18',
            capabilities: { tools: {} },
            serverInfo: { name: 'stub-openseo', version: '0.0.0' },
          });
        } else if (msg.method === 'notifications/initialized') {
          res.statusCode = 202;
          res.end();
        } else if (msg.method === 'tools/list') {
          reply({
            tools: [
              {
                name: 'gsc_performance',
                description: 'Google Search Console performance: clicks, impressions, ctr, position per page',
                inputSchema: {
                  type: 'object',
                  required: ['project_id'],
                  properties: { project_id: { type: 'string' } },
                },
              },
            ],
          });
        } else if (msg.method === 'tools/call') {
          toolCallCount++;
          const params = msg.params as { name: string; arguments: Json };
          assert.equal(params.name, 'gsc_performance');
          assert.equal(params.arguments.project_id, 'storyframe');
          reply({ content: [{ type: 'text', text: JSON.stringify({ rows }) }] });
        } else {
          reply({});
        }
      });
    });
    server.listen(0, '127.0.0.1', () =>
      resolvePromise({ server, url: `http://127.0.0.1:${(server.address() as { port: number }).port}/mcp` }),
    );
  });
}

test('stub MCP handshake and tools flow through the agent client', async (t) => {
  t.after(clearEnv);
  clearEnv();
  const { server, url } = await stubMcpServer(GSC_ROWS);
  t.after(() => server.close());
  process.env.OPENSEO_MCP_URL = url;
  const agent = await import('../scripts/seo-agent.ts');
  const client = agent.connectMcp();
  const tools = await client.listTools();
  assert.equal(tools.length, 1);
  const picked = agent.selectTool(tools, { argsJson: JSON.stringify({ project_id: 'storyframe' }) });
  assert.equal(picked.name, 'gsc_performance');
  const text = await client.callTool(picked.name, picked.args);
  assert.ok(text.includes('"impressions":5000'));
  assert.deepEqual(seenMethods, ['initialize', 'notifications/initialized', 'tools/list', 'tools/call']);
});

test('parseIndexPages reads the real seo.ts entries', async () => {
  const agent = await import('../scripts/seo-agent.ts');
  const entries = agent.parseIndexPages(REPO_SEO);
  assert.equal(entries.length, 11);
  const home = entries.find((e) => e.path === '/');
  assert.equal(home?.title, 'From your idea to a video in minutes');
  // Descriptions are deliberately not pinned: the SEO agent (see
  // scripts/seo-agent.ts and .github/workflows/seo-agent.yml) rewrites them;
  // tests run in CI on its proposed edits, so only the shared contract is
  // asserted here — 50-160 chars, single line, no markup.
  const roadmap = entries.find((e) => e.path === '/roadmap');
  assert.equal(roadmap?.title, 'Product roadmap & community ideas');
  for (const entry of entries) {
    assert.ok(
      entry.description.length >= 50 && entry.description.length <= 160,
      `${entry.path} description length ${entry.description.length} is outside 50-160`,
    );
    assert.ok(!/[\r\n<>]/.test(entry.description), `${entry.path} description carries newline or angle brackets`);
  }
});

test('applyDescription changes one description and verifyMutations accepts it', async () => {
  const agent = await import('../scripts/seo-agent.ts');
  // Distinct from the current /legal text on purpose: the mutation must be a
  // real change for verifyMutations/lineDiff to have something to check.
  const desc = 'Storyframe legal terms, privacy policy and contact routes for the marketing site and the studio app.';
  const mutated = agent.applyDescription(REPO_SEO, '/legal', desc);
  agent.verifyMutations(REPO_SEO, mutated, [{ path: '/legal', description: desc }]);
  const after = agent.parseIndexPages(mutated).find((e) => e.path === '/legal');
  assert.equal(after?.description, desc);
  const diff = agent.lineDiff(REPO_SEO, mutated);
  assert.equal(diff.length, 2);
  assert.ok(diff[0].includes("'/legal'"));
  assert.ok(diff[1].includes("'/legal'"));
});

test('applyDescription escapes quotes and backslashes; unknown path throws', async () => {
  const agent = await import('../scripts/seo-agent.ts');
  const desc = "Editors keep asking: it's fast, \\ rock solid — plan a storyboard and export product videos free.";
  const mutated = agent.applyDescription(REPO_SEO, '/status', desc);
  assert.equal(agent.parseIndexPages(mutated).find((e) => e.path === '/status')?.description, desc);
  assert.throws(() => agent.applyDescription(REPO_SEO, '/nope', desc));
});

test('heuristics pick high-impression, low-CTR, ranked, known pages only', async () => {
  const agent = await import('../scripts/seo-agent.ts');
  const entries = agent.parseIndexPages(REPO_SEO);
  const rows = agent.extractPageRows(JSON.stringify({ rows: GSC_ROWS }));
  assert.equal(rows.length, 5);
  const candidates = agent.pickCandidates(rows, entries);
  assert.deepEqual(candidates.map((c) => c.path), ['/']);
  const relaxed = agent.pickCandidates(rows, entries, { minImpressions: 50, maxCtr: 0.05, maxPosition: 50, limit: 3 });
  assert.deepEqual(relaxed.map((c) => c.path), ['/', '/templates', '/docs']);
});

test('parseSuggestions accepts valid fenced JSON and rejects bad rows', async () => {
  const agent = await import('../scripts/seo-agent.ts');
  const entries = agent.parseIndexPages(REPO_SEO);
  const current = agent.currentDescriptions(REPO_SEO);
  const good = 'Plan, edit and export product videos in your browser with Storyframe storyboards, brand kits and AI scene planning. Free signup, no card needed.';
  const reply = [
    'Here you go:',
    '```json',
    JSON.stringify([
      { path: '/features', description: good },
      { path: '/made-up', description: 'x'.repeat(60) },
      { path: '/features', description: 'duplicate row' },
    ]),
    '```',
  ].join('\n');
  const { accepted, rejected } = agent.parseSuggestions(reply, entries, current);
  assert.deepEqual(accepted, [{ path: '/features', description: good }]);
  assert.ok(rejected.some((r) => r.path === '/made-up'));
  assert.ok(rejected.some((r) => r.reason === 'duplicate path'));
  const { rejected: r2 } = agent.parseSuggestions('[{"path":"/status","description":"too short"}]', entries, current);
  assert.ok(r2[0].reason.includes('length'));
  const { rejected: r3 } = agent.parseSuggestions(
    `[{"path":"/status","description":${JSON.stringify(current.get('/status'))}}]`,
    entries,
    current,
  );
  assert.equal(r3[0].reason, 'identical to current description');
});

test('selectTool pins by name, falls back to Search Console heuristic, demands required args', async () => {
  const agent = await import('../scripts/seo-agent.ts');
  const tools = [
    { name: 'gsc_performance', description: 'Search Console performance', inputSchema: { type: 'object', required: ['project_id'] } },
    { name: 'keyword_research', description: 'keyword volume' },
  ];
  assert.equal(agent.selectTool(tools, { name: 'keyword_research', argsJson: '{}' }).name, 'keyword_research');
  assert.equal(agent.selectTool(tools, { argsJson: '{"project_id":"storyframe"}' }).name, 'gsc_performance');
  assert.throws(() => agent.selectTool(tools, {}), /project_id/);
  assert.throws(() => agent.selectTool(tools, { name: 'missing' }), /OPENSEO_QUERY_TOOL/);
});

test('mcpRequest surfaces HTTP and JSON-RPC errors; SSE bodies are parsed', async () => {
  const agent = await import('../scripts/seo-agent.ts');
  const fetchOk = (async () =>
    new Response('event: message\ndata: {"jsonrpc":"2.0","id":1,"result":{"ok":true}}\n\n', {
      headers: { 'Content-Type': 'text/event-stream', 'Mcp-Session-Id': 'sid-7' },
    })) as typeof fetch;
  const ok = await agent.mcpRequest('http://stub/mcp', 'tools/list', {}, { fetchFn: fetchOk });
  assert.deepEqual(ok.result, { ok: true });
  assert.equal(ok.sessionId, 'sid-7');
  const fetchErr = (async () => new Response('{}', { status: 401 })) as typeof fetch;
  await assert.rejects(agent.mcpRequest('http://stub/mcp', 'tools/list', {}, { fetchFn: fetchErr }), agent.McpError);
  const fetchRpcErr = (async () =>
    new Response('{"jsonrpc":"2.0","id":1,"error":{"code":-32000,"message":"denied"}}')) as typeof fetch;
  await assert.rejects(agent.mcpRequest('http://stub/mcp', 'tools/list', {}, { fetchFn: fetchRpcErr }), /denied/);
  assert.equal(agent.firstSseMessage('event: x\ndata: {"a":1}\n\ndata: {"b":2}'), '{"a":1}');
});

test('defaultChat refuses to run without N9ROUTER_API_KEY', async (t) => {
  t.after(clearEnv);
  clearEnv();
  const agent = await import('../scripts/seo-agent.ts');
  await assert.rejects(agent.defaultChat([{ role: 'user', content: 'hi' }]), agent.ConfigError);
});

test('end-to-end loop: stub MCP + stub chat mutate a temp seo.ts copy only', async (t) => {
  t.after(clearEnv);
  clearEnv();
  const { server, url } = await stubMcpServer(GSC_ROWS);
  t.after(() => server.close());
  process.env.OPENSEO_MCP_URL = url;
  const agent = await import('../scripts/seo-agent.ts');
  const dir = mkdtempSync(join(tmpdir(), 'seo-agent-e2e-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const target = join(dir, 'seo.ts');
  writeFileSync(target, REPO_SEO);
  const newDesc = 'Plan a storyboard, edit every scene and export on-brand product videos in your browser. Storyframe keeps teams from brief to final cut. Free to start.';
  const chat = async (messages: { role: string; content: string }[]) => {
    const payload = JSON.parse(messages[1].content) as { pages: { path: string; impressions: number; currentDescription: string }[] };
    assert.equal(payload.pages.length, 1);
    assert.equal(payload.pages[0].path, '/');
    assert.equal(payload.pages[0].impressions, 5000);
    // Not pinned to a literal: in the CI agent loop the repo seo.ts may already
    // carry a proposed description; the prompt must carry whatever is current.
    const currentDesc = agent.parseIndexPages(REPO_SEO).find((e) => e.path === '/')?.description;
    assert.equal(payload.pages[0].currentDescription, currentDesc);
    return JSON.stringify([
      { path: '/', description: newDesc },
      { path: '/nope', description: 'x'.repeat(80) },
    ]);
  };
  const toolCallsBefore = toolCallCount;
  const result = await agent.runLoop({
    mcp: agent.connectMcp(),
    chat,
    sourcePath: target,
    write: true,
    origin: 'https://storyframe.yamu.app',
    tool: { name: 'gsc_performance', argsJson: JSON.stringify({ project_id: 'storyframe' }) },
    log: () => {},
  });
  assert.equal(result.changed, true);
  assert.equal(result.edits.length, 1);
  assert.equal(result.rejected.length, 1);
  const written = readFileSync(target, 'utf8');
  agent.verifyMutations(REPO_SEO, written, result.edits);
  assert.equal(agent.parseIndexPages(written).find((e) => e.path === '/')?.description, newDesc);
  assert.equal(readFileSync(new URL('../src/seo.ts', import.meta.url), 'utf8'), REPO_SEO, 'repo seo.ts must stay untouched');
  assert.equal(toolCallCount - toolCallsBefore, 1);
  // A second run proposing the identical text must be refused and must not write.
  await assert.rejects(
    agent.runLoop({
      mcp: agent.connectMcp(),
      chat: async () => JSON.stringify([{ path: '/', description: newDesc }]),
      sourcePath: target,
      write: true,
      tool: { name: 'gsc_performance', argsJson: '{"project_id":"storyframe"}' },
      log: () => {},
    }),
    /no usable suggestions/,
  );
  assert.equal(readFileSync(target, 'utf8'), written, 'failed run must not write');
});
