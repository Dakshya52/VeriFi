import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    define: {
      'process.env': env, // Inject environment variables into the build
    },
    build: {
      rollupOptions: {
        input: {
          content: resolve(__dirname, 'src/content/content.ts'),
          background: resolve(__dirname, 'src/background/background.ts'),
        },
        output: {
          entryFileNames: '[name].js',
          format: 'es',
          dir: 'dist',
        },
      },
    },
  };
});