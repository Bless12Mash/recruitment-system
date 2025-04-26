import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      stream: 'stream-browserify',

      util: 'util',
      events: 'events',
      "@": path.resolve(__dirname, "./src"),
    }
  }
})
