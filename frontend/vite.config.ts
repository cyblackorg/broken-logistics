import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: ['logistics.fezzant.com'],
    proxy: {
      '/api': {
        target: 'http://backend:5000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@/components': resolve(__dirname, './src/components'),
      '@/pages': resolve(__dirname, './src/pages'),
      '@/hooks': resolve(__dirname, './src/hooks'),
      '@/utils': resolve(__dirname, './src/utils'),
      '@/services': resolve(__dirname, './src/services'),
      '@/types': resolve(__dirname, './src/types'),
      '@/assets': resolve(__dirname, '../assets')
    }
  },
  build: {
    sourcemap: true, // Vulnerable: Source maps in production
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          utils: ['axios', 'date-fns', 'lodash']
        }
      }
    }
  },
  define: {
    // Intentionally expose environment variables (vulnerable)
    // __API_URL__: JSON.stringify(process.env.VITE_API_URL || 'http://localhost:5000'),
    __API_URL__: JSON.stringify(process.env.VITE_API_URL || 'http://localhost:5000'),
    __DEBUG__: JSON.stringify(process.env.NODE_ENV === 'development'),
    __VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0')
  },
  // Security configurations (intentionally weak)
  optimizeDeps: {
    include: ['react', 'react-dom']
  }
}); 
