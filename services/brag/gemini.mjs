// Gemini client via 9Router (chat_completions). Server-side only.
const RAW_BASE = process.env.N9ROUTER_BASE_URL || 'https://router.darshgun.com/v1';
const BASE_URL = RAW_BASE.replace(/\/+$/, '').endsWith('/v1')
  ? RAW_BASE.replace(/\/+$/, '')
  : `${RAW_BASE.replace(/\/+$/, '')}/v1`;
const API_KEY = process.env.N9ROUTER_API_KEY || '';
export const DEFAULT_MODEL = process.env.GEMINI_MODEL || 'ag/gemini-3.8-flash-high';

export class ProviderError extends Error {
  constructor(message, status = 503) {
    super(message);
    this.status = status;
  }
}

export async function chat(messages, { model = DEFAULT_MODEL } = {}) {
  if (!API_KEY) {
    throw new ProviderError('Generation unavailable: N9ROUTER_API_KEY not configured');
  }
  const res = await fetch(`${BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({ model, messages, temperature: 0.8, stream: false }),
    signal: AbortSignal.timeout(90_000),
  });
  if (!res.ok) {
    throw new ProviderError(`Generation provider error (${res.status})`);
  }
  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content;
  if (!text) throw new ProviderError('Generation provider returned no content');
  return { text, model };
}
