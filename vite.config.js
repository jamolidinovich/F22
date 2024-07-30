import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "react-apexcharts": "react-apexcharts",
    },
  },
  server: {
    hmr: {
      overlay: false,
    },
  },
});
