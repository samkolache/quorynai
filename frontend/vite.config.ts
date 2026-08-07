import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // Anything the frontend fetches at /api/* gets forwarded to the Express
    // server on port 3000. To the browser it all looks like one origin, so
    // there's no CORS preflight in dev and no hardcoded localhost:3000 in
    // your React code — you just `fetch('/api/health')`.
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
