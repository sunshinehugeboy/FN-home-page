<template>
  <!-- 右上角浮动按钮 -->
  <div class="gb-fab" @click="openDialog = true">
    <v-btn
      :size="isMobile ? 44 : 52"
      color="var(--leleo-vcard-color)"
      variant="tonal"
      class="gb-fab-btn"
    >
      <v-icon :size="isMobile ? 26 : 30" style="color: inherit;">mdi-message-text-outline</v-icon>
    </v-btn>
    <span v-if="unread > 0" class="gb-badge" :style="{ background: 'var(--leleo-vcard-color)' }">
      {{ unread > 99 ? '99+' : unread }}
    </span>
  </div>

  <!-- 留言弹窗 -->
  <v-dialog
    v-model="openDialog"
    width="520"
    scrollable
  >
    <v-card class="gb-card" variant="tonal" style="backdrop-filter: blur(var(--leleo-blur));">
      <!-- 标题 -->
      <div class="gb-header">
        <span class="gb-title" :style="{ color: 'var(--leleo-vcard-color)' }">💌 留言板</span>
        <v-btn icon size="small" @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>

      <!-- 流动式留言列表 -->
      <div class="gb-messages" ref="msgContainer">
        <div v-if="messages.length === 0" class="gb-empty">
          还没有留言，来发第一条吧~
        </div>

        <transition-group name="gb-flow" tag="div" class="gb-flow-list">
          <div
            v-for="(m, i) in messages"
            :key="m.id"
            class="gb-msg-item"
            :style="{ animationDelay: (i * 0.04) + 's' }"
          >
            <div class="gb-msg-body">
              <div class="gb-msg-text">{{ m.text }}</div>
              <div class="gb-msg-meta">
                <span class="gb-msg-name">{{ m.name || '匿名' }}</span>
                <span class="gb-msg-time">{{ relativeTime(m.time) }}</span>
              </div>
            </div>
          </div>
        </transition-group>
      </div>

      <!-- 底部输入区 -->
      <div class="gb-input-area">
        <v-text-field
          v-model="draftName"
          label="昵称（可选）"
          variant="outlined"
          density="compact"
          hide-details
          rounded
          style="width: 140px;"
        ></v-text-field>
        <v-textarea
          v-model="draftText"
          variant="outlined"
          density="compact"
          placeholder="说点什么吧..."
          hide-details
          rows="2"
          rounded
          style="flex: 1;"
        ></v-textarea>
        <v-btn
          variant="tonal"
          :color="'var(--leleo-vcard-color)'"
          :disabled="!draftText.trim()"
          @click="submit"
        >
          发送
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import { relativeTime } from '../utils/timelineStore.js';
import { useDisplay } from 'vuetify';

const LS_GB = 'guestbook_messages';
const LS_GB_UNREAD = 'guestbook_unread_count';

export default {
  name: 'messageBoard',
  setup() {
    const { xs, sm } = useDisplay();
    return { xs, sm };
  },
  computed: {
    isMobile() { return !!(this.xs || this.sm); }
  },
  data() {
    return {
      openDialog: false,
      messages: [],
      draftName: '',
      draftText: '',
      unread: 0,
      pollTimer: null
    };
  },
  mounted() {
    this.loadMessages();
    this.unread = parseInt(localStorage.getItem(LS_GB_UNREAD) || '0', 10);
    // 每 5s 轮询一次（简单实现流动感）
    this.pollTimer = setInterval(this.loadMessages, 5000);
  },
  beforeUnmount() {
    if (this.pollTimer) clearInterval(this.pollTimer);
    localStorage.setItem(LS_GB_UNREAD, '0');
  },
  watch: {
    openDialog(val) {
      if (val) {
        this.unread = 0;
        localStorage.setItem(LS_GB_UNREAD, '0');
        this.$nextTick(() => {
          const c = this.$refs.msgContainer;
          if (c) c.scrollTop = c.scrollHeight;
        });
      }
    }
  },
  methods: {
    relativeTime,
    closeDialog() {
      this.openDialog = false;
    },
    loadMessages() {
      try {
        const raw = localStorage.getItem(LS_GB);
        const list = raw ? JSON.parse(raw) : [];
        // 只在有新消息时 +unread（弹窗关闭状态下）
        if (!this.openDialog && list.length > this.messages.length) {
          this.unread += list.length - this.messages.length;
          localStorage.setItem(LS_GB_UNREAD, String(this.unread));
        }
        this.messages = list.sort((a, b) => new Date(b.time) - new Date(a.time));
      } catch { this.messages = []; }
    },
    submit() {
      const text = this.draftText.trim();
      if (!text) return;
      const name = this.draftName.trim() || '';
      const list = JSON.parse(localStorage.getItem(LS_GB) || '[]');
      list.push({
        id: Date.now() + Math.random().toString(36).slice(2, 6),
        name,
        text,
        time: new Date().toISOString()
      });
      localStorage.setItem(LS_GB, JSON.stringify(list));
      this.draftText = '';
      this.loadMessages();
      this.$nextTick(() => {
        const c = this.$refs.msgContainer;
        if (c) c.scrollTop = c.scrollHeight;
      });
    }
  }
};
</script>

<style scoped>
/* ========== 浮动按钮 ========== */
.gb-fab {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 9999;
}
.gb-fab-btn {
  border-radius: 50% !important;
  box-shadow: 0 4px 14px rgba(0,0,0,0.2) !important;
  transition: transform 0.2s ease;
}
.gb-fab-btn:hover { transform: scale(1.08); }
.gb-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 20px;
  height: 20px;
  border-radius: 10px;
  color: white;
  font-size: 0.68rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 5px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.3);
}

/* ========== 弹窗 ========== */
.gb-card { border-radius: 16px; overflow: hidden; }
.gb-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.9rem 1.2rem;
}
.gb-title { font-size: 1.05rem; font-weight: 700; }

/* ========== 流动消息列表 ========== */
.gb-messages {
  height: 360px;
  overflow-y: auto;
  padding: 0.4rem 1rem;
}
.gb-empty {
  text-align: center;
  color: #999;
  font-size: 0.85rem;
  padding: 3rem 0;
}
.gb-flow-list { display: flex; flex-direction: column; gap: 0.5rem; }

.gb-msg-item {
  animation: gb-enter 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.gb-msg-body {
  backdrop-filter: blur(4px);
  background: rgba(255,255,255,0.55);
  border-radius: 12px;
  padding: 0.6rem 0.85rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.gb-msg-text {
  font-size: 0.85rem;
  line-height: 1.55;
  color: #222;
  word-break: break-word;
  white-space: pre-wrap;
}
.gb-msg-meta {
  margin-top: 4px;
  display: flex;
  justify-content: space-between;
  font-size: 0.68rem;
  color: #888;
}
.gb-msg-name {
  font-weight: 600;
  color: var(--leleo-vcard-color);
}

/* 流动进入动画 */
@keyframes gb-enter {
  from {
    opacity: 0;
    transform: translateY(18px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* transition-group 进出动画 */
.gb-flow-enter-active { animation: gb-enter 0.45s cubic-bezier(0.22, 1, 0.36, 1) both; }
.gb-flow-leave-active {
  transition: opacity 0.25s, transform 0.25s;
}
.gb-flow-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
.gb-flow-move {
  transition: transform 0.3s ease;
}

/* ========== 输入区 ========== */
.gb-input-area {
  display: flex;
  gap: 0.5rem;
  padding: 0.8rem 1rem;
  align-items: flex-end;
  flex-wrap: wrap;
}
</style>
