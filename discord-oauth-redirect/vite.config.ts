import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/golang-discode-bot",
  server: {
    port: 8080,
  },
  plugins: [react()],
});
