<template>
  <div class="dt-root">
    <!-- 聊天面板 -->
    <transition name="dt-pop">
      <div v-if="open" class="dt-panel" :class="{ 'dt-mobile': isMobile }">
        <div class="dt-header">
          <img class="dt-avatar" :src="avatar" alt="数字分身" />
          <div class="dt-hmeta">
            <div class="dt-name">{{ name }} · 数字分身</div>
            <div class="dt-status"><span class="dt-dot"></span>{{ online ? '在线陪聊中' : '离线' }}</div>
          </div>
          <v-btn icon variant="text" class="dt-close" @click="close" aria-label="关闭">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>

        <div class="dt-messages" ref="msgBox">
          <div v-for="(m, i) in messages" :key="i" class="dt-row" :class="m.role">
            <img v-if="m.role === 'assistant'" class="dt-mini" :src="avatar" alt="" />
            <div class="dt-bubble" v-html="renderText(m.text)"></div>
          </div>
          <div v-if="thinking" class="dt-row assistant">
            <img class="dt-mini" :src="avatar" alt="" />
            <div class="dt-bubble dt-typing"><span></span><span></span><span></span></div>
          </div>
        </div>

        <div class="dt-chips" v-if="showChips && !sending">
          <button v-for="c in chips" :key="c" class="dt-chip" @click="send(c)">{{ c }}</button>
        </div>

        <div class="dt-input">
          <textarea
            v-model="draft"
            @keydown.enter.exact.prevent="send()"
            placeholder="和分身聊点什么…（Enter 发送）"
            rows="1"
          ></textarea>
          <v-btn icon color="primary" :disabled="sending" class="dt-send" @click="send()" aria-label="发送">
            <v-icon>mdi-send</v-icon>
          </v-btn>
        </div>

        <div class="dt-foot">
          <button class="dt-clear" @click="clearHistory">清空对话</button>
          <span class="dt-powered">⚡ DeepSeek 驱动</span>
        </div>
      </div>
    </transition>

    <!-- 浮动按钮（右下角，避开右上角留言板） -->
    <button class="dt-fab" :class="{ 'dt-fab-on': open }" @click="toggle" :aria-label="open ? '收起数字分身' : '打开数字分身'">
      <v-icon>{{ open ? 'mdi-close' : 'mdi-robot-happy' }}</v-icon>
      <span v-if="!open && hasNew" class="dt-badge">!</span>
      <span class="dt-ring"></span>
    </button>
  </div>
</template>

<script>
import config from '../config.js'

const STORE_KEY = 'dt_history_v1'

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]))
}

export default {
  name: 'digitalTwin',
  data() {
    return {
      open: false,
      draft: '',
      messages: [],
      thinking: false,
      sending: false,
      showChips: true,
      hasNew: false,
      online: true,
      isMobile: false,
      name: (config.welcometitle || '').replace(/Hi,? ?I'?m ?/i, '').trim() || 'FN',
      avatar: config.avatar || '/img/avatar.jpg',
      chips: ['介绍一下你自己', '你最近在忙什么？', '给我讲个段子', '推荐部电影呗', '你会做什么？'],
    }
  },
  computed: {
    systemPrompt() {
      const tags = (config.tags || []).join('、')
      const events = (config.timeline || []).map(e => `${e.time} ${e.title}`).join('；')
      const projects = (config.projectcards || []).map(p => p.title).join('、')
      const github = (config.socialPlatformIcons || []).find(s => s.icon === 'mdi-github')
      return [
        `你是「${this.name}」的数字分身（AI 虚拟形象），寄生在 ${this.name} 的个人主页上，替他陪来访的客人聊天。`,
        `你的人设：${this.name} 是个爱好骑行、看电影、讲段子的阳光大男孩，标签是：${tags}。`,
        `你了解 ${this.name} 的这些事：最近动态——${events}；他做的项目——${projects}。${github ? `他的 GitHub：${github.link}。` : ''}`,
        `对话要求：`,
        `1. 用中文、第一人称，像 ${this.name} 本人一样亲切、俏皮、偶尔抖个机灵，但别过度；`,
        `2. 回答简洁（通常 1-3 句，复杂问题可稍长），适当用 emoji；`,
        `3. 你不知道的私事或实时信息，就实话实说「这个得问本人」，不要编造；`,
        `4. 如果有人想联系本人，引导他用页面上的社交按钮；`,
        `5. 你是 AI 分身，不是真人，但聊天时保持轻松陪伴的语气。`,
      ].join('\n')
    },
  },
  methods: {
    renderText(text) {
      let s = escapeHtml(text || '')
      s = s.replace(/\n/g, '<br>')
      s = s.replace(/`([^`]+)`/g, '<code>$1</code>')
      s = s.replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
      s = s.replace(/\*([^*]+)\*/g, '<i>$1</i>')
      return s
    },
    greeting() {
      const h = new Date().getHours()
      if (h < 6) return '夜深啦～我是 FN 的数字分身，还在陪你熬夜吗？有什么想聊的跟我说～'
      if (h < 12) return '早上好呀！我是 FN 的数字分身，今天想聊点什么？'
      if (h < 18) return '下午好～我是 FN 的数字分身，无聊了就来找我唠两句！'
      return '晚上好～我是 FN 的数字分身，今天过得怎么样？跟我分享分享呗～'
    },
    toggle() { this.open ? this.close() : this.openPanel() },
    openPanel() {
      this.open = true
      this.hasNew = false
      this.$nextTick(this.scrollToEnd)
    },
    close() { this.open = false },
    loadHistory() {
      try {
        const raw = localStorage.getItem(STORE_KEY)
        if (raw) {
          const arr = JSON.parse(raw)
          if (Array.isArray(arr) && arr.length) { this.messages = arr; return }
        }
      } catch (e) {}
      this.messages = [{ role: 'assistant', text: this.greeting() }]
    },
    persist() {
      try { localStorage.setItem(STORE_KEY, JSON.stringify(this.messages)) } catch (e) {}
    },
    clearHistory() {
      this.messages = [{ role: 'assistant', text: this.greeting() }]
      this.showChips = true
      this.persist()
      this.$nextTick(this.scrollToEnd)
    },
    scrollToEnd() {
      const box = this.$refs.msgBox
      if (box) box.scrollTop = box.scrollHeight
    },
    buildApiMessages() {
      const recent = this.messages.slice(-12).map(m => ({ role: m.role, content: m.text }))
      // 每次请求时动态注入当前时间（LLM 没有时钟，不知道"今天几号"）
      const now = new Date()
      const pad = n => String(n).padStart(2, '0')
      const week = '日一二三四五六'[now.getDay()]
      const dateStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} 星期${week} ${pad(now.getHours())}:${pad(now.getMinutes())}`
      const sys = this.systemPrompt
        + `\n当前真实时间：${dateStr}。凡涉及"今天/现在/几号/星期几"的问题，直接使用这个时间回答。`
      return [{ role: 'system', content: sys }, ...recent]
    },
    async send(text) {
      const content = (typeof text === 'string' ? text : this.draft || '').trim()
      if (!content || this.sending) return
      this.draft = ''
      this.showChips = false
      this.messages.push({ role: 'user', text: content })
      this.persist()
      this.scrollToEnd()

      this.thinking = true
      this.sending = true
      const assistantMsg = { role: 'assistant', text: '' }
      this.messages.push(assistantMsg)

      try {
        const resp = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ model: 'deepseek-chat', stream: true, messages: this.buildApiMessages() }),
        })
        if (!resp.ok) throw new Error('HTTP ' + resp.status)
        const reader = resp.body.getReader()
        const decoder = new TextDecoder()
        let buf = ''
        for (;;) {
          const { done, value } = await reader.read()
          if (done) break
          buf += decoder.decode(value, { stream: true })
          const lines = buf.split('\n')
          buf = lines.pop()
          for (const line of lines) {
            const t = line.trim()
            if (!t.startsWith('data:')) continue
            const data = t.slice(5).trim()
            if (data === '[DONE]') continue
            try {
              const json = JSON.parse(data)
              const delta = json.choices && json.choices[0] && json.choices[0].delta
              if (delta && delta.content) {
                assistantMsg.text += delta.content
                this.scrollToEnd()
              }
            } catch (e) { /* 跳过不完整分片 */ }
          }
        }
        if (!assistantMsg.text) assistantMsg.text = '（分身刚走神了，换句话试试？）'
      } catch (e) {
        this.messages.pop()
        this.messages.push({ role: 'assistant', text: '连接分身失败了：' + e.message + '。稍后再来聊～' })
      } finally {
        this.thinking = false
        this.sending = false
        this.persist()
        this.scrollToEnd()
      }
    },
    onResize() { this.isMobile = window.innerWidth < 640 },
  },
  mounted() {
    this.loadHistory()
    this.onResize()
    window.addEventListener('resize', this.onResize)
    // 进场小彩蛋：偶尔闪一下提示气泡
    setTimeout(() => { if (!this.open) this.hasNew = true }, 2500)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.onResize)
  },
}
</script>

<style scoped>
.dt-root {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 9999;
}
.dt-fab {
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  color: #fff;
  background: linear-gradient(135deg, #7b5cff, #4ad8ff);
  box-shadow: 0 8px 24px rgba(123, 92, 255, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.dt-fab:hover { transform: scale(1.08); }
.dt-fab-on { background: linear-gradient(135deg, #ff7b9c, #ffb14a); box-shadow: 0 8px 24px rgba(255, 123, 156, 0.45); }
.dt-fab :deep(.v-icon) { font-size: 30px; }
.dt-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.6);
  animation: dt-pulse 2.4s ease-out infinite;
  pointer-events: none;
}
@keyframes dt-pulse {
  0% { transform: scale(1); opacity: 0.7; }
  100% { transform: scale(1.5); opacity: 0; }
}
.dt-badge {
  position: absolute;
  top: -2px;
  right: -2px;
  background: #ff4d6d;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.dt-panel {
  position: absolute;
  bottom: 76px;
  right: 0;
  width: 380px;
  height: 560px;
  max-height: calc(100vh - 120px);
  background: rgba(20, 22, 35, 0.92);
  backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 18px;
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  color: #eee;
}
.dt-mobile {
  width: calc(100vw - 32px);
  height: calc(100vh - 120px);
  right: -8px;
}
.dt-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  background: linear-gradient(135deg, rgba(123, 92, 255, 0.25), rgba(74, 216, 255, 0.12));
}
.dt-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.5);
}
.dt-hmeta { flex: 1; min-width: 0; }
.dt-name { font-weight: 700; font-size: 14px; }
.dt-status { font-size: 12px; color: #9fe6c0; display: flex; align-items: center; gap: 5px; }
.dt-dot { width: 7px; height: 7px; border-radius: 50%; background: #46e08a; box-shadow: 0 0 8px #46e08a; }
.dt-close { color: #ccc; }
.dt-messages {
  flex: 1;
  overflow-y: auto;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.dt-row { display: flex; gap: 8px; align-items: flex-end; }
.dt-row.user { flex-direction: row-reverse; }
.dt-mini { width: 26px; height: 26px; border-radius: 50%; object-fit: cover; flex-shrink: 0; }
.dt-bubble {
  max-width: 78%;
  padding: 9px 12px;
  border-radius: 14px;
  font-size: 14px;
  line-height: 1.55;
  word-break: break-word;
  white-space: normal;
}
.dt-row.assistant .dt-bubble {
  background: rgba(255, 255, 255, 0.1);
  border-bottom-left-radius: 4px;
}
.dt-row.user .dt-bubble {
  background: linear-gradient(135deg, #7b5cff, #4ad8ff);
  color: #fff;
  border-bottom-right-radius: 4px;
}
.dt-bubble :deep(code) {
  background: rgba(0, 0, 0, 0.35);
  padding: 1px 5px;
  border-radius: 5px;
  font-size: 12px;
}
.dt-bubble :deep(b) { color: #ffd86b; }
.dt-typing { display: flex; gap: 4px; align-items: center; }
.dt-typing span {
  width: 7px; height: 7px; border-radius: 50%; background: #bbb;
  animation: dt-blink 1.2s infinite;
}
.dt-typing span:nth-child(2) { animation-delay: 0.2s; }
.dt-typing span:nth-child(3) { animation-delay: 0.4s; }
@keyframes dt-blink { 0%, 60%, 100% { opacity: 0.3; } 30% { opacity: 1; } }
.dt-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  padding: 0 14px 10px;
}
.dt-chip {
  border: 1px solid rgba(123, 92, 255, 0.5);
  background: rgba(123, 92, 255, 0.12);
  color: #d8ccff;
  font-size: 12.5px;
  padding: 5px 10px;
  border-radius: 999px;
  cursor: pointer;
  transition: background 0.15s;
}
.dt-chip:hover { background: rgba(123, 92, 255, 0.3); }
.dt-input {
  display: flex;
  gap: 8px;
  align-items: flex-end;
  padding: 10px 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}
.dt-input textarea {
  flex: 1;
  resize: none;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
  padding: 10px 12px;
  font-size: 14px;
  max-height: 90px;
  outline: none;
}
.dt-input textarea:focus { border-color: #7b5cff; }
.dt-send { background: #7b5cff !important; }
.dt-foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 14px 10px;
  font-size: 11px;
  color: #8a8fa3;
}
.dt-clear {
  background: none; border: none; color: #8a8fa3; cursor: pointer; font-size: 11px;
}
.dt-clear:hover { color: #ff8aa0; }
.dt-powered { color: #6fb6ff; }
.dt-pop-enter-active, .dt-pop-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.dt-pop-enter-from, .dt-pop-leave-to { opacity: 0; transform: translateY(10px) scale(0.96); }
</style>
