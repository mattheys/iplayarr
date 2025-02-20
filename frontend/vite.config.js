import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 4404,
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Adjust to your Express server URL
        changeOrigin: true,
      },
    },
  }
})
