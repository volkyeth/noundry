import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr(),
  ],
  resolve: {
    alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
  },
  optimizeDeps: {
    include: ["@noundry/nouns-assets", "@noundry/lil-nouns-assets"],
    esbuildOptions: {
      target: "esnext", // you can also use 'es2020' here
    },
  },
  build: {
    target: "esnext",
    commonjsOptions: {
      include: [/node_modules/, /packages\/(?:nouns-assets|lil-nouns-assets)\/dist/],
    },
  },
});
