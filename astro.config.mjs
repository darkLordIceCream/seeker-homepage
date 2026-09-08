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
    allowedHosts: ['classroom-derived-democrat-badge.trycloudflare.com'],
  },

  preview: {
    allowedHosts: ['classroom-derived-democrat-badge.trycloudflare.com'],
  },

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [react()],
});