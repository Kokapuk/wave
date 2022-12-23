import { usePlayerStore } from '@/stores/player';
import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      meta: { title: 'Your Library' },
      component: HomeView,
    },
    {
      path: '/add',
      name: 'add',
      meta: { title: 'Add' },
      component: () => import('../views/AddView.vue'),
    },
    {
      path: '/settings',
      name: 'settings',
      meta: { title: 'Settings' },
      component: () => import('../views/SettingsView.vue'),
    },
  ],
});

router.beforeEach((to) => {
  usePlayerStore().title = to.meta.title as string;
});

export default router;
