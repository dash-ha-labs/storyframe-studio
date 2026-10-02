import {RESOURCES,resourceDownload} from './src/data/catalog';
import { defineConfig } from 'vite';
import { copyFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const libraryDownloads=fileURLToPath(new URL('./public/library-downloads/',import.meta.url));
const publicTools = fileURLToPath(new URL('./public/tools/', import.meta.url));
export default defineConfig({
  server: { proxy: { '/api/ideas': 'http://127.0.0.1:9183', '/api': 'http://127.0.0.1:9184' } },
  plugins: [{ name: 'shared-capture-tool', buildStart() {
    mkdirSync(libraryDownloads,{recursive:true});
    for(const resource of RESOURCES)writeFileSync(libraryDownloads+resource.slug+'.'+resource.format.toLowerCase(),resourceDownload(resource));
    mkdirSync(publicTools, { recursive: true });
    copyFileSync(fileURLToPath(new URL('../web/public/tools/capture-identity.mjs', import.meta.url)), publicTools + 'capture-identity.mjs');
  }}],
  build: { rollupOptions: { input: { main: 'index.html', demo: 'demo.html' } } },
});
