// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  // og:image 等需要绝对 URL 的场合使用
  site: 'https://seeker-homepage.pages.dev',

  server: {
    host: '0.0.0.0',
    port: 4321,
    allowedHosts: ['homework-essentially-rarely-installing.trycloudflare.com'],
  },

  preview: {
    allowedHosts: ['homework-essentially-rarely-installing.trycloudflare.com'],
  },

  vite: {
    plugins: [tailwindcss()],
    // MapLibre GL 的 Web Worker 需要 ESM 格式；且 dev 预打包会破坏其内部 worker 解析
    worker: {
      format: 'es',
    },
    optimizeDeps: {
      exclude: ['maplibre-gl'],
    },
  },

  integrations: [react()],
});