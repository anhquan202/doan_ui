import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import publicRoutes from './publicRoutes'
import { localStorageHelper } from '@/helpers/localstorageHelper'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...publicRoutes,
    {
      path: '/',
      name: 'home',
      meta: { requiresAuth: true },
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      meta: { requiresAuth: true },
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

router.beforeEach((to, from, next) => {
  const token = localStorageHelper.getToken()

  if (token && (to.name === 'sign in' || to.name === 'sign up')) {
    next({ name: 'home' })
    return
  }

  const isProtected = to.meta.requiresAuth
  if (!token && isProtected) {
    next({ name: 'sign in' })
    return
  }

  next()
})

export default router
