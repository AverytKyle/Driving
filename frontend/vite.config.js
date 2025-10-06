import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // forward all /api requests to the Django backend running on port 8000
      '/api': 'http://localhost:8000',
    }
  }
})
