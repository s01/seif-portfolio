import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks for better caching
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Split large animation library
          'framer-motion': ['framer-motion'],
          // Icons in separate chunk (they're large!)
          'icons': ['lucide-react'],
        },
      },
    },
    // Target modern browsers for smaller output
    target: 'es2020',
    // Remove console logs in production
    minify: 'esbuild',
    // Better CSS code splitting
    cssCodeSplit: true,
    // Smaller chunk size for faster loading
    chunkSizeWarningLimit: 1000,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    // Don't pre-bundle these (load on demand)
    exclude: ['firebase'],
  },
})
