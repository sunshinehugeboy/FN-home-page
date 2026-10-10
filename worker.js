// Cloudflare Worker 入口（新版 Workers 部署流程用）
// 静态资源由 wrangler.jsonc 的 assets 服务，/api/chat 由本文件代理转发，
// DeepSeek key 从环境变量 env.DEEPSEEK_API_KEY 读取，绝不进前端 bundle。

const UPSTREAM = 'https://api.deepseek.com/chat/completions'

function jsonResponse(status, obj) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  })
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    if (url.pathname === '/api/chat') {
      // 预检请求
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          status: 204,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
        })
      }
      if (request.method !== 'POST') {
        return jsonResponse(405, { error: 'method_not_allowed' })
      }
      try {
        const payload = await request.json()
        const key = env.DEEPSEEK_API_KEY
        if (!key) return jsonResponse(500, { error: 'server_missing_key' })

        const upstream = await fetch(UPSTREAM, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + key,
          },
          body: JSON.stringify({ ...payload, stream: payload.stream !== false }),
        })

        const headers = {
          'Content-Type': upstream.headers.get('content-type') || 'application/json',
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        }
        // 流式/非流式都直接透传上游 body
        return new Response(upstream.body, { status: upstream.status, headers })
      } catch (e) {
        return jsonResponse(500, { error: String((e && e.message) || e) })
      }
    }

    // 其余请求走静态资源
    return env.ASSETS.fetch(request)
  },
}
