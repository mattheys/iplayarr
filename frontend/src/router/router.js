import { createRouter, createWebHistory } from 'vue-router';
import QueuePage from '@/views/QueuePage.vue';
import LogsPage from '@/views/LogsPage.vue';

const routes = [
  { path: '/', redirect: '/queue' },
  { path: '/queue', component: QueuePage },
  { path: '/logs', component: LogsPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
