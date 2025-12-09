<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { Search, X, Filter } from 'lucide-vue-next'
import VueMultiselect from 'vue-multiselect'
import getRoomStatusService, { type RoomStatus } from '@/services/admin/room/getRoomStatusService'

interface SearchFilters {
  q: string
  status: number[]
  room_type: number[]
  price_min: string
  price_max: string
}

interface Props {
  initialFilters?: SearchFilters
}

interface Emits {
  (e: 'search', filters: SearchFilters): void
  (e: 'clear'): void
}

const props = withDefaults(defineProps<Props>(), {})
const emit = defineEmits<Emits>()

const statusOptions = ref<RoomStatus[]>([])
const roomTypeOptions = [
  { key: 0, label: 'Phòng đơn' },
  { key: 1, label: 'Phòng đôi' },
  { key: 2, label: 'Phòng ba' },
]

const statusModel = ref<{ key: number; label: string }[]>([])
const roomTypeModel = ref<{ key: number; label: string }[]>([])

const searchFilters = ref<SearchFilters>({
  q: '',
  status: [],
  room_type: [],
  price_min: '',
  price_max: '',
})

// Computed: Check if any filter is active
const hasActiveFilters = computed(() => {
  return searchFilters.value.q !== '' ||
    searchFilters.value.status.length > 0 ||
    searchFilters.value.room_type.length > 0 ||
    searchFilters.value.price_min !== '' ||
    searchFilters.value.price_max !== ''
})

// Computed: Count active filters
const activeFilterCount = computed(() => {
  let count = 0
  if (searchFilters.value.q) count++
  if (searchFilters.value.status.length > 0) count++
  if (searchFilters.value.room_type.length > 0) count++
  if (searchFilters.value.price_min) count++
  if (searchFilters.value.price_max) count++
  return count
})

onMounted(async () => {
  try {
    const data = await getRoomStatusService()
    statusOptions.value = (data || []).map((item) => ({
      key: typeof item.value === 'string' ? Number(item.value) : item.value,
      label: item.label,
      value: item.value
    }))
  } catch (error) {
    console.error('Lỗi khi tải trạng thái phòng:', error)
  }

  if (props.initialFilters) {
    const f = props.initialFilters
    searchFilters.value = { ...f }

    statusModel.value = statusOptions.value.filter(opt =>
      f.status.includes(opt.key)
    )

    roomTypeModel.value = roomTypeOptions.filter(opt =>
      f.room_type.includes(opt.key)
    )
  }
})

watch(statusModel, (val) => {
  searchFilters.value.status = val.map(v => v.key)
}, { deep: true })

watch(roomTypeModel, (val) => {
  searchFilters.value.room_type = val.map(v => v.key)
})

const handleSearchSubmit = () => {
  emit('search', searchFilters.value)
}

const handleClearFilters = () => {
  searchFilters.value = {
    q: '',
    status: [],
    room_type: [],
    price_min: '',
    price_max: '',
  }

  statusModel.value = []
  roomTypeModel.value = []

  emit('clear')
}

function addTag(newTag: string) {
  const tag = {
    key: Date.now(),
    label: newTag,
  }
  // statusOptions.value.push(tag)
  statusModel.value.push(tag)
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 w-3/4">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Filter class="w-5 h-5 text-blue-600" />
          Bộ lọc tìm kiếm
          <span v-if="activeFilterCount > 0"
            class="ml-2 bg-blue-600 text-white text-xs px-2.5 py-1 rounded-full font-semibold">
            {{ activeFilterCount }}
          </span>
        </h2>

        <button v-if="hasActiveFilters" type="button" @click="handleClearFilters"
          class="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition font-medium border border-red-200 text-sm">
          <X class="w-4 h-4" />
          Xóa tất cả
        </button>
      </div>
    </div>

    <!-- Filters Form -->
    <form @submit.prevent="handleSearchSubmit" class="p-6">
      <div class="space-y-5">
        <!-- Quick Search -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            Tên phòng
          </label>
          <div class="relative">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input v-model="searchFilters.q" type="text" placeholder="Nhập tên phòng để tìm kiếm..."
              class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Trạng thái phòng
            </label>
            <VueMultiselect id="tagging" v-model="statusModel" :options="statusOptions" :hide-selected="true"
              placeholder="Chọn trạng thái..." label="label" select-label="" track-by="key" :multiple="true"
              @tag="addTag">
              <template #noResult>
                <span class="text-gray-500 text-sm">Không tìm thấy kết quả</span>
              </template>
              <template #noOptions>
                <span class="text-gray-500 text-sm">Danh sách trống</span>
              </template>
            </VueMultiselect>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Loại phòng
            </label>
            <VueMultiselect id="tagging" v-model="roomTypeModel" :options="roomTypeOptions" :hide-selected="true"
              placeholder="Chọn trạng thái..." label="label" select-label="" track-by="key" :multiple="true"
              @tag="addTag">
              <template #noResult>
                <span class="text-gray-500 text-sm">Không tìm thấy kết quả</span>
              </template>
              <template #noOptions>
                <span class="text-gray-500 text-sm">Danh sách trống</span>
              </template>
            </VueMultiselect>
          </div>
        </div>

        <!-- Price Range Filter -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            Khoảng giá
          </label>
          <div class="flex items-center gap-3">
            <div class="flex-1">
              <input v-model="searchFilters.price_min" type="number" placeholder="Giá tối thiểu (₫)"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
            </div>
            <span class="text-gray-400 text-lg font-medium flex-shrink-0">~</span>
            <div class="flex-1">
              <input v-model="searchFilters.price_max" type="number" placeholder="Giá tối đa (₫)"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="mt-6 flex justify-end">
          <button type="submit"
            class="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition font-medium shadow-sm hover:shadow-md">
            <Search class="w-4 h-4" />
            Tìm kiếm
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped></style>