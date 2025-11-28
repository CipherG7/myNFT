import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), nodePolyfills()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  optimizeDeps: {
    exclude: ['@mysten/walrus'], // Don't pre-bundle Walrus to avoid WASM issues
    include: ['dataloader'],
    esbuildOptions: {
      target: 'esnext',
      supported: {
        'top-level-await': true,
      },
    },
  },
  build: {
    target: 'esnext',
    modulePreload: {
      polyfill: false,
    },
  },
  esbuild: {
    supported: {
      'top-level-await': true,
    },
  },
  worker: {
    format: 'es',
  },
  // Include WASM files as assets
  assetsInclude: ['**/*.wasm'],
});