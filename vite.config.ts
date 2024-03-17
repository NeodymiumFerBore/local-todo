import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// Requires @types/node
import path from "path";

const base = process.env.BASE_PATH || "/";

// https://vitejs.dev/config/
export default defineConfig({
  base,
  plugins: [react()],
  esbuild: {
    drop: ["console", "debugger"],
  },
  resolve: {
    alias: [
      {
        find: "@",
        replacement: path.resolve(__dirname, "./src"),
      },
    ],
  },
});
