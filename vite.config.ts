import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@app": path.resolve(__dirname, "src/app"),
      "@domain": path.resolve(__dirname, "src/domain"),
      "@infra": path.resolve(__dirname, "src/infra"),
      "@ui": path.resolve(__dirname, "src/ui"),
      "@styles": path.resolve(__dirname, "src/styles"),
    },
  },
});
