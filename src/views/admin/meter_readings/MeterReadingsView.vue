<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue"
import { getMonthlyInvoicesService } from "@/services/admin/meter_readings/getMonthlyInvoicesService"
import { importMeterReadingsService } from "@/services/admin/meter_readings/importMeterReadingsService"
import type { MonthlyInvoice, MonthlyInvoiceMeta, MonthlyInvoicesParams } from "@/types/MonthlyInvoices"
import Paginate from '@/components/Paginate.vue'
import { useToast } from "vue-toastification"

const toast = useToast()

const invoices = ref<MonthlyInvoice[]>([])
const meta = ref<MonthlyInvoiceMeta>({
  current_page: 1,
  from: 1,
  to: 10,
  per_page: 10,
  total: 0,
  total_pages: 1,
})
const loading = ref(false)
const uploading = ref(false)
const error = ref("")
const uploadedFile = ref<File | null>(null)

// Get current date, default to current month (will be sent as previous month to API)
const today = new Date()
const currentMonth = today.getMonth() + 1
const currentYear = today.getFullYear()

const filters = reactive<MonthlyInvoicesParams>({
  page: 1,
  per_page: 10,
  month: currentMonth,
  year: currentYear,
  status: undefined,
  contract_id: undefined,
})

const currentPage = ref(1)

const months = [
  { value: 1, label: 'Tháng 1' },
  { value: 2, label: 'Tháng 2' },
  { value: 3, label: 'Tháng 3' },
  { value: 4, label: 'Tháng 4' },
  { value: 5, label: 'Tháng 5' },
  { value: 6, label: 'Tháng 6' },
  { value: 7, label: 'Tháng 7' },
  { value: 8, label: 'Tháng 8' },
  { value: 9, label: 'Tháng 9' },
  { value: 10, label: 'Tháng 10' },
  { value: 11, label: 'Tháng 11' },
  { value: 12, label: 'Tháng 12' },
]

const years = computed(() => {
  const currentYear = new Date().getFullYear()
  const yearList = []
  for (let year = 2024; year <= currentYear; year++) {
    yearList.push(year)
  }
  return yearList
})

const statuses = [
  { value: "pending", label: "Chưa thanh toán" },
  { value: "paid", label: "Đã thanh toán" },
]

// Calculate the actual month/year to send to API (one month earlier)
const getApiMonth = () => {
  let month = filters.month ?? currentMonth
  let year = filters.year ?? currentYear

  month = month - 1
  if (month === 0) {
    month = 12
    year = year - 1
  }

  return { month, year }
}

const fetchInvoices = async (page = 1) => {
  loading.value = true
  error.value = ""
  try {
    const { month, year } = getApiMonth()
    const params: MonthlyInvoicesParams = {
      page,
      per_page: filters.per_page,
      month,
      year,
    }
    
    // Only add optional params if they have values
    if (filters.status) {
      params.status = filters.status
    }
    if (filters.contract_id) {
      params.contract_id = filters.contract_id
    }

    const response = await getMonthlyInvoicesService(params)
    invoices.value = response.data.invoices
    meta.value = response.data.meta
    currentPage.value = response.data.meta.current_page
  } catch (err) {
    error.value = "Không thể tải dữ liệu hóa đơn tháng"
    console.error(err)
  } finally {
    loading.value = false
  }
}

const handleSearchSubmit = () => {
  fetchInvoices(1)
}

const handleChangePage = (page: number) => {
  fetchInvoices(page)
}

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0 && target.files[0]) {
    uploadedFile.value = target.files[0]
  }
}

const handleFileUpload = async () => {
  if (!uploadedFile.value) {
    toast.error("Vui lòng chọn file")
    return
  }

  const validExtensions = ['xlsx', 'xls', 'csv']
  const fileExtension = uploadedFile.value.name.split('.').pop()?.toLowerCase()

  if (!fileExtension || !validExtensions.includes(fileExtension)) {
    toast.error("Vui lòng chọn file có định dạng .xlsx, .xls hoặc .csv")
    return
  }

  uploading.value = true
  try {
    await importMeterReadingsService(uploadedFile.value)
    toast.success("Tải lên file thành công")
    clearFile()
    // Reload dữ liệu sau khi import thành công
    await fetchInvoices(1)
  } catch (err) {
    console.error(err)
    toast.error("Tải lên file thất bại. Vui lòng thử lại")
  } finally {
    uploading.value = false
  }
}

const clearFile = () => {
  uploadedFile.value = null
  const fileInput = document.getElementById('file-upload') as HTMLInputElement
  if (fileInput) fileInput.value = ''
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value)
}

const getElectricUsage = (invoice: MonthlyInvoice) => {
  return invoice.electric_reading.end_num - invoice.electric_reading.start_num
}

const getWaterUsage = (invoice: MonthlyInvoice) => {
  return invoice.water_reading.end_num - invoice.water_reading.start_num
}

const getReadingDisplay = (invoice: MonthlyInvoice, type: 'electric' | 'water') => {
  const reading = type === 'electric' ? invoice.electric_reading : invoice.water_reading
  return `${reading.start_num} → ${reading.end_num}`
}

onMounted(() => {
  fetchInvoices()
})
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex flex-wrap items-center justify-between gap-3">
      <h2 class="text-2xl font-bold tracking-tight text-gray-800">
        Hóa đơn tháng
      </h2>
    </div>

    <!-- Filter Section -->
    <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
      <div class="flex gap-3 flex-wrap items-end">
        <div class="flex items-center gap-2">
          <span class="text-sm font-medium text-gray-700">Tháng:</span>
          <select v-model.number="filters.month"
            class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-white cursor-pointer">
            <option v-for="month in months" :key="month.value" :value="month.value">
              {{ month.label }}
            </option>
          </select>
        </div>

        <div class="flex items-center gap-2">
          <span class="text-sm font-medium text-gray-700">Năm:</span>
          <select v-model.number="filters.year"
            class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-white cursor-pointer">
            <option v-for="year in years" :key="year" :value="year">
              {{ year }}
            </option>
          </select>
        </div>

        <div class="flex items-center gap-2">
          <span class="text-sm font-medium text-gray-700">Trạng thái:</span>
          <select v-model="filters.status"
            class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-white cursor-pointer">
            <option value="">-- Tất cả --</option>
            <option v-for="status in statuses" :key="status.value" :value="status.value">
              {{ status.label }}
            </option>
          </select>
        </div>

        <button @click="handleSearchSubmit"
          class="px-5 py-2 bg-blue-600 text-white border-0 rounded-lg cursor-pointer text-sm font-medium hover:bg-blue-700 transition-colors">
          Tìm kiếm
        </button>
      </div>
    </div>

    <!-- File Upload Section -->
    <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
      <div class="flex items-center gap-4 flex-wrap">
        <label class="text-sm font-medium text-gray-700">Import dữ liệu:</label>

        <div class="flex-1 min-w-[250px]">
          <input id="file-upload" type="file" accept=".xlsx,.xls,.csv" @change="handleFileChange"
            class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" />
          <p v-if="uploadedFile" class="mt-2 text-xs text-gray-600">
            File đã chọn: <span class="font-medium">{{ uploadedFile.name }}</span>
          </p>
        </div>

        <div class="flex gap-2">
          <button @click="handleFileUpload" :disabled="!uploadedFile || uploading"
            class="px-4 py-2 bg-green-600 text-white border-0 rounded-lg cursor-pointer text-sm font-medium hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed">
            {{ uploading ? 'Đang tải lên...' : 'Tải lên' }}
          </button>

          <button v-if="uploadedFile" @click="clearFile" :disabled="uploading"
            class="px-4 py-2 bg-gray-500 text-white border-0 rounded-lg cursor-pointer text-sm font-medium hover:bg-gray-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed">
            Hủy
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-10">
      <span class="text-gray-500 animate-pulse">Đang tải dữ liệu chỉ số đồng hồ...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="rounded-lg overflow-hidden shadow-sm bg-red-50 border border-red-200">
      <div class="p-6 text-center text-red-700">
        <p>{{ error }}</p>
      </div>
    </div>

    <!-- Table -->
    <div v-else class="rounded-lg overflow-hidden shadow-sm bg-white">
      <div v-if="invoices.length === 0" class="text-center py-16 text-gray-500 text-base">
        Không có dữ liệu
      </div>

      <table v-else class="w-full border-collapse">
        <thead class="bg-blue-600 text-white">
          <tr>
            <th class="px-3 py-4 text-left font-semibold text-sm uppercase tracking-wide">Mã hợp đồng</th>
            <th class="px-3 py-4 text-left font-semibold text-sm uppercase tracking-wide">Phòng</th>
            <th class="px-3 py-4 text-center font-semibold text-sm uppercase tracking-wide">Điện</th>
            <th class="px-3 py-4 text-center font-semibold text-sm uppercase tracking-wide">Nước</th>
            <th class="px-3 py-4 text-right font-semibold text-sm uppercase tracking-wide">Phí phòng</th>
            <th class="px-3 py-4 text-center font-semibold text-sm uppercase tracking-wide">Trạng thái</th>
            <th class="px-3 py-4 text-right font-semibold text-sm uppercase tracking-wide">Tổng cộng</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="invoice in invoices" :key="invoice.id"
            class="border-b border-gray-200 hover:bg-blue-50 transition-colors last:border-b-0">
            <td class="px-3 py-3.5 text-sm text-blue-600 font-semibold">
              {{ invoice.contract_code }}
            </td>
            <td class="px-3 py-3.5 text-sm text-gray-700 font-medium">
              {{ invoice.room_name }}
            </td>
            
            <!-- Điện Column - Compact -->
            <td class="px-3 py-3.5 text-sm">
              <div class="flex flex-col gap-1">
                <div class="flex items-center justify-between gap-2 text-xs">
                  <span class="text-gray-500">Cũ:</span>
                  <span class="font-mono font-semibold text-gray-700">{{ invoice.electric_reading.start_num || 0 }}</span>
                </div>
                <div class="flex items-center justify-between gap-2 text-xs">
                  <span class="text-gray-500">Mới:</span>
                  <span class="font-mono font-semibold text-gray-700">{{ invoice.electric_reading.end_num || 0 }}</span>
                </div>
                <div class="flex items-center justify-between gap-2 text-xs border-t border-gray-200 pt-1 mt-0.5">
                  <span class="text-orange-600 font-medium">{{ getElectricUsage(invoice) }} kWh</span>
                </div>
                <div class="text-right font-semibold text-sm text-blue-700 mt-1">
                  {{ formatCurrency(invoice.electric_fee) }}
                </div>
              </div>
            </td>
            
            <!-- Nước Column - Compact -->
            <td class="px-3 py-3.5 text-sm">
              <div class="flex flex-col gap-1">
                <div class="flex items-center justify-between gap-2 text-xs">
                  <span class="text-gray-500">Cũ:</span>
                  <span class="font-mono font-semibold text-gray-700">{{ invoice.water_reading.start_num || 0 }}</span>
                </div>
                <div class="flex items-center justify-between gap-2 text-xs">
                  <span class="text-gray-500">Mới:</span>
                  <span class="font-mono font-semibold text-gray-700">{{ invoice.water_reading.end_num || 0 }}</span>
                </div>
                <div class="flex items-center justify-between gap-2 text-xs border-t border-gray-200 pt-1 mt-0.5">
                  <span class="text-cyan-600 font-medium">{{ getWaterUsage(invoice) }} m³</span>
                </div>
                <div class="text-right font-semibold text-sm text-blue-700 mt-1">
                  {{ formatCurrency(invoice.water_fee) }}
                </div>
              </div>
            </td>
            
            <td class="px-3 py-3.5 text-sm text-gray-700 text-right font-medium">
              {{ formatCurrency(invoice.room_fee) }}
            </td>
            <td class="px-3 py-3.5 text-sm text-center">
              <span :class="{
                'px-2.5 py-1.5 rounded-full text-xs font-semibold inline-block': true,
                'bg-yellow-100 text-yellow-800': invoice.status === 'pending',
                'bg-green-100 text-green-800': invoice.status === 'paid',
                'bg-gray-100 text-gray-800': !['pending', 'paid'].includes(invoice.status)
              }">
                {{ invoice.status_text }}
              </span>
            </td>
            <td class="px-3 py-3.5 text-sm text-red-700 bg-red-50 font-bold text-right">
              {{ formatCurrency(invoice.total_amount) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="flex justify-end pt-4">
      <Paginate :meta="meta" :current-page="currentPage" @change-page="handleChangePage" />
    </div>
  </div>
</template>

<style scoped>
/* Responsive cho mobile */
@media (max-width: 768px) {
  table {
    font-size: 0.75rem;
  }

  th,
  td {
    padding: 0.625rem 0.5rem;
  }
}
</style>