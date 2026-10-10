<template>
  <div class="tl-wrap" :class="[`tl-${side}`]" :style="{ width: itemWidth + 'px' }" @click="$emit('click')">
    <!-- 波浪节点圆点 -->
    <div class="tl-node" :style="{ background: 'var(--leleo-vcard-color)' }"></div>

    <!-- 卡片 -->
    <div class="tl-card">
      <div class="tl-date">{{ formattedDate }}</div>
      <div class="tl-title">{{ event.title }}</div>
      <div class="tl-summary">{{ event.summary }}</div>
      <div class="tl-meta">
        <span class="tl-comment-tag" v-if="commentsCount > 0">
          💬 {{ commentsCount }}
        </span>
        <span class="tl-comment-tag tl-tag-empty" v-else>点进来看看 →</span>
      </div>
    </div>
  </div>
</template>

<script>
import { formatDate } from '../utils/timelineStore.js';

export default {
  name: 'timelineEvent',
  props: {
    event: { type: Object, required: true },
    side: { type: String, required: true }, // 'up' | 'down' 波浪上下交替
    itemWidth: { type: Number, default: 280 },
    commentsCount: { type: Number, default: 0 }
  },
  computed: {
    formattedDate() { return formatDate(this.event.time); }
  }
};
</script>

<style scoped>
/* 每个 item 占一列，垂直方向以中线为轴心 */
.tl-wrap {
  position: relative;
  flex: 0 0 auto;
  height: 100%;
  cursor: pointer;
}

/* 节点圆点 — 贴在波浪线上（每个 item 中心恰为波峰/波谷） */
.tl-node {
  position: absolute;
  left: 50%;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.85);
  box-shadow: 0 0 0 2px var(--leleo-vcard-color), 0 2px 6px rgba(0,0,0,0.25);
  z-index: 2;
  transform: translate(-50%, -50%);
}
/* 振幅 ±10px，与 timeline.vue 的 wavePath 保持一致 */
.tl-up .tl-node   { top: calc(50% - 10px); }
.tl-down .tl-node { top: calc(50% + 10px); }

/* 卡片：上排 / 下排 */
.tl-card {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 36px);
  backdrop-filter: blur(var(--leleo-blur));
  background: rgba(255, 255, 255, 0.55);
  border-radius: 14px;
  padding: 0.85rem 1.1rem;
  box-shadow: 0 4px 14px rgba(0,0,0,0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.tl-card:hover {
  box-shadow: 0 8px 22px rgba(0,0,0,0.15);
}
.tl-up .tl-card   { bottom: calc(50% + 28px); }
.tl-up .tl-card:hover { transform: translateX(-50%) translateY(-3px); }
.tl-down .tl-card { top: calc(50% + 28px); }
.tl-down .tl-card:hover { transform: translateX(-50%) translateY(3px); }

/* 卡片内部 */
.tl-date {
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--leleo-vcard-color);
  letter-spacing: 0.5px;
  margin-bottom: 2px;
}
.tl-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #1f1f1f;
  line-height: 1.3;
}
.tl-summary {
  font-size: 0.78rem;
  color: #555;
  line-height: 1.5;
  margin-top: 4px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
.tl-meta {
  margin-top: 6px;
  display: flex;
  justify-content: flex-end;
}
.tl-comment-tag {
  font-size: 0.68rem;
  background: rgba(255,255,255,0.7);
  padding: 2px 8px;
  border-radius: 10px;
  color: #555;
}
.tl-tag-empty { color: var(--leleo-vcard-color); font-weight: 500; }
</style>
