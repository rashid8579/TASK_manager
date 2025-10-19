import { defineConfig } from "vite"; 
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    host: "0.0.0.0",
    port: process.env.PORT,        // use Render's assigned port
    strictPort: true,
    allowedHosts: "all",           // allow any host
  }
});
