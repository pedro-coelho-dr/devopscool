import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  // Load .env and environment variables (from GitHub or shell)
  const env = loadEnv(mode, process.cwd(), '');


  // Default fallback for local dev
  const apiUrl = env.VITE_API_URL;

  return {
    plugins: [react(),tailwindcss()],

    define: {
      __APP_ENV__: JSON.stringify(mode),
      __API_URL__: JSON.stringify(apiUrl),
    },

    // Local dev server settings
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: apiUrl,
          changeOrigin: true,
          secure: false,
        },
      },
    },

    // Production build configuration
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      target: 'esnext',
      cssCodeSplit: true,
      minify: 'esbuild',
      sourcemap: false,
      emptyOutDir: true,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
          },
        },
      },
    },

    preview: {
      port: 4173,
      open: false,
    },
  };
});
