import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const base = process.env.VITE_BASE_PATH ?? env.VITE_BASE_PATH ?? '/';

  return {
    root: '.',
    base,
    publicDir: 'public',
    plugins: [react(), tailwindcss()],
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: false,
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
        },
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('three') || id.includes('@react-three/fiber') || id.includes('@react-three/drei')) {
                return 'three';
              }

              if (id.includes('react') || id.includes('react-dom')) {
                return 'react-vendor';
              }
            }

            return undefined;
          },
        },
      },
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@components': resolve(__dirname, 'src/components'),
        '@hooks': resolve(__dirname, 'src/hooks'),
        '@utils': resolve(__dirname, 'src/utils'),
        '@styles': resolve(__dirname, 'src/styles'),
        '@types': resolve(__dirname, 'src/types'),
        '@data': resolve(__dirname, 'src/data'),
      },
    },
    server: {
      port: 3000,
      open: true,
      host: true,
    },
    preview: {
      port: 4173,
    },
  };
});
