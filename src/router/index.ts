import { usePlayerStore } from '@/stores/player';
import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
  history: createWebHashHistory(),
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

router.beforeEach((to, from, next) => {
  usePlayerStore().title = to.meta.title as string;
  next();
});

export default router;
