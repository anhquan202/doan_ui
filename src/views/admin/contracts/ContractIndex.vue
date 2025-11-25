<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
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

      <!-- Loading -->
      <div v-if="loading" class="bg-white rounded-xl shadow-sm p-12 text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent">
        </div>
        <p class="text-slate-600 mt-4 font-medium">Đang tải hợp đồng...</p>
      </div>

      <!-- Error -->
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

      <!-- Empty State -->
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
              <tr class="text-nowrap">
                <th class="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Mã HĐ</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Phòng</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Số người thuê
                </th>
                <th class="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Đại diện</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Thời hạn</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Ngày bắt đầu
                </th>
                <th class="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Ngày kết thúc
                </th>
                <th class="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Trạng thái
                </th>
                <th class="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-slate-200">
              <tr v-for="contract in contracts" :key="contract.id"
                class="hover:bg-slate-50 transition-colors duration-150">
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

                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{{ contract.start_date_formatted }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{{ contract.end_date_formatted }}</td>

                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusBadgeClass(contract.status)"
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold">
                    {{ contract.status_text }}
                  </span>
                </td>

                <td class="px-6 py-4 whitespace-nowrap flex gap-2">
                  <button @click="viewContract(contract)" class="p-2 rounded hover:bg-slate-100" title="Xem chi tiết">
                    <Eye class="size-4 text-slate-600" />
                  </button>
                  <button @click="editContract(contract)" class="p-2 rounded hover:bg-slate-100" title="Chỉnh sửa">
                    <SquarePen class="size-4 text-slate-600" />
                  </button>
                  <button @click="openStatusModal(contract)" class="p-2 rounded hover:bg-blue-50"
                    title="Đổi trạng thái">
                    <RefreshCw class="size-4 text-slate-600" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="statusModalOpen" class="fixed inset-0 flex items-center justify-center z-50 px-4"
        @click.self="closeStatusModal">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all">
          <div class="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <RefreshCw class="size-5 text-white" />
                </div>
                <div>
                  <h3 class="text-lg font-bold text-white">Thay đổi trạng thái hợp đồng</h3>
                  <p class="text-sm text-blue-100 mt-0.5">
                    Mã HĐ: <span class="font-semibold">{{ selectedContract?.contract_code }}</span>
                  </p>
                </div>
              </div>
              <button @click="closeStatusModal"
                class="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div class="px-6 py-5 max-h-96 overflow-y-auto">
            <div class="space-y-2">
              <button v-for="status in statuses" :key="status.key" @click="selectStatus(status)"
                class="w-full text-left flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md group"
                :class="selectedStatus?.key === status.key
                  ? 'bg-blue-50 border-blue-500 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-blue-300'">

                <div class="flex-shrink-0">
                  <div v-if="selectedStatus?.key === status.key"
                    class="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center ring-4 ring-blue-100 transition-all">
                    <svg class="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd" />
                    </svg>
                  </div>
                  <div v-else
                    class="w-6 h-6 rounded-full border-2 border-slate-300 bg-white group-hover:border-blue-400 transition-colors">
                  </div>
                </div>

                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between gap-2 mb-1">
                    <span class="font-semibold text-slate-900 text-base">{{ status.value }}</span>
                    <span v-if="status.key === 'expired'"
                      class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700">
                      <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clip-rule="evenodd" />
                      </svg>
                      Cảnh báo
                    </span>
                  </div>
                  <p v-if="status.description" class="text-sm text-slate-500 leading-snug">
                    {{ status.description }}
                  </p>
                </div>
              </button>
            </div>
          </div>

          <div class="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
            <button @click="closeStatusModal"
              class="px-5 py-2.5 rounded-lg text-sm font-medium border-2 border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-colors">
              Hủy bỏ
            </button>
            <button @click="submitStatusChange" :disabled="!selectedStatus || isSubmitting"
              class="px-5 py-2.5 rounded-lg text-sm font-semibold bg-gradient-to-r bg-blue-600 text-white hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2">
              <span v-if="isSubmitting">Đang xử lý...</span>
              <span v-else>Xác nhận thay đổi</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getContractService } from '@/services/admin/contracts/getContractService'
import { Clock, Eye, FileText, Home, Plus, RefreshCw, SquarePen } from 'lucide-vue-next'
import { getStatusContractService } from '@/services/admin/option_values/getStatusContractService'
import { changeStatusContractService } from '@/services/admin/contracts/changStatusContractService'
import { toastSuccess } from '@/helpers/toast'

const contracts = ref<any[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const statusModalOpen = ref(false)
const selectedContract = ref<any>(null)
const selectedStatus = ref<any>(null)
const statuses = ref<any[]>([])
const isSubmitting = ref(false)

const loadContracts = async () => {
  loading.value = true
  error.value = null
  try {
    const res: any = await getContractService()
    contracts.value = res.data.contracts
  } catch (err: any) {
    error.value = err?.message || String(err) || 'Lỗi khi tải dữ liệu'
  } finally {
    loading.value = false
  }
}

const openStatusModal = async (contract: any) => {
  selectedContract.value = contract
  selectedStatus.value = contract.status

  try {
    const res: any = await getStatusContractService()
    statuses.value = res
    selectedStatus.value = statuses.value.find(
      (s: any) => s.key === contract.status
    ) || null
    statusModalOpen.value = true
  } catch (err: any) {
    alert('Lỗi khi tải trạng thái: ' + (err?.message || 'Vui lòng thử lại'))
  }
}

const selectStatus = (status: any) => {
  selectedStatus.value = status
}

const submitStatusChange = async () => {
  if (!selectedStatus.value || !selectedContract.value || isSubmitting.value) return

  isSubmitting.value = true
  try {
    const result = await changeStatusContractService(selectedContract.value.id, selectedStatus.value.key)
    console.log(result);

    if (result && result.success) {
      toastSuccess("Cập nhật trạng thái thành công")
      await loadContracts()
      closeStatusModal()
    }

    // closeStatusModal()
  } catch (error: any) {
    alert('Lỗi khi thay đổi trạng thái: ' + (error?.message || 'Vui lòng thử lại'))
  } finally {
    isSubmitting.value = false
  }
}

const closeStatusModal = () => {
  statusModalOpen.value = false
  selectedContract.value = null
  selectedStatus.value = null
  isSubmitting.value = false
}

const getStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    'active': 'bg-emerald-100 text-emerald-700 border border-emerald-200',
    'pending': 'bg-amber-100 text-amber-700 border border-amber-200',
    'expired': 'bg-red-100 text-red-700 border border-red-200',
    'terminated': 'bg-slate-100 text-slate-700 border border-slate-200'
  }
  return classes[status] || 'bg-slate-100 text-slate-700 border border-slate-200'
}

const viewContract = (contract: any) => {
  console.log('View', contract)
}

const editContract = (contract: any) => {
  console.log('Edit', contract)
}

onMounted(() => {
  loadContracts()
})
</script>