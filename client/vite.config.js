import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const currentDir = path.dirname(fileURLToPath(import.meta.url))
  const env = {
    ...loadEnv(mode, path.resolve(currentDir, '..'), ''),
    ...loadEnv(mode, currentDir, ''),
    ...process.env,
  }

  const frontendPort = Number(env.FRONTEND_PORT || 5174)
  const apiTarget = env.VITE_API_TARGET || `http://127.0.0.1:${env.BACKEND_PORT || 5001}`

  return {
    plugins: [react()],
    server: {
      host: true,
      port: frontendPort,
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
        },
      },
    },
  }
})
