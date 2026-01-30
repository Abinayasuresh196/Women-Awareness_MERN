import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./", // 👈 ADD THIS FOR NETLIFY
  build: {
    cssCodeSplit: false, // Ensure CSS is not split
    rollupOptions: {
      output: {
        manualChunks: undefined, // Disable code splitting for simpler build
      },
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
