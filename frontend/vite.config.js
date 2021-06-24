import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('minimal')) {
            return 'card-data';
          }
          if (id.includes('element-plus')) {
            return 'element-plus'
          }
        },
      }
    }
  }
})
