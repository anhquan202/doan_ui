import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '@/layout/DefaultLayout.vue'
import HomeView from '@/views/HomeView.vue'
import publicRoutes from './publicRoutes'
import { sessionStorageHelper } from '@/helpers/sessionStorageHelper'
import RoomView from '@/views/admin/rooms/RoomView.vue'
import { APP_URL } from '@/constants/appUrl'
import CreateRoomView from '@/views/admin/rooms/CreateRoomView.vue'
import EditRoomView from '@/views/admin/rooms/EditRoomView.vue'
import SupplyHomeVue from '@/views/admin/supplies/SupplyHomeVue.vue'
import UtilityHomeView from '@/views/admin/utilities/UtilityHomeView.vue'
import ContractIndex from '@/views/admin/contracts/ContractIndex.vue'
import CreateContractView from '@/views/admin/contracts/CreateContractView.vue'
import CustomerView from '@/views/admin/customers/CustomerView.vue'
import EditCustomerView from '@/views/admin/customers/EditCustomerView.vue'
import ContractDetailView from '@/views/admin/contracts/ContractDetailView.vue'
import VehicleView from '@/views/admin/vehicles/VehicleView.vue'
import MeterReadingsView from '@/views/admin/meter_readings/MeterReadingsView.vue'
import DashBoardView from '@/views/admin/dashboard/DashBoardView.vue'

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
          path: 'dashboard',
          name: 'dashboard',
          component: DashBoardView
        },
        {
          path: APP_URL.ROOM,
          name: 'rooms',
          component: RoomView,
        },
        {
          path: 'rooms/create',
          name: 'rooms.create',
          component: CreateRoomView,
        },
        {
          path: 'rooms/edit/:id',
          name: 'room.edit',
          component: EditRoomView,
        },
        {
          path: 'supplies',
          name: 'supplies',
          component: SupplyHomeVue,
        },
        {
          path: 'contracts',
          name: 'contracts',
          component: ContractIndex,
        },
        {
          path: 'contracts/create',
          name: 'contracts.create',
          component: CreateContractView,
        },
        {
          path: 'contracts/edit/:id',
          name: 'contracts.edit',
          component: () => ContractDetailView
        },
        {
          path: 'customers',
          name: 'customers',
          component: () => CustomerView
        },
        {
          path: 'meter-readings',
          name: 'meter-readings',
          component: () => MeterReadingsView
        },
        {
          path: 'vehicles',
          name: 'vehicles',
          component: () => VehicleView
        },
        {
          path: 'customers/edit/:id',
          name: 'customers.edit',
          component: EditCustomerView
        },
        {
          path: 'utilities',
          name: 'utilities',
          component: UtilityHomeView,
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
