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
      path: '/settings',
      name: 'settings',
      meta: { title: 'Settings' },
      component: () => import('../views/SettingsView.vue'),
    },
    {
      path: '/add/mp3',
      name: 'add mp3',
      meta: { title: 'Add MP3' },
      component: () => import('../views/AddManuallyView.vue'),
    },
    {
      path: '/add/spotify',
      name: 'add spotify',
      meta: { title: 'Add from Spotify' },
      component: () => import('../views/AddSpotifyView.vue'),
    },
    {
      path: '/update',
      name: 'update',
      meta: { title: 'Update' },
      component: () => import('../views/UpdateView.vue'),
    },
  ],
});

router.beforeEach((to, from, next) => {
  usePlayerStore().title = to.meta.title as string;
  next();
});

export default router;
