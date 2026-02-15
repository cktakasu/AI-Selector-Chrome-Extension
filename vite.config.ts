import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwind from '@tailwindcss/vite'
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
  icons: {
    "16": "icon.png",
    "32": "icon.png",
    "48": "icon.png",
    "128": "icon.png"
  },
  permissions: []
})

export default defineConfig({
  plugins: [
    react(),
    tailwind(),
    crx({ manifest }),
  ],
})
