import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': '/src',
      '@/components': '/src/components',
      '@/pages': '/src/pages',
      '@/hooks': '/src/hooks',
      '@/contexts': '/src/contexts',
      '@/layout': '/src/layout',
      '@/types': '/src/types',
      '@/api': '/src/api',
      '@/lib': '/src/lib',
      '@/config': '/src/config',
      '@/styles': '/src/styles',
    },
  },
});
