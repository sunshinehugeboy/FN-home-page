// 时间河数据层：合并 config.js 初始事件 + localStorage 新增事件/评论
import config from '../config.js';

const LS_EVENTS = 'timeline_user_events';
const LS_COMMENTS_PREFIX = 'timeline_comments_';

function safeParse(raw, fallback) {
  try { return raw ? JSON.parse(raw) : fallback; } catch { return fallback; }
}

function getUserEvents() {
  return safeParse(localStorage.getItem(LS_EVENTS), []);
}

function saveUserEvents(list) {
  localStorage.setItem(LS_EVENTS, JSON.stringify(list));
}

// 合并 config.js 事件 + localStorage 新增事件，按 time 降序
export function getEvents() {
  let initList = config.timeline || [];
  if (import.meta.env.VITE_CONFIG) {
    try {
      const v = JSON.parse(import.meta.env.VITE_CONFIG);
      if (v.timeline) initList = v.timeline;
    } catch {}
  }
  const userList = getUserEvents();
  const all = [...initList, ...userList];
  all.sort((a, b) => new Date(b.time) - new Date(a.time));
  return all;
}

export function addEvent({ title, time, summary, content }) {
  const userList = getUserEvents();
  const id = 'user-' + Date.now();
  userList.push({ id, time, title, summary, content, comments: [] });
  saveUserEvents(userList);
  return id;
}

export function getComments(eventId) {
  // config.js 里写死的 comments（如果有）
  const initList = config.timeline || [];
  if (import.meta.env.VITE_CONFIG) {
    try { const v = JSON.parse(import.meta.env.VITE_CONFIG); if (v.timeline) initList = v.timeline; } catch {}
  }
  const initItem = initList.find(e => e.id === eventId);
  const initComments = initItem?.comments || [];

  // localStorage 追加的评论
  const lsRaw = localStorage.getItem(LS_COMMENTS_PREFIX + eventId);
  const lsComments = safeParse(lsRaw, []);

  return [...initComments, ...lsComments].sort((a, b) => new Date(a.time) - new Date(b.time));
}

export function addComment(eventId, text) {
  const list = safeParse(localStorage.getItem(LS_COMMENTS_PREFIX + eventId), []);
  list.push({ time: new Date().toISOString(), text });
  localStorage.setItem(LS_COMMENTS_PREFIX + eventId, JSON.stringify(list));
}

// 相对时间：3 天前、2 小时前、刚刚
export function relativeTime(isoStr) {
  if (!isoStr) return '';
  const diff = Date.now() - new Date(isoStr).getTime();
  const min = 60_000, hr = 3_600_000, day = 86_400_000;
  if (diff < min) return '刚刚';
  if (diff < hr) return Math.floor(diff / min) + ' 分钟前';
  if (diff < day) return Math.floor(diff / hr) + ' 小时前';
  if (diff < day * 7) return Math.floor(diff / day) + ' 天前';
  return new Date(isoStr).toLocaleDateString('zh-CN');
}

export function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}
