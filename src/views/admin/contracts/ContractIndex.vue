<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
    <div class="max-w-7xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-3xl font-bold text-slate-800">Danh sách hợp đồng</h2>
          <p class="text-slate-600 mt-1">Quản lý và theo dõi các hợp đồng thuê phòng</p>
        </div>
        <router-link :to="{ name: 'contracts.create' }"
          class="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-6 py-3 rounded-lg shadow-lg shadow-blue-500/30 transition-all duration-200 hover:scale-105">
          <Plus class="size-5" />
          Tạo hợp đồng
        </router-link>
      </div>

      <div v-if="loading" class="bg-white rounded-xl shadow-sm p-12 text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent">
        </div>
        <p class="text-slate-600 mt-4 font-medium">Đang tải hợp đồng...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
        <svg class="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <h3 class="text-red-800 font-semibold">Có lỗi xảy ra</h3>
          <p class="text-red-700 mt-1">{{ error }}</p>
        </div>
      </div>

      <div v-else-if="contracts.length === 0" class="bg-white rounded-xl shadow-sm p-12 text-center">
        <div class="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 class="text-slate-800 font-semibold text-lg mb-2">Chưa có hợp đồng nào</h3>
        <p class="text-slate-600 mb-4">Bắt đầu bằng cách tạo hợp đồng mới</p>
        <router-link :to="{ name: 'contracts.create' }"
          class="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
          <Plus class="size-5" />
          Tạo hợp đồng đầu tiên
        </router-link>
      </div>

      <!-- Table -->
      <div v-else class="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-200">
            <thead class="bg-gradient-to-r from-slate-50 to-slate-100">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Mã HĐ
                </th>
                <th class="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Phòng
                </th>
                <th class="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Số người thuê
                </th>
                <th class="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Đại diện
                </th>
                <th class="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Thời hạn
                </th>
                <th class="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Ngày bắt đầu
                </th>
                <th class="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Ngày kết thúc
                </th>
                <th class="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-slate-200">
              <tr v-for="contract in contracts" :key="contract.id"
                class="hover:bg-slate-50 transition-colors duration-150 cursor-pointer">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText class="size-5 text-blue-600" />
                    </div>
                    <div class="ml-3">
                      <div class="text-sm font-semibold text-slate-900">{{ contract.contract_code }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <Home class="size-5" />
                    <span class="text-sm font-medium text-slate-900">{{ contract.room_name }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <span
                      class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-semibold text-sm">
                      {{ contract.customers_count }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div
                      class="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                      {{ contract.representative_name?.charAt(0)?.toUpperCase() || '?' }}
                    </div>
                    <span class="ml-2 text-sm text-slate-900">{{ contract.representative_name }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                    <Clock class="size-5" />
                    {{ contract.term_months }} tháng
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                  {{ contract.start_date_formatted }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                  {{ contract.end_date_formatted }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold" :class="{
                    'bg-green-100 text-green-800': contract.status === 'active',
                    'bg-yellow-100 text-yellow-800': contract.status === 'warning',
                    'bg-red-100 text-red-800': contract.status === 'cancelled',
                  }">
                    <span class="w-1.5 h-1.5 rounded-full mr-1.5" :class="{
                      'bg-green-500': contract.status === 'active',
                      'bg-yellow-500': contract.status === 'warning',
                      'bg-red-500': contract.status === 'cancelled',
                    }"></span>
                    {{ contract.status_text }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getContractService } from '@/services/admin/contracts/getContractService'
import { Clock, FileText, Home, Plus } from 'lucide-vue-next'

const contracts = ref<any[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const loadContracts = async () => {
  loading.value = true
  error.value = null
  try {
    const res: any = await getContractService()
    const payload = res.data.contracts
    contracts.value = payload
  } catch (err: any) {
    error.value = err?.message || String(err) || 'Lỗi khi tải dữ liệu'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadContracts()
})

</script>

<style scoped>
.btn-primary {
  background: #2563eb;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  text-decoration: none;
}
</style>
