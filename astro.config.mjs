// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://mirunkaushik.vercel.app',
  vite: {
    plugins: [tailwindcss()],
    // three.js is one lazy-loaded chunk for the hero graph; ~130 KB gzipped.
    build: { chunkSizeWarningLimit: 700 },
  },
});
