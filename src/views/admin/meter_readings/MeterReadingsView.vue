<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue"
import { getMeterReadingsService } from "@/services/admin/meter_readings/getMeterReadingsService"
import type { MeterReading, MeterReadingMeta, MeterReadingParams } from "@/types/MeterReadings"
import Paginate from '@/components/Paginate.vue'

const meterReadings = ref<MeterReading[]>([])
const meta = ref<MeterReadingMeta>({
  current_page: 1,
  from: 1,
  to: 10,
  per_page: 10,
  total: 0,
  total_pages: 1,
})
const loading = ref(false)
const error = ref("")
const uploadedFile = ref<File | null>(null)

const filters = reactive<MeterReadingParams>({
  page: 1,
  per_page: 10,
  month: new Date().getMonth() + 1,
  year: new Date().getFullYear(),
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

const fetchMeterReadings = async (page = 1) => {
  loading.value = true
  error.value = ""
  try {
    const response = await getMeterReadingsService({ ...filters, page })
    meterReadings.value = response.data.meter_readings
    meta.value = response.data.meta
    currentPage.value = response.data.meta.current_page
  } catch (err) {
    error.value = "Không thể tải dữ liệu chỉ số đồng hồ"
    console.error(err)
  } finally {
    loading.value = false
  }
}

const handleSearchSubmit = () => {
  fetchMeterReadings(1)
}

const handleChangePage = (page: number) => {
  fetchMeterReadings(page)
}

// const handleFileChange = (event: Event) => {
//   const target = event.target as HTMLInputElement
//   if (target.files && target.files.length > 0) {
//     uploadedFile.value = target.files[0]
//   }
// }

const handleFileUpload = () => {
  if (!uploadedFile.value) {
    alert("Vui lòng chọn file")
    return
  }
  // TODO: Implement file upload logic
  console.log("Uploading file:", uploadedFile.value.name)
  alert(`Đang tải lên file: ${uploadedFile.value.name}`)
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

const getTotalElectricFee = (reading: MeterReading) => {
  return reading.electric_readings.reduce((sum, item) => sum + item.total_fee, 0)
}

const getTotalWaterFee = (reading: MeterReading) => {
  return reading.water_readings.reduce((sum, item) => sum + item.total_fee, 0)
}

const getTotalAmount = (reading: MeterReading) => {
  return getTotalElectricFee(reading) + getTotalWaterFee(reading) + reading.fee_services
}

const getElectricUsage = (reading: MeterReading) => {
  return reading.electric_readings.reduce((sum, item) => sum + (item.end_num - item.start_num), 0)
}

const getWaterUsage = (reading: MeterReading) => {
  return reading.water_readings.reduce((sum, item) => sum + (item.end_num - item.start_num), 0)
}

onMounted(() => {
  fetchMeterReadings()
})
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex flex-wrap items-center justify-between gap-3">
      <h2 class="text-2xl font-bold tracking-tight text-gray-800">
        Chỉ số đồng hồ
      </h2>
    </div>

    <!-- Filter Section -->
    <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
      <div class="flex gap-3 flex-wrap items-center">
        <div class="flex items-center gap-2">
          <span class="text-sm font-medium text-gray-700">Tháng:</span>
          <select v-model="filters.month"
            class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-white cursor-pointer">
            <option v-for="month in months" :key="month.value" :value="month.value">
              {{ month.label }}
            </option>
          </select>
        </div>

        <div class="flex items-center gap-2">
          <span class="text-sm font-medium text-gray-700">Năm:</span>
          <select v-model="filters.year"
            class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-white cursor-pointer">
            <option v-for="year in years" :key="year" :value="year">
              {{ year }}
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
          <input id="file-upload" type="file" accept=".xlsx,.xls,.csv"
            class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" />
          <p v-if="uploadedFile" class="mt-2 text-xs text-gray-600">
            File đã chọn: <span class="font-medium">{{ uploadedFile.name }}</span>
          </p>
        </div>

        <div class="flex gap-2">
          <button @click="handleFileUpload" :disabled="!uploadedFile"
            class="px-4 py-2 bg-green-600 text-white border-0 rounded-lg cursor-pointer text-sm font-medium hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed">
            Tải lên
          </button>

          <button v-if="uploadedFile" @click="clearFile"
            class="px-4 py-2 bg-gray-500 text-white border-0 rounded-lg cursor-pointer text-sm font-medium hover:bg-gray-600 transition-colors">
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
      <div v-if="meterReadings.length === 0" class="text-center py-16 text-gray-500 text-base">
        Không có dữ liệu
      </div>

      <table v-else class="w-full border-collapse">
        <thead class="bg-blue-600 text-white">
          <tr>
            <th class="px-3 py-4 text-left font-semibold text-sm uppercase tracking-wide">Mã hợp đồng</th>
            <th class="px-3 py-4 text-left font-semibold text-sm uppercase tracking-wide">Điện (kWh)</th>
            <th class="px-3 py-4 text-left font-semibold text-sm uppercase tracking-wide">Tiền điện</th>
            <th class="px-3 py-4 text-left font-semibold text-sm uppercase tracking-wide">Nước (m³)</th>
            <th class="px-3 py-4 text-left font-semibold text-sm uppercase tracking-wide">Tiền nước</th>
            <th class="px-3 py-4 text-left font-semibold text-sm uppercase tracking-wide">Phí dịch vụ</th>
            <th class="px-3 py-4 text-left font-semibold text-sm uppercase tracking-wide">Tổng cộng</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="reading in meterReadings" :key="reading.contract_id"
            class="border-b border-gray-200 hover:bg-blue-50 transition-colors last:border-b-0">
            <td class="px-3 py-3.5 text-sm text-blue-600 font-semibold">
              {{ reading.contract_code }}
            </td>
            <td class="px-3 py-3.5 text-sm text-gray-700 text-center font-medium">
              {{ getElectricUsage(reading) }}
            </td>
            <td class="px-3 py-3.5 text-sm text-gray-700">
              {{ formatCurrency(getTotalElectricFee(reading)) }}
            </td>
            <td class="px-3 py-3.5 text-sm text-gray-700 text-center font-medium">
              {{ getWaterUsage(reading) }}
            </td>
            <td class="px-3 py-3.5 text-sm text-gray-700">
              {{ formatCurrency(getTotalWaterFee(reading)) }}
            </td>
            <td class="px-3 py-3.5 text-sm text-yellow-800 bg-yellow-50">
              {{ formatCurrency(reading.fee_services) }}
            </td>
            <td class="px-3 py-3.5 text-sm text-red-700 bg-red-50 font-bold">
              {{ formatCurrency(getTotalAmount(reading)) }}
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