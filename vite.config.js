import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://portfolio-backend-2-ly21.onrender.com',
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on('error', (err) => console.log('Proxy error:', err));
          proxy.on('proxyReq', (proxyReq, req) => {
            console.log('Proxying:', req.method, req.url, '→', proxyReq.path);
          });
        }
      },
      '/uploads': {
        target: 'https://portfolio-backend-2-ly21.onrender.com',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})