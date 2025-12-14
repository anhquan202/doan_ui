<script setup lang="ts">
import { ref, onMounted } from 'vue'
import showService from '@/services/admin/room/showService'
import type { Room as RoomType, Meta, RoomQueryParams } from '@/services/admin/room/showService'
import { Plus, Edit2, Eye } from 'lucide-vue-next'
import Paginate from '@/components/Paginate.vue'
import RoomSearchForm from '@/components/room/RoomSearchForm.vue'
import { APP_URL } from '@/constants/appUrl'
import { useRouter, useRoute } from 'vue-router'

interface SearchFilters {
  q: string
  status: number[]
  room_type: number[]
  price_min: string
  price_max: string
}

const router = useRouter()
const route = useRoute()

const rooms = ref<RoomType[]>([])
const meta = ref<Meta | null>(null)
const currentPage = ref(1)
const loading = ref(false)

// State cho filter
const searchFilters = ref<SearchFilters>({
  q: '',
  status: [],
  room_type: [],
  price_min: '',
  price_max: '',
})

// ---------------------------------------------------------
// INIT FILTER FROM URL
// ---------------------------------------------------------
const initializeFiltersFromUrl = () => {
  const q = (route.query.q as string) || ''

  const statusRaw = route.query.status
  const roomTypeRaw = route.query.room_type

  const status = statusRaw
    ? (Array.isArray(statusRaw) ? statusRaw : [statusRaw]).map(v => Number(v))
    : []

  const room_type = roomTypeRaw
    ? (Array.isArray(roomTypeRaw) ? roomTypeRaw : [roomTypeRaw]).map(v => Number(v))
    : []

  const price_min = (route.query.price_min as string) || ''
  const price_max = (route.query.price_max as string) || ''

  searchFilters.value = {
    q,
    status,
    room_type,
    price_min,
    price_max,
  }
}

const buildQueryParams = (filters: SearchFilters): RoomQueryParams => {
  const params: RoomQueryParams = {}

  if (filters.q) params.q = filters.q
  if (filters.status.length > 0) params.status = filters.status
  if (filters.room_type.length > 0) params.room_type = filters.room_type
  if (filters.price_min) params.price_min = Number(filters.price_min)
  if (filters.price_max) params.price_max = Number(filters.price_max)

  return params
}

const updateUrlParams = (filters: SearchFilters) => {
  const queryParams: any = {}

  if (filters.q) queryParams.q = filters.q
  if (filters.status.length > 0) queryParams.status = filters.status
  if (filters.room_type.length > 0) queryParams.room_type = filters.room_type
  if (filters.price_min) queryParams.price_min = filters.price_min
  if (filters.price_max) queryParams.price_max = filters.price_max

  router.push({ name: 'rooms', query: queryParams })
}

const fetchRooms = async (page = 1) => {
  loading.value = true
  try {
    const queryParams = buildQueryParams(searchFilters.value)
    const res = await showService(page, queryParams)

    rooms.value = res.rooms
    meta.value = res.meta
    currentPage.value = res.meta.current_page
  } catch (e) {
    console.error('Lỗi khi tải danh sách phòng:', e)
  } finally {
    loading.value = false
  }
}

const handleSearchSubmit = (filters: SearchFilters) => {
  searchFilters.value = filters
  updateUrlParams(filters)
  fetchRooms(1)
}

const handleClearFilters = () => {
  searchFilters.value = {
    q: '',
    status: [],
    room_type: [],
    price_min: '',
    price_max: '',
  }

  router.push({ name: 'rooms', query: {} })
  fetchRooms(1)
}

onMounted(() => {
  initializeFiltersFromUrl()
  fetchRooms()
})

const handleChangePage = (page: number) => fetchRooms(page)

// Detail modal
const selectedRoom = ref<RoomType | null>(null)
const showDetailModal = ref(false)
const modalComponent = ref<any | null>(null)

const openDetail = async (room: RoomType) => {
  selectedRoom.value = room
  if (!modalComponent.value) {
    const mod = await import('./RoomDetailModal.vue')
    modalComponent.value = mod.default || mod
  }
  showDetailModal.value = true
}

const closeDetail = () => {
  showDetailModal.value = false
  selectedRoom.value = null
}

// Status UI map
const getStatusInfo = (status: string | null) => {
  const map: Record<string, { label: string; bg: string; text: string }> = {
    available: { label: 'Còn trống', bg: 'bg-green-100', text: 'text-green-700' },
    occupied: { label: 'Đang thuê', bg: 'bg-blue-100', text: 'text-blue-700' },
    cleaning: { label: 'Đang dọn', bg: 'bg-yellow-100', text: 'text-yellow-700' },
    repairing: { label: 'Sửa chữa', bg: 'bg-red-100', text: 'text-red-700' },
  }
  return map[status || ''] || { label: 'Không xác định', bg: 'bg-gray-100', text: 'text-gray-700' }
}
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex flex-wrap items-center justify-between gap-3">
      <h1 class="text-2xl font-bold tracking-tight text-gray-800">
        Danh sách phòng
      </h1>
      <a :href="APP_URL.CREATE_ROOM"
        class="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition">
        <Plus class="h-4 w-4" />
        Tạo phòng mới
      </a>
    </div>

    <!-- Search Form Component -->
    <RoomSearchForm :initialFilters="searchFilters" @search="handleSearchSubmit" @clear="handleClearFilters" />

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-10">
      <span class="text-gray-500 animate-pulse">Đang tải danh sách phòng...</span>
    </div>

    <!-- Table -->
    <div v-else class="rounded-lg overflow-hidden shadow-sm bg-white">
      <table class="w-full">
        <thead class="bg-gray-100">
          <tr class="text-left text-gray-700">
            <th class="px-4 py-3">Tên phòng</th>
            <th class="px-4 py-3">Loại phòng</th>
            <th class="px-4 py-3">Giá</th>
            <th class="px-4 py-3">Trạng Thái</th>
            <th class="px-4 py-3">Mô Tả</th>
            <th class="px-4 py-3 text-right"></th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="rooms.length === 0" class="text-center text-gray-500">
            <td colspan="6" class="py-8">Không có phòng nào phù hợp.</td>
          </tr>

          <tr v-for="(room, idx) in rooms" :key="room.id" :class="idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'">
            <td class="px-4 py-3 font-medium">{{ room.room_name }}</td>
            <td class="px-4 py-3 capitalize">{{ room.room_type_label }}</td>
            <td class="px-4 py-3">{{ room.price?.toLocaleString('vi-VN') }}₫</td>
            <td class="px-4 py-3">
              <span v-if="room.status" :class="[
                'px-2 py-1 text-xs font-semibold rounded-full',
                getStatusInfo(room.status).bg,
                getStatusInfo(room.status).text
              ]">
                {{ getStatusInfo(room.status).label }}
              </span>
              <span v-else class="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700">
                Không xác định
              </span>
            </td>
            <td class="px-4 py-3 text-sm text-gray-500 truncate max-w-xs">
              {{ room.description || '—' }}
            </td>
            <td class="px-4 py-3 text-right">
              <div class="flex justify-end gap-2">
                <button @click="openDetail(room)"
                  class="h-8 w-8 flex items-center justify-center rounded-md hover:bg-gray-200 transition">
                  <Eye class="h-4 w-4" />
                </button>
                <router-link :to="{ name: 'room.edit', params: { id: room.id } }"
                  class="h-8 w-8 flex items-center justify-center rounded-md hover:bg-gray-200 transition">
                  <Edit2 class="h-4 w-4 text-gray-700" />
                </router-link>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="flex justify-end pt-4">
      <Paginate :meta="meta" :currentPage="currentPage" @change-page="handleChangePage" />
    </div>
  </div>

  <component v-if="showDetailModal && modalComponent" :is="modalComponent" :room="selectedRoom"
    :onClose="closeDetail" />
</template>

<style scoped>
.bg-primary {
  background-color: #2563eb;
}
</style>
