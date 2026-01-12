import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    hmr: {
      host: '192.168.100.3',
      port: 5173
    },
    allowedHosts: [
      'localhost',
      '192.168.100.3',
      'https://75c70fe5f445.ngrok-free.app',
      '75c70fe5f445.ngrok-free.app',
      'staffood.co.ke'
    ]
  }
})
