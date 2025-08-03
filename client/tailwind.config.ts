import type { Config } from 'tailwindcss';

const config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  important: true, // This makes all Tailwind utilities !important
  theme: {
    extend: {},
  },
  plugins: [],
  corePlugins: {
    preflight: false, // Disable Tailwind's reset styles to avoid conflicts with MUI
  },
} as Config;

export default config;
