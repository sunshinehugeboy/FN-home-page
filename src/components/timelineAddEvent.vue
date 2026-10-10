<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    width="500"
  >
    <v-card class="tl-add-card" variant="tonal" style="backdrop-filter: blur(var(--leleo-blur));">
      <template v-slot:title>
        <span :style="{ color: 'var(--leleo-vcard-color)' }">🌊 新事件</span>
      </template>

      <v-card-text>
        <v-text-field
          v-model="form.title"
          label="标题 *"
          variant="outlined"
          density="compact"
          hide-details
          rounded
        ></v-text-field>

        <v-menu
          :model-value="pickerOpen"
          @update:model-value="pickerOpen = $event"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="290"
        >
          <template v-slot:activator="{ props: activatorProps }">
            <v-text-field
              v-model="form.time"
              label="日期"
              variant="outlined"
              density="compact"
              hide-details
              rounded
              prepend-inner-icon="mdi-calendar"
              readonly
              v-bind="activatorProps"
            ></v-text-field>
          </template>
          <v-date-picker v-model="form.time" @update:model-value="onDatePick"></v-date-picker>
        </v-menu>

        <v-text-field
          v-model="form.summary"
          label="简述"
          variant="outlined"
          density="compact"
          hide-details
          rounded
        ></v-text-field>

        <v-text-field
          v-model="form.content"
          label="详情（帖子正文）"
          variant="outlined"
          density="compact"
          hide-details
          rows="4"
          multiline
          rounded
        ></v-text-field>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="$emit('update:modelValue', false)">取消</v-btn>
        <v-btn
          variant="tonal"
          :color="'var(--leleo-vcard-color)'"
          :disabled="!form.title.trim()"
          @click="submit"
        >
          保存
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { addEvent } from '../utils/timelineStore.js';

export default {
  name: 'timelineAddEvent',
  props: {
    modelValue: { type: Boolean, default: false }
  },
  emits: ['update:modelValue', 'added'],
  data() {
    const today = new Date();
    const time = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
    return {
      pickerOpen: false,
      form: { title: '', time, summary: '', content: '' }
    };
  },
  watch: {
    modelValue(val) {
      if (!val) {
        // 关闭时重置表单
        const t = new Date();
        this.form = {
          title: '',
          time: `${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,'0')}-${String(t.getDate()).padStart(2,'0')}`,
          summary: '',
          content: ''
        };
      }
    }
  },
  methods: {
    onDatePick(val) {
      this.form.time = val;
      this.pickerOpen = false;
    },
    submit() {
      if (!this.form.title.trim()) return;
      addEvent({
        title: this.form.title.trim(),
        time: this.form.time,
        summary: this.form.summary.trim(),
        content: this.form.content.trim()
      });
      this.$emit('added');
      this.$emit('update:modelValue', false);
    }
  }
};
</script>

<style scoped>
.tl-add-card { border-radius: 16px; overflow: hidden; }
</style>
