import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { crx, defineManifest } from '@crxjs/vite-plugin'
import pkg from './package.json' with { type: 'json' }

const manifest = defineManifest({
  manifest_version: 3,
  name: "AI Selecter",
  version: pkg.version,
  description: "Simple launcher for AI services",
  action: {
    default_popup: "index.html",
    default_title: "AI Selecter",
    default_icon: "icon-48.png"
  },
  icons: {
    "16": "icon-16.png",
    "32": "icon-32.png",
    "48": "icon-48.png",
    "128": "icon-128.png"
  },
  permissions: ["clipboardWrite", "tabs", "storage"],
  content_scripts: [{
    matches: [
      "https://claude.ai/*",
      "https://gemini.google.com/*",
      "https://manus.im/*",
      "https://www.genspark.ai/*"
    ],
    js: ["src/content-script.js"],
    run_at: "document_idle"
  }]
})

export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
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
    reportCompressedSize: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  plugins: [
    react(),
    crx({ manifest }),
  ],
})
