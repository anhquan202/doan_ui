<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Form, Field, ErrorMessage, type GenericObject } from 'vee-validate'
import * as yup from 'yup'
import getUtilitiesService from '@/services/admin/utilities/getUtilitiesService'
import { Check, PenLine, X } from 'lucide-vue-next'
import { networkManager } from '@/api/axiosConfig'
import { API_ENDPOINTS } from '@/constants/apiPath'
import editUtilitiesService from '@/services/admin/utilities/editUtilitiesService'
import { toastError, toastSuccess } from '@/helpers/toast'

// --- Types ---
interface Utility {
  id: number
  utility_type: string
  utility_type_label: string
  fee: number
  description?: string | null
  is_required?: boolean | null
}

// --- State ---
const utilities = ref<Utility[]>([])
const loading = ref<boolean>(false)
const error = ref<string | null>(null)
const editingId = ref<number | null>(null)

// --- Validation schema ---
const schema = yup.object({
  fee: yup
    .number()
    .typeError('Phí phải là số')
    .required('Phí là bắt buộc')
    .min(0, 'Phí không được âm')
})

// --- Lifecycle ---
onMounted(fetchUtilities)

// --- Methods ---
async function fetchUtilities() {
  loading.value = true
  error.value = null
  try {
    const data = await getUtilitiesService()
    utilities.value = data
  } catch (err: any) {
    error.value = 'Lỗi tải dữ liệu: ' + err.message
  } finally {
    loading.value = false
  }
}

function startEdit(utility: Utility) {
  editingId.value = utility.id
}

function cancelEdit() {
  editingId.value = null
}

async function saveEdit(id: number, values: { fee: number }) {
  loading.value = true
  error.value = null
  try {
    // Convert fee sang string vì API Grape nhận BigDecimal dưới dạng string
    const params = { fee: values.fee.toString() }

    const response = await editUtilitiesService(id, params)

    if (response.success) {
      // Gọi lại API để fetch toàn bộ utilities mới nhất
      await fetchUtilities()
      toastSuccess("Sửa thông tin thành công")
      editingId.value = null
    } else {
      toastError("'Có lỗi xảy ra khi cập nhật")
    }
  } catch (err: any) {
    console.log(err)
  } finally {
    loading.value = false
  }
}

// --- UI helpers ---
function getIconSvg(type: string) {
  const icons: Record<string, string> = {
    electricity: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>',
    water: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" /></svg>',
    internet: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" /></svg>',
    garbage: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>',
    parking: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>',
    cleaning: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>'
  }
  return icons[type] || icons.electricity
}

function getColorClass(type: string) {
  const colors: Record<string, string> = {
    electricity: 'bg-yellow-500',
    water: 'bg-blue-500',
    internet: 'bg-purple-500',
    garbage: 'bg-green-500',
    parking: 'bg-orange-500',
    cleaning: 'bg-pink-500'
  }
  return colors[type] || 'bg-gray-500'
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
}
</script>

<template>
  <div class="min-h-screen">
    <div class="p-8 mb-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-800">Quản lý Tiện ích</h1>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <p class="mt-4 text-gray-600">Đang tải dữ liệu...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
        <p class="font-semibold">Lỗi: {{ error }}</p>
      </div>

      <!-- List -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="utility in utilities" :key="utility.id"
          class="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md hover:shadow-lg transition p-6 border border-gray-200">
          <div class="flex items-start justify-between mb-4">
            <div :class="getColorClass(utility.utility_type)" class="text-white p-3 rounded-xl">
              <div v-html="getIconSvg(utility.utility_type)"></div>
            </div>

            <button @click="startEdit(utility)" class="text-blue-600 hover:text-blue-800 transition">
              <PenLine class="size-5 cursor-pointer" />
            </button>
          </div>

          <!-- Thông tin tiện ích -->
          <h3 class="text-xl font-bold text-gray-800 mb-2">{{ utility.utility_type_label }}</h3>
          <div class="text-2xl font-bold text-indigo-600 mb-3">{{ formatCurrency(utility.fee) }}</div>
          <p class="text-sm text-gray-600 leading-relaxed">{{ utility.description || '—' }}</p>
        </div>
      </div>
    </div>

    <!-- Modal sửa phí -->
    <div v-if="editingId" class="fixed inset-0 flex items-start top-40 justify-center z-50">
      <div class="bg-white rounded-xl p-6 w-full max-w-md relative shadow-2xl">
        <h2 class="text-2xl font-bold mb-4">
          Chỉnh sửa tiện ích: {{utilities.find(u => u.id === editingId)?.utility_type_label}}
        </h2>

        <Form :validation-schema="schema" @submit="(values) => saveEdit(editingId!, values)" class="space-y-4"
          :key="editingId">
          <!-- Tên tiện ích (disabled) -->
          <div>
            <label class="block text-sm font-medium mb-1">Tên tiện ích</label>
            <input type="text" :value="utilities.find(u => u.id === editingId)?.utility_type_label" disabled
              class="w-full bg-gray-100 border border-slate-300 rounded-xl px-4 py-3 text-sm text-gray-600 cursor-not-allowed" />
          </div>

          <!-- Mô tả (disabled) -->
          <div>
            <label class="block text-sm font-medium mb-1">Mô tả</label>
            <textarea :value="utilities.find(u => u.id === editingId)?.description || '—'" disabled
              class="w-full bg-gray-100 border border-slate-300 rounded-xl px-4 py-3 text-sm text-gray-600 cursor-not-allowed resize-none"></textarea>
          </div>

          <!-- Fee (editable) -->
          <div>
            <label class="block text-sm font-medium mb-1">Phí (VND)</label>
            <Field name="fee" type="number" min="0" step="1000" placeholder="VD: 500000"
              :value="utilities.find(u => u.id === editingId)?.fee"
              class="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm" />
            <ErrorMessage name="fee" class="text-sm text-red-600 mt-1" />
          </div>

          <div class="flex gap-2">
            <button type="submit"
              class="flex-1 flex items-center justify-center gap-1 bg-blue-600 text-white px-3 py-2 rounded-lg">
              <Check /> Lưu
            </button>
            <button type="button" @click="cancelEdit"
              class="flex-1 flex items-center justify-center gap-1 bg-red-600 text-white px-3 py-2 rounded-lg">
              <X /> Hủy
            </button>
          </div>
        </Form>
      </div>
    </div>

  </div>
</template>


<style scoped>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
