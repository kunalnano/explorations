import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { cloudflare } from '@cloudflare/vite-plugin'
import process from 'node:process'

const port = process.env.PORT ? Number(process.env.PORT) : 5173

export default defineConfig({
  plugins: [react(), cloudflare()],
  base: '/',
  server: {
    port,
    strictPort: !!process.env.PORT,
  },
})
