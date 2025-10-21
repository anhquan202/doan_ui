import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '@/layout/DefaultLayout.vue'
import HomeView from '@/views/HomeView.vue'
import publicRoutes from './publicRoutes'
import { sessionStorageHelper } from '@/helpers/sessionStorageHelper'
import RoomView from '@/views/admin/rooms/RoomView.vue'
import { APP_URL } from '@/constants/appUrl'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...publicRoutes,

    {
      path: '/',
      component: DefaultLayout,
      meta: { requiresAuth: true },
      redirect: { name: 'rooms' },
      children: [
        {
          path: APP_URL.ROOM,
          name: 'rooms',
          component: RoomView,
        },
        {
          path: 'about',
          name: 'about',
          component: () => import('@/views/AboutView.vue'),
        },
        {
          path: 'home',
          name: 'home',
          component: HomeView,
        }
      ],
    },
  ],
})

router.beforeEach((to, from, next) => {
  const token = sessionStorageHelper.getToken()

  if (token && (to.name === 'sign in' || to.name === 'sign up')) {
    next({ name: 'rooms' })
    return
  }

  if (!token && to.meta.requiresAuth) {
    next({ name: 'sign in' })
    return
  }

  next()
})

export default router
