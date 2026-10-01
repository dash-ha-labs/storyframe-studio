import { defineConfig } from 'vite';
import { copyFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const publicTools = fileURLToPath(new URL('./public/tools/', import.meta.url));
export default defineConfig({
  plugins: [{ name: 'shared-capture-tool', buildStart() {
    mkdirSync(publicTools, { recursive: true });
    copyFileSync(fileURLToPath(new URL('../web/public/tools/capture-identity.mjs', import.meta.url)), publicTools + 'capture-identity.mjs');
  }}],
  build: { rollupOptions: { input: { main: 'index.html', demo: 'demo.html' } } },
});
