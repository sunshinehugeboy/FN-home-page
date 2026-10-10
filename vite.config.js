import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// 本地开发用的 DeepSeek 代理中间件：
// 前端只调同源的 /api/chat，key 由服务端(.env)读取，绝不进浏览器 bundle
function deepseekProxy() {
  return {
    name: 'deepseek-proxy',
    configureServer(server) {
      server.middlewares.use('/api/chat', async (req, res, next) => {
        if (req.method !== 'POST') { next(); return }
        try {
          let raw = ''
          for await (const chunk of req) raw += chunk
          const payload = JSON.parse(raw || '{}')
          const key = process.env.DEEPSEEK_API_KEY
          if (!key) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            return res.end(JSON.stringify({ error: 'server_missing_key' }))
          }
          const upstream = await fetch('https://api.deepseek.com/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + key },
            body: JSON.stringify({ ...payload, stream: payload.stream !== false }),
          })
          res.statusCode = upstream.status
          res.setHeader('Content-Type', upstream.headers.get('content-type') || 'text/event-stream')
          res.setHeader('Cache-Control', 'no-cache')
          res.setHeader('Access-Control-Allow-Origin', '*')
          if (payload.stream !== false && upstream.body) {
            const reader = upstream.body.getReader()
            const pump = async () => {
              for (;;) {
                const { done, value } = await reader.read()
                if (done) { res.end(); break }
                res.write(Buffer.from(value))
              }
            }
            pump().catch(() => res.end())
          } else {
            res.end(await upstream.text())
          }
        } catch (e) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: String(e && e.message || e) }))
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 加载全部 .env 变量（含非 VITE_ 前缀的 DEEPSEEK_API_KEY）
  const env = loadEnv(mode, process.cwd(), '')
  process.env.DEEPSEEK_API_KEY = env.DEEPSEEK_API_KEY || process.env.DEEPSEEK_API_KEY
  return {
    plugins: [vue(), deepseekProxy()],
  }
})
