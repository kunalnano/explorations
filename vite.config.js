import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const port = process.env.PORT ? Number(process.env.PORT) : 5173
const STATIC_ROUTES = ['resume', 'travel', 'explorations', 'operator']

function staticRouteEntries() {
  let outDir = 'dist'
  return {
    name: 'static-route-entries',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir)
    },
    closeBundle() {
      const indexPath = path.join(outDir, 'index.html')
      if (!fs.existsSync(indexPath)) return
      const indexHtml = fs.readFileSync(indexPath, 'utf8')
      for (const route of STATIC_ROUTES) {
        const routeDir = path.join(outDir, route)
        fs.mkdirSync(routeDir, { recursive: true })
        const routeHtml = indexHtml.replace(
          '<link rel="canonical" href="https://alsharma.com/" />',
          `<link rel="canonical" href="https://alsharma.com/${route}" />`
        )
        fs.writeFileSync(path.join(routeDir, 'index.html'), routeHtml)
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), staticRouteEntries()],
  base: '/',
  server: {
    port,
    strictPort: !!process.env.PORT,
  },
})
