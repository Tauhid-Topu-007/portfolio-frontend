import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://portfolio-backend-1-qj6w.onrender.com',
        changeOrigin: true,
        secure: true,
      }
    }
  },
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify('https://portfolio-backend-1-qj6w.onrender.com')
  }
})