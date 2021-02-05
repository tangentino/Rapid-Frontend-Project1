import Vue from 'vue';
import VueRouter from 'vue-router';
import 'firebase/auth';
import store from '@/store';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    requiresAuth: false,
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
    requiresAuth: false,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach(async (to, from, next) => {
  if (to.matched.some((x) => x.meta.requiresAuth) && !store.getters('auth/isAuthenticated')) {
    next('/login');
  } else {
    next();
  }
});

export default router;
