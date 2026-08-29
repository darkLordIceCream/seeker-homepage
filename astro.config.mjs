// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 4321,
    allowedHosts: ['too-ordered-innovative-nominations.trycloudflare.com'],
  },

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [react()],
});