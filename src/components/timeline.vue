<template>
  <div class="timeline-wrap">
    <!-- 标题栏 + 新增按钮 -->
    <div class="tl-header">
      <span class="tl-title-text" :style="{ color: 'var(--leleo-vcard-color)' }">🌊 时间河</span>
      <v-btn
        variant="tonal"
        density="compact"
        size="small"
        :color="'var(--leleo-vcard-color)'"
        icon="mdi-plus"
        @click="$emit('add')"
        title="添加新事件"
      ></v-btn>
    </div>

    <!-- 横向波浪时间线：可拖拽 / 滚轮 / 触摸滑动 -->
    <div
      class="tl-scroll"
      ref="scroller"
      :class="{ 'tl-grabbing': dragging }"
      @pointerdown="onDown"
      @pointermove="onMove"
      @pointerup="onUp"
      @pointercancel="onUp"
      @pointerleave="onUp"
      @wheel.prevent="onWheel"
      @scroll="onScroll"
      @click.capture="onClickCapture"
    >
      <div class="tl-track" :style="{ height: trackHeight + 'px', width: waveWidth + 'px' }">
        <!-- 波浪中线 -->
        <svg
          class="tl-wave"
          :width="waveWidth"
          :height="trackHeight"
          :viewBox="`0 0 ${waveWidth} ${trackHeight}`"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            :d="wavePath"
            fill="none"
            stroke="var(--leleo-vcard-color)"
            stroke-width="3"
            stroke-linecap="round"
            opacity="0.35"
          />
        </svg>

        <div v-if="events.length === 0" class="tl-empty">
          还没有事件，点右上角 + 添加第一条吧~
        </div>

        <timeline-event
          v-for="(ev, idx) in displayEvents"
          :key="ev.id"
          :event="ev"
          :side="idx % 2 === 0 ? 'up' : 'down'"
          :item-width="itemWidth"
          :comments-count="getCommentCount(ev.id)"
          @click="$emit('open', ev)"
        />

        <!-- 波浪末尾：添加新事件的“+”节点（坐在波浪线上，与事件交替起伏） -->
        <div
          class="tl-wrap tl-add-col"
          :class="`tl-${addNodeSide}`"
          :style="{ width: itemWidth + 'px' }"
          @click="$emit('add')"
        >
          <div class="tl-add-node"><span class="tl-add-plus">+</span></div>
          <div class="tl-add-label">添加新事件</div>
        </div>
      </div>

      <!-- 右侧渐隐提示 -->
      <transition name="tl-fade">
        <div v-if="canScrollRight" class="tl-hint" :style="{ color: 'var(--leleo-vcard-color)' }">
          <span class="tl-hint-arrow">›</span>
        </div>
      </transition>
    </div>

    <!-- 底部：添加新事件入口 -->
    <div class="tl-footer">
      <v-btn
        variant="tonal"
        :color="'var(--leleo-vcard-color)'"
        prepend-icon="mdi-plus"
        rounded
        @click="$emit('add')"
      >
        添加新事件
      </v-btn>
    </div>
  </div>
</template>

<script>
import timelineEvent from './timelineEvent.vue';
import { getEvents, getComments } from '../utils/timelineStore.js';
import { useDisplay } from 'vuetify';

export default {
  name: 'timeline',
  components: { timelineEvent },
  props: ['configdata'],
  emits: ['open', 'add'],
  setup() {
    const { xs, sm } = useDisplay();
    return { xs, sm };
  },
  computed: {
    isMobile() {
      return !!(this.xs || this.sm);
    },
    itemWidth() {
      return this.isMobile ? 210 : 280;
    },
    trackHeight() {
      return this.isMobile ? 240 : 280;
    },
    // 波浪总宽 = (事件数 + 末尾“+”节点) × 单项宽
    waveWidth() {
      return Math.max((this.events.length + 1) * this.itemWidth, 400);
    },
    // 末尾的“+”节点也坐在波浪线上，与事件交替起伏
    addNodeSide() {
      return this.events.length % 2 === 0 ? 'up' : 'down';
    },
    // 正弦波浪 path：每个事件中心恰好在波峰/波谷（与卡片上下交替对应）
    wavePath() {
      const W = this.itemWidth;
      const amp = 10;
      const mid = this.trackHeight / 2;
      // 段数 = 事件数 + 1（末尾“+”节点也要落在波浪上）
      const cols = this.events.length + 1;
      let d = `M 0 ${mid}`;
      let up = true;
      for (let i = 0; i < cols; i++) {
        const x = i * W;
        const cx = x + W / 2;
        const cy = mid + (up ? -amp : amp);
        d += ` Q ${cx} ${cy}, ${x + W} ${mid}`;
        up = !up;
      }
      return d;
    },
    // 河流从左往右流：旧事件在左，最新事件在最右
    displayEvents() {
      return [...this.events].reverse();
    }
  },
  data() {
    return {
      events: [],
      commentCountCache: {},
      dragging: false,
      dragStartX: 0,
      dragStartScroll: 0,
      dragMoved: 0,
      canScrollRight: false
    };
  },
  mounted() {
    this.refresh();
    this.updateCanScroll();
    window.addEventListener('storage', this.onStorage);
    window.addEventListener('resize', this.updateCanScroll);
  },
  beforeUnmount() {
    window.removeEventListener('storage', this.onStorage);
    window.removeEventListener('resize', this.updateCanScroll);
  },
  methods: {
    refresh() {
      this.events = getEvents();
      this.commentCountCache = {};
      this.events.forEach(ev => {
        this.commentCountCache[ev.id] = getComments(ev.id).length;
      });
      // 等 DOM 渲染后再测量，否则读到旧宽度
      this.$nextTick(() => this.updateCanScroll());
    },
    getCommentCount(id) {
      if (!(id in this.commentCountCache)) {
        this.commentCountCache[id] = getComments(id).length;
      }
      return this.commentCountCache[id];
    },
    bumpComment(id) {
      this.commentCountCache[id] = (this.commentCountCache[id] || 0) + 1;
    },
    // 新增事件后自动滑到最右（最新事件所在处）
    reloadAfterAdd() {
      this.refresh();
      this.$nextTick(() => {
        const s = this.$refs.scroller;
        if (s) s.scrollTo({ left: s.scrollWidth, behavior: 'smooth' });
      });
    },
    onStorage() { this.refresh(); this.updateCanScroll(); },

    /* ===== 拖拽滑动 ===== */
    onDown(e) {
      this.dragging = true;
      this.dragMoved = 0;
      this.dragStartX = e.clientX;
      this.dragStartScroll = this.$refs.scroller.scrollLeft;
    },
    onMove(e) {
      if (!this.dragging) return;
      const dx = e.clientX - this.dragStartX;
      this.dragMoved = Math.max(this.dragMoved, Math.abs(dx));
      this.$refs.scroller.scrollLeft = this.dragStartScroll - dx;
    },
    onUp() {
      this.dragging = false;
    },
    // 拖拽过就不触发卡片点击，避免误开详情
    onClickCapture(e) {
      if (this.dragMoved > 6) {
        e.stopPropagation();
        e.preventDefault();
        this.dragMoved = 0;
      }
    },
    // 鼠标滚轮 / 触摸板纵向滚动 → 转横向
    onWheel(e) {
      const s = this.$refs.scroller;
      if (!s) return;
      s.scrollLeft += (e.deltaY || 0) + (e.deltaX || 0);
      this.updateCanScroll();
    },
    onScroll() {
      this.updateCanScroll();
    },
    updateCanScroll() {
      const s = this.$refs.scroller;
      if (!s) { this.canScrollRight = false; return; }
      this.canScrollRight = s.scrollLeft + s.clientWidth < s.scrollWidth - 8;
    }
  }
};
</script>

<style scoped>
.timeline-wrap {
  width: 100%;
  padding: 0.5rem 1rem 1.5rem;
  box-sizing: border-box;
}

.tl-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
.tl-title-text {
  font-size: 1.05rem;
  font-weight: 700;
}

/* ===== 横向滚动区 ===== */
.tl-scroll {
  position: relative;
  overflow-x: auto;
  overflow-y: hidden;
  cursor: grab;
  scrollbar-width: none;           /* Firefox 隐藏滚动条 */
  -ms-overflow-style: none;        /* IE 隐藏滚动条 */
}
.tl-scroll::-webkit-scrollbar { display: none; }
.tl-scroll.tl-grabbing { cursor: grabbing; }

.tl-track {
  position: relative;
  display: flex;
  align-items: stretch;
  width: max-content;
  min-width: 100%;
}

/* 波浪线 */
.tl-wave {
  position: absolute;
  left: 0;
  top: 0;
  pointer-events: none;
}

.tl-empty {
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  text-align: center;
  color: #888;
  font-size: 0.85rem;
}

/* 右缘渐隐 + 滑动提示 */
.tl-hint {
  position: absolute;
  right: 2px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  display: flex;
  align-items: center;
  padding: 6px 4px 6px 20px;
  background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.55));
  border-radius: 8px;
  animation: tl-nudge 1.6s ease-in-out infinite;
}
.tl-hint-arrow {
  font-size: 1.6rem;
  font-weight: 700;
  line-height: 1;
}
@keyframes tl-nudge {
  0%, 100% { transform: translateY(-50%) translateX(0); }
  50% { transform: translateY(-50%) translateX(5px); }
}
.tl-fade-leave-active { transition: opacity 0.4s; }
.tl-fade-leave-to { opacity: 0; }

/* ===== 波浪末尾的“+”添加节点 ===== */
.tl-add-col { cursor: pointer; }
.tl-add-node {
  position: absolute;
  left: 50%;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 3px dashed var(--leleo-vcard-color);
  background: rgba(255, 255, 255, 0.6);
  color: var(--leleo-vcard-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
  transform: translate(-50%, -50%);
  z-index: 3;
  transition: transform 0.15s ease, background 0.15s ease, color 0.15s ease, box-shadow 0.15s ease;
}
.tl-add-node:hover {
  background: var(--leleo-vcard-color);
  color: #fff;
  transform: translate(-50%, -50%) scale(1.14);
  box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.06);
}
/* 振幅 ±10px，与 tl-node 保持一致 */
.tl-up .tl-add-node   { top: calc(50% - 10px); }
.tl-down .tl-add-node { top: calc(50% + 10px); }

.tl-add-label {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 36px);
  text-align: center;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--leleo-vcard-color);
  pointer-events: none;
}
.tl-up .tl-add-label   { bottom: calc(50% + 28px); }
.tl-down .tl-add-label { top: calc(50% + 28px); }

/* ===== 底部：添加新事件入口 ===== */
.tl-footer {
  display: flex;
  justify-content: center;
  margin-top: 1.1rem;
}
</style>
