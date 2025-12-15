<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getDashboardService } from '@/services/admin/dashboard/getDashboardService'
import type { DashboardResponse, ContractInfo, RoomStatistics, ContractsStatistics } from '@/types/Dashboard'

const router = useRouter()
const loading = ref(false)
const error = ref('')

const roomStats = ref<RoomStatistics | null>(null)
const contractsStats = ref<ContractsStatistics | null>(null)

const selectedFilter = ref<'new' | 'almost_expired' | 'warning'>('new')

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}

const fetchDashboard = async (filter?: string) => {
  loading.value = true
  error.value = ''
  try {
    const params = filter ? { filter: filter } : undefined
    const res = await getDashboardService(params)
    const data: DashboardResponse = res.data
    roomStats.value = data.room_statistics
    contractsStats.value = data.contracts_statistics
  } catch (err: any) {
    console.error(err)
    error.value = err?.message || 'Không thể tải dữ liệu dashboard'
  } finally {
    loading.value = false
  }
}

const handleFilterChange = async (e: Event) => {
  const val = (e.target as HTMLSelectElement).value as 'new' | 'almost_expired' | 'warning'
  selectedFilter.value = val
  await fetchDashboard(val)
}

const viewAllContracts = () => {
  router.push('/contracts')
}

onMounted(() => {
  fetchDashboard(selectedFilter.value)
})

// Room stats với icon và màu sắc
const roomStatsConfig = computed(() => [
  {
    label: 'Tổng phòng',
    value: roomStats.value?.total_rooms ?? 0,
    icon: '🏢',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600'
  },
  {
    label: 'Phòng trống',
    value: roomStats.value?.total_available_rooms ?? 0,
    icon: '✅',
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50',
    textColor: 'text-green-600'
  },
  {
    label: 'Đang thuê',
    value: roomStats.value?.total_occupied_rooms ?? 0,
    icon: '🔑',
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-600'
  },
  {
    label: 'Đang dọn',
    value: roomStats.value?.total_cleaning_rooms ?? 0,
    icon: '🧹',
    color: 'from-yellow-500 to-yellow-600',
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-600'
  },
  {
    label: 'Đang sửa',
    value: roomStats.value?.total_repairing_rooms ?? 0,
    icon: '🔧',
    color: 'from-red-500 to-red-600',
    bgColor: 'bg-red-50',
    textColor: 'text-red-600'
  }
])

const contractStatsConfig = computed(() => [
  {
    label: 'Hợp đồng mới',
    value: contractsStats.value?.new_contracts_count ?? 0,
    icon: '📝',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    label: 'Gần hết hạn',
    value: contractsStats.value?.almost_expired_contracts_count ?? 0,
    icon: '⏰',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50'
  },
  {
    label: 'Cảnh báo',
    value: contractsStats.value?.warning_contracts_count ?? 0,
    icon: '⚠️',
    color: 'text-red-600',
    bgColor: 'bg-red-50'
  }
])
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
      <p class="text-gray-600">Tổng quan quản lý phòng và hợp đồng</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p class="mt-4 text-gray-600">Đang tải dữ liệu...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
      <div class="flex items-center gap-2">
        <span class="text-xl">⚠️</span>
        <span>{{ error }}</span>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else class="space-y-6">
      <!-- Room Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div v-for="stat in roomStatsConfig" :key="stat.label"
          class="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
          <div class="p-5">
            <div class="flex items-center justify-between mb-3">
              <div
                :class="[stat.bgColor, 'w-12 h-12 rounded-lg flex items-center justify-center text-2xl group-hover:scale-110 transition-transform']">
                {{ stat.icon }}
              </div>
            </div>
            <div class="text-sm text-gray-500 mb-1">{{ stat.label }}</div>
            <div :class="['text-3xl font-bold', stat.textColor]">{{ stat.value }}</div>
          </div>
          <div :class="['h-1 bg-gradient-to-r', stat.color]"></div>
        </div>
      </div>

      <!-- Contracts Section -->
      <div class="bg-white rounded-xl shadow-sm overflow-hidden">
        <!-- Contract Header -->
        <div class="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div class="flex items-center gap-4">
              <div class="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                <span class="text-3xl">📋</span>
              </div>
              <div>
                <h2 class="text-2xl font-bold text-white">Hợp đồng</h2>
                <p class="text-blue-100 text-sm">Quản lý và theo dõi hợp đồng</p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <select @change="handleFilterChange" v-model="selectedFilter"
                class="px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/50 cursor-pointer">
                <option value="new" class="text-gray-800">📝 Mới</option>
                <option value="almost_expired" class="text-gray-800">⏰ Gần hết hạn</option>
                <option value="warning" class="text-gray-800">⚠️ Cảnh báo</option>
              </select>
              <button @click="viewAllContracts"
                class="px-5 py-2 bg-white text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors shadow-lg hover:shadow-xl">
                Xem tất cả →
              </button>
            </div>
          </div>
        </div>

        <!-- Contract Stats -->
        <div class="p-6">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div v-for="stat in contractStatsConfig" :key="stat.label"
              :class="[stat.bgColor, 'rounded-xl p-4 hover:shadow-md transition-all duration-300']">
              <div class="flex items-center gap-3">
                <div class="text-3xl">{{ stat.icon }}</div>
                <div>
                  <div class="text-sm text-gray-600 mb-1">{{ stat.label }}</div>
                  <div :class="['text-2xl font-bold', stat.color]">{{ stat.value }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Contracts Table -->
          <div class="overflow-x-auto rounded-lg border border-gray-200">
            <table class="w-full">
              <thead>
                <tr class="bg-gray-50 border-b border-gray-200">
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Mã HĐ
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Phòng
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Người đại
                    diện</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Bắt đầu
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Kết thúc
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Kỳ hạn
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Đặt cọc
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Trạng
                    thái</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="contract in contractsStats?.contracts || []" :key="contract.id"
                  class="hover:bg-gray-50 transition-colors">
                  <td class="px-4 py-3 text-sm">
                    <span class="font-semibold text-blue-600">{{ contract.contract_code }}</span>
                  </td>
                  <td class="px-4 py-3 text-sm">
                    <span class="inline-flex items-center gap-1">
                      <span class="text-gray-600">🏠</span>
                      <span class="font-medium text-gray-900">{{ contract.room_name }}</span>
                    </span>
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-900">{{ contract.representative_name }}</td>
                  <td class="px-4 py-3 text-sm text-gray-600">{{ contract.start_date_formatted }}</td>
                  <td class="px-4 py-3 text-sm text-gray-600">{{ contract.end_date_formatted }}</td>
                  <td class="px-4 py-3 text-sm">
                    <span
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {{ contract.term_months }} tháng
                    </span>
                  </td>
                  <td class="px-4 py-3 text-sm font-medium text-gray-900">
                    {{ formatCurrency(contract.deposit) }}
                  </td>
                  <td class="px-4 py-3 text-sm">
                    <span
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {{ contract.status_text }}
                    </span>
                  </td>
                </tr>
                <tr v-if="!contractsStats?.contracts || contractsStats.contracts.length === 0">
                  <td colspan="8" class="px-4 py-8 text-center text-gray-500">
                    <div class="flex flex-col items-center gap-2">
                      <span class="text-4xl">📭</span>
                      <span>Không có hợp đồng nào</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>