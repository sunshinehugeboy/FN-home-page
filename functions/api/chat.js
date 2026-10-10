// Cloudflare Pages Function —— 生产环境用的 DeepSeek 代理
// 路由：/api/chat  （对应 functions/api/chat.js）
// 部署时请在 Pages 控制台设置环境变量 DEEPSEEK_API_KEY（不要提交到仓库）
export async function onRequestPost(context) {
  const key = (context.env && context.env.DEEPSEEK_API_KEY) || process.env.DEEPSEEK_API_KEY
  if (!key) {
    return new Response(JSON.stringify({ error: 'server_missing_key' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
  let payload
  try {
    payload = await context.request.json()
  } catch (e) {
    return new Response(JSON.stringify({ error: 'bad_request' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }
  const upstream = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + key },
    body: JSON.stringify({ ...payload, stream: payload.stream !== false }),
  })
  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      'Content-Type': upstream.headers.get('content-type') || 'text/event-stream',
      'Cache-Control': 'no-cache',
    },
  })
}
