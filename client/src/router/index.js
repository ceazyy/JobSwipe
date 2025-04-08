import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/swipe'
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/Register.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/swipe',
      name: 'swipe',
      component: () => import('../views/Swipe.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/matches',
      name: 'matches',
      component: () => import('../views/Matches.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/Profile.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/resume',
      name: 'resume',
      component: () => import('../views/Resume.vue'),
      meta: { requiresAuth: true }
    }
  ]
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  
  // If the route requires authentication
  if (to.meta.requiresAuth) {
    // Check if user is authenticated
    if (!authStore.isAuthenticated) {
      // If not authenticated, redirect to login
      next({ name: 'login' });
      return;
    }
  }
  
  // If the route requires guest (non-authenticated) access
  if (to.meta.requiresGuest) {
    // Check if user is authenticated
    if (authStore.isAuthenticated) {
      // If authenticated, redirect to home
      next({ name: 'swipe' });
      return;
    }
  }
  
  // Allow navigation in all other cases
  next();
});

export default router; 