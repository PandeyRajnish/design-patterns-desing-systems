import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/current-user": "http://localhost:3000",
      "/users": "http://localhost:3000",
      "/user": "http://localhost:3000",
      "/books": "http://localhost:3000",
      "/book": "http://localhost:3000",
    },
  },
});
