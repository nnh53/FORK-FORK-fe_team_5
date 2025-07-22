import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import path from "path";
import { defineConfig } from "vite";
const __dirname = dirname(fileURLToPath(import.meta.url));

const ReactCompilerConfig = {
  target: "19", // '17' | '18' | '19'
};
// https://vite.dev/config/
export default defineConfig({
  root: __dirname,
  cacheDir: "../../node_modules/.vite/apps/fe-react-app",
  server: {
    port: 5173,
    host: "localhost",
  },
  preview: {
    port: 5173,
    host: "localhost",
  },
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler", ReactCompilerConfig]],
      },
    }),
    tailwindcss(),
  ],
  build: {
    outDir: "./dist",
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  test: {
    watch: false,
    globals: true,
    environment: "jsdom",
    include: ["{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    reporters: ["default"],
    coverage: {
      reportsDirectory: "./test-output/vitest/coverage",
      provider: "v8",
    },
  },
  optimizeDeps: {
    exclude: ["@jsquash/png", "@jsquash/webp"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
