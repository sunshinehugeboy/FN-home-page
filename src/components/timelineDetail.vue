<template>
  <v-dialog
    v-model="proxyModelValue"
    width="600"
    scrollable
  >
    <v-card class="tl-detail-card" variant="tonal" style="backdrop-filter: blur(var(--leleo-blur));">
      <!-- 标题区 -->
      <div class="tl-detail-header">
        <div class="tl-detail-header-text">
          <div class="tl-detail-date" :style="{ color: 'var(--leleo-vcard-color)' }">{{ formattedDate }}</div>
          <div class="tl-detail-title">{{ eventData?.title }}</div>
        </div>
        <v-btn icon size="small" @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>

      <!-- 正文区 -->
      <v-card-text class="tl-detail-body" v-if="eventData">
        <div class="tl-detail-content" v-if="eventData.content">
          {{ eventData.content }}
        </div>
        <div class="tl-detail-summary-only" v-else>{{ eventData.summary }}</div>
      </v-card-text>

      <!-- 评论区 -->
      <v-divider></v-divider>
      <div class="tl-detail-comments">
        <div class="tl-comments-title" :style="{ color: 'var(--leleo-vcard-color)' }">
          💬 评论 ({{ comments.length }})
        </div>

        <div v-if="comments.length === 0" class="tl-comments-empty">
          还没有评论，说点什么吧~
        </div>

        <div
          v-for="(c, i) in comments"
          :key="i"
          class="tl-comment-item"
        >
          <div class="tl-comment-time">{{ relativeTime(c.time) }}</div>
          <div class="tl-comment-text">{{ c.text }}</div>
        </div>
      </div>

      <!-- 底部评论输入 -->
      <v-divider></v-divider>
      <div class="tl-comment-input">
        <v-textarea
          v-model="newComment"
          variant="outlined"
          density="compact"
          placeholder="写下你的补充..."
          hide-details
          rows="2"
          rounded
        ></v-textarea>
        <v-btn
          variant="tonal"
          :color="'var(--leleo-vcard-color)'"
          :disabled="!newComment.trim()"
          @click="submitComment"
        >
          发送
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import { formatDate, relativeTime, addComment, getComments } from '../utils/timelineStore.js';

export default {
  name: 'timelineDetail',
  props: {
    modelValue: { type: Boolean, default: false },
    eventData: { type: Object, default: null }
  },
  emits: ['update:modelValue', 'commentAdded'],
  data() {
    return {
      comments: [],
      newComment: ''
    };
  },
  computed: {
    formattedDate() { return this.eventData ? formatDate(this.eventData.time) : ''; },
    // 双向绑定 prop，供 v-dialog 的 v-model 使用
    proxyModelValue: {
      get() { return this.modelValue; },
      set(v) { this.$emit('update:modelValue', v); }
    }
  },
  watch: {
    modelValue(val) {
      if (val && this.eventData) {
        this.loadComments();
      }
    },
    eventData() {
      if (this.modelValue) this.loadComments();
    }
  },
  methods: {
    relativeTime,
    closeDialog() {
      this.newComment = '';
      this.$emit('update:modelValue', false);
    },
    loadComments() {
      if (!this.eventData) return;
      const fresh = getComments(this.eventData.id);
      this.comments = [...fresh];
    },
    submitComment() {
      const text = this.newComment.trim();
      if (!text || !this.eventData) return;
      addComment(this.eventData.id, text);
      this.newComment = '';
      this.loadComments();
      this.$emit('commentAdded', this.eventData.id);
    }
  }
};
</script>

<style scoped>
.tl-detail-card { border-radius: 16px; overflow: hidden; }

.tl-detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1rem 1.2rem 0.4rem;
}
.tl-detail-date {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.5px;
}
.tl-detail-title {
  font-size: 1.2rem;
  font-weight: 700;
  margin-top: 2px;
  color: #1f1f1f;
}

.tl-detail-body {
  padding: 0.6rem 1.2rem 1rem;
  font-size: 0.88rem;
  line-height: 1.7;
  color: #333;
}
.tl-detail-content {
  white-space: pre-wrap;
  word-break: break-word;
}
.tl-detail-summary-only {
  color: #666;
  font-style: italic;
}

.tl-detail-comments {
  padding: 0.8rem 1.2rem;
  max-height: 280px;
  overflow-y: auto;
}
.tl-comments-title {
  font-weight: 600;
  font-size: 0.88rem;
  margin-bottom: 0.6rem;
}
.tl-comments-empty {
  text-align: center;
  color: #999;
  font-size: 0.82rem;
  padding: 0.8rem 0;
}
.tl-comment-item {
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(0,0,0,0.06);
}
.tl-comment-item:last-child { border-bottom: none; }
.tl-comment-time {
  font-size: 0.68rem;
  color: #999;
  margin-bottom: 2px;
}
.tl-comment-text {
  font-size: 0.85rem;
  color: #333;
  line-height: 1.5;
  white-space: pre-wrap;
}

.tl-comment-input {
  display: flex;
  gap: 0.5rem;
  padding: 0.8rem 1.2rem;
  align-items: flex-end;
}
.tl-comment-input .v-textarea { flex: 1; }
</style>
