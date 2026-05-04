import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: { outDir: 'dist' },
  server: {
    proxy: {
      '/api': { target: 'https://webrtc1.arkvisioninfotech.in', changeOrigin: true },
      '/admin': { target: 'https://webrtc1.arkvisioninfotech.in', changeOrigin: true },
      '/login': { target: 'https://webrtc1.arkvisioninfotech.in', changeOrigin: true },
      '/logout': { target: 'https://webrtc1.arkvisioninfotech.in', changeOrigin: true },
      '/register': { target: 'https://webrtc1.arkvisioninfotech.in', changeOrigin: true },
      '/me': { target: 'https://webrtc1.arkvisioninfotech.in', changeOrigin: true },
      '/health': { target: 'https://webrtc1.arkvisioninfotech.in', changeOrigin: true },
    }
  }
})
