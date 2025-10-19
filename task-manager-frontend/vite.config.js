import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    host: "0.0.0.0",
    port: 4173, // optional, Render will use $PORT
    strictPort: true,
    allowedHosts: ["task-manager-1-24nz.onrender.com"], // ✅ add your Render URL here
  }
});
