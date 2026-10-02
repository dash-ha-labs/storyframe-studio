import { defineConfig } from 'vite';

// Dev/preview proxy to the standalone services (same pattern as apps/website).
export default defineConfig({
  server: { proxy: { '/api/strips': 'http://127.0.0.1:9184' } },
  preview: { proxy: { '/api/strips': 'http://127.0.0.1:9184' } },
});
