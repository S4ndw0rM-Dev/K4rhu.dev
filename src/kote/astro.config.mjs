// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Cambia site y base según tu repositorio de GitHub
export default defineConfig({
  site: 'https://karhu.dev',
  base: '/innovaconta',
  output: 'static',
  vite: {
    plugins: [tailwindcss()]
  }
});