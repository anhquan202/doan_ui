<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { Plus } from 'lucide-vue-next'

import getListSuppliesService from '@/services/admin/supplies/getListSuppliesService'
import supplyOptionService from '@/services/admin/optionValueService'
import createSupplyService, { type CreateSupplyParams } from '@/services/admin/supplies/createSupplyService'
import editSupplyService from '@/services/admin/supplies/editSupplyService'
import { toastError, toastSuccess } from '@/helpers/toast'

interface Supply {
  id: number
  name: string
  unit: string
}

interface OptionItem {
  key: string
  value: string
}

const supplies = ref<Supply[]>([])
const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref<number | null>(null)
const unitOptions = ref<OptionItem[]>([])
const { getSupplyUnitOptions } = supplyOptionService()

// ✅ Validation schema
const schema = yup.object({
  name: yup.string().required('Tên vật tư không được để trống'),
  unit: yup.string().required('Vui lòng chọn đơn vị'),
})

// ✅ Khởi tạo form
const { handleSubmit, resetForm } = useForm({
  validationSchema: schema,
})

const { value: name, errorMessage: nameError } = useField<string>('name')
const { value: unit, errorMessage: unitError } = useField<string>('unit')

// ✅ Fetch danh sách
const fetchSupplies = async () => {
  try {
    const response = await getListSuppliesService()
    if (response) supplies.value = response
  } catch (error) {
    console.error('Fetch supplies failed:', error)
  }
}

const fetchUnitOptions = async () => {
  const response = await getSupplyUnitOptions()
  unitOptions.value = response
}

// ✅ Modal control
const openCreateModal = () => {
  isEditing.value = false
  editingId.value = null
  resetForm({ values: { name: '', unit: '' } })
  showModal.value = true
}

const openEditModal = (item: Supply) => {
  isEditing.value = true
  editingId.value = item.id
  resetForm({ values: { name: item.name, unit: item.unit } })
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

// ✅ Submit form
const onSubmit = handleSubmit(async (values) => {
  try {
    const handleSuccess = async (msg: string) => {
      await fetchSupplies()
      closeModal()
      toastSuccess(msg)
    }

    if (isEditing.value && editingId.value) {
      const responseEdit = await editSupplyService(editingId.value, {
        name: values.name,
        unit: values.unit,
      })
      if (responseEdit?.success) {
        handleSuccess('Sửa vật tư thành công!')
      } else {
        toastError('Sửa không thành công')
      }
    } else {
      const response = await createSupplyService(values as CreateSupplyParams)
      if (response?.success) {
        handleSuccess('Tạo vật tư thành công!')
      } else {
        toastError('Tạo vật tư không thành công')
      }
    }
  } catch (error) {
    console.error('Create supply failed:', error)
    toastError('Lỗi khi tạo vật tư. Vui lòng thử lại!')
  }
})

const deleteSupply = (id: number) => {
  if (confirm('Bạn có chắc muốn xoá vật tư này?')) {
    supplies.value = supplies.value.filter((s) => s.id !== id)
  }
}

const formatUnit = (unit: string) => {
  const found = unitOptions.value.find((opt) => opt.key === unit)
  return found ? found.value : unit
}

onMounted(async () => {
  await Promise.all([fetchSupplies(), fetchUnitOptions()])
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8 flex items-center justify-between">
        <h1 class="text-3xl font-bold text-gray-900">Quản lý vật tư</h1>
        <button @click="openCreateModal"
          class="group relative px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2">
          <Plus class="size-5" />
          Thêm vật tư
        </button>
      </div>

      <!-- Empty State -->
      <div v-if="!supplies.length" class="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
        <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">Chưa có vật tư nào</h3>
        <p class="text-gray-600 mb-6">
          Bắt đầu bằng cách thêm vật tư đầu tiên của bạn
        </p>
        <button @click="openCreateModal"
          class="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
          <Plus class="size-5" />
          Thêm vật tư đầu tiên
        </button>
      </div>

      <!-- Grid Layout -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="(item, index) in supplies" :key="item.id"
          class="group bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-200 hover:border-blue-300 transition-all duration-200 overflow-hidden">
          <!-- Card Header -->
          <div class="bg-gradient-to-r from-blue-50 to-indigo-50 px-5 py-3 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <span
                class="inline-flex items-center justify-center w-8 h-8 bg-blue-600 text-white text-sm font-semibold rounded-lg">
                {{ index + 1 }}
              </span>
              <div class="flex items-center gap-2">
                <button @click="openEditModal(item)"
                  class="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" title="Chỉnh sửa">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button @click="deleteSupply(item.id)"
                  class="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors" title="Xóa">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Card Body -->
          <div class="p-5">
            <h3 class="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
              {{ item.name }}
            </h3>
            <div class="flex items-center gap-2 text-gray-600">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <span class="text-sm">
                Đơn vị:
                <span class="font-medium text-gray-900">{{ formatUnit(item.unit) }}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ✅ Modal with Validation -->
    <transition name="modal">
      <div v-if="showModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click.self="closeModal">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
          <!-- Header -->
          <div
            class="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 rounded-t-2xl flex justify-between items-center">
            <h3 class="text-xl font-semibold text-white">
              {{ isEditing ? 'Chỉnh sửa vật tư' : 'Thêm vật tư mới' }}
            </h3>
            <button @click="closeModal"
              class="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors">
              ✕
            </button>
          </div>

          <!-- Body -->
          <form @submit.prevent="onSubmit" class="p-6 space-y-5">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Tên vật tư <span class="text-red-500">*</span>
              </label>
              <input v-model="name" type="text" placeholder="Nhập tên vật tư"
                class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
              <span v-if="nameError" class="text-red-500 text-sm mt-1 block">{{ nameError }}</span>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Đơn vị <span class="text-red-500">*</span>
              </label>
              <select v-model="unit"
                class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none">
                <option value="">-- Chọn đơn vị --</option>
                <option v-for="opt in unitOptions" :key="opt.key" :value="opt.key">
                  {{ opt.value }}
                </option>
              </select>
              <span v-if="unitError" class="text-red-500 text-sm mt-1 block">{{ unitError }}</span>
            </div>

            <!-- Footer -->
            <div class="flex justify-end gap-3 pt-2">
              <button type="button" @click="closeModal"
                class="px-5 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg">
                Hủy
              </button>
              <button type="submit"
                class="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all">
                {{ isEditing ? 'Cập nhật' : 'Thêm mới' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>
  </div>
</template>
