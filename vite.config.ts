import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { crx, defineManifest } from '@crxjs/vite-plugin'

const manifest = defineManifest({
  manifest_version: 3,
  name: "AI Selecter",
  version: "1.0.0",
  description: "Simple launcher for AI services",
  action: {
    default_popup: "index.html",
    default_title: "AI Selecter",
    default_icon: "icon.png"
  },
  icons: {
    "16": "icon.png",
    "32": "icon.png",
    "48": "icon.png",
    "128": "icon.png"
  },
  permissions: ["clipboardWrite", "tabs"]
})

export default defineConfig({
  server: {
    port: 5173,
    strictPort: true,
    host: '127.0.0.1',
    hmr: {
      host: '127.0.0.1',
      port: 5173,
    },
    cors: true,
  },
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
  plugins: [
    react(),
    crx({ manifest }),
  ],
})
