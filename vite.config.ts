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
    default_title: "AI Selecter"
  },
  permissions: []
})

export default defineConfig({
  plugins: [
    react(),
    crx({ manifest }),
  ],
})
