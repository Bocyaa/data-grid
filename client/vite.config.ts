import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': '/src',
      '@/api': '/src/api',
      '@/components': '/src/components',
      '@/config': '/src/config',
      '@/contexts': '/src/contexts',
      '@/hooks': '/src/hooks',
      '@/layout': '/src/layout',
      '@/lib': '/src/lib',
      '@/pages': '/src/pages',
      '@/styles': '/src/styles',
      '@/types': '/src/types',
      '@/utils': '/src/utils',
    },
  },
});
