import Vue from 'vue';
import Router from 'vue-router';
import store from './store';

Vue.use(Router);

var router = new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: () => import('@/views/Index'),
      children: [
        // Dashboard
        {
          name: 'Dashboard',
          path: '/dashboard',
          component: () => import('@/views/Dash'),
        },
        // Produtos
        {
          name: 'Produtos',
          path: '/produtos',
          component: () => import('@/views/Products'),
        },
        // categorias
        {
          name: 'Categorias',
          path: '/categorias',
          component: () => import('@/views/Categories'),
        },
        {
          name: 'Dash',
          path: '/dash',
          component: () => import('@/views/Dash'),
        },
        // Pages
        {
          name: 'Login',
          path: '/',
          component: () => import('@/views/pages/Login'),
        },
      ],
    },
  ],
});

router.beforeEach((to, from, next) => {
  // dev

  if (to.path !== '/' && !store.getters.loggedIn) {
    next('/');
  } else if (to.path === '/' && store.getters.loggedIn) {
    next('/dashboard');
  } else {
    next();
  }
});
export default router;
