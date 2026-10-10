<template>
  <div class="skillbars">
    <div class="skillbar-item" v-for="(skill, i) in skills" :key="skill">
      <div class="skillbar-header">
        <span class="skillbar-name">{{ skill }}</span>
        <span class="skillbar-value">{{ animated[i] }}%</span>
      </div>
      <v-progress-linear
        :model-value="animated[i]"
        :color="barColors[i]"
        rounded
        height="6"
      ></v-progress-linear>
    </div>
  </div>
</template>

<script>
import config from '../config.js';

export default {
  name: 'skillbars',
  data() {
    return {
      configdata: config,
      skills: [],
      skillPoints: [],
      animated: [],
      // 各技能品牌色，未匹配时使用 fallback 循环色
      brandColors: {
        'Vue.js': '#42b883', 'React': '#61dafb', 'JavaScript': '#f7df1e',
        'Node': '#3c873a', 'Java': '#f89820', 'Python': '#3776ab',
        'linux': '#e9c46a', 'Docker': '#2496ed', 'MySQL': '#4479a1',
        'MongoDB': '#47a248', 'AWS': '#ff9900'
      },
      fallbackColors: ['#42b883', '#61dafb', '#f7df1e', '#3c873a', '#f89820', '#3776ab', '#e9c46a', '#2496ed', '#4479a1', '#47a248', '#ff9900', '#a78bfa', '#f472b6', '#38bdf8']
    };
  },
  computed: {
    barColors() {
      return this.skills.map((s, i) => this.brandColors[s] || this.fallbackColors[i % this.fallbackColors.length]);
    }
  },
  mounted() {
    if (import.meta.env.VITE_CONFIG) {
      this.configdata = JSON.parse(import.meta.env.VITE_CONFIG);
    }
    this.skills = this.configdata.polarChart.skills;
    this.skillPoints = this.configdata.polarChart.skillPoints;
    this.animated = this.skills.map(() => 0);
    setTimeout(() => this.animate(), 400);
  },
  methods: {
    // 数字与进度条同步缓动填充
    animate() {
      const duration = 1400;
      const start = performance.now();
      const targets = this.skillPoints;
      const easeOut = t => 1 - Math.pow(1 - t, 3);
      const step = now => {
        const p = Math.min((now - start) / duration, 1);
        const e = easeOut(p);
        this.animated = targets.map(v => Math.round(v * e));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }
  }
};
</script>

<style scoped>
.skillbars {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 0.55rem 1.2rem;
  width: 100%;
  max-width: 320px;
  padding: 0.5rem;
  box-sizing: border-box;
}
.skillbar-item {
  text-align: left;
}
.skillbar-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 2px;
}
.skillbar-name {
  font-size: 0.78rem;
  font-weight: 600;
  opacity: 0.9;
}
.skillbar-value {
  font-size: 0.7rem;
  opacity: 0.65;
  font-variant-numeric: tabular-nums;
}
</style>
