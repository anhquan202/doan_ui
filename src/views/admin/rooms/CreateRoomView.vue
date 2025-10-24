<script setup lang="ts">
import { ref, computed } from 'vue'
import { Form as VForm, useForm } from 'vee-validate'
import * as yup from 'yup'
import createService from '@/services/admin/room/createService'
import RoomFormSupplies from './RoomFormSupplies.vue'
import RoomFormUtilities from './RoomFormUtilities.vue'
import { Plus } from 'lucide-vue-next'
import RoomFormBasic from './RoomFormBasic.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const basicInfo = ref({ room_type: '', description: '', price: 0 })
const supplies = ref<any[]>([])
const utilities = ref<any[]>([])

// Tạo lỗi FE cho supplies & utilities
const supplyError = ref('')
const utilityError = ref('')

// Form schema cho basicInfo
const schema = yup.object({
  room_type: yup.string().required(),
  max_customer: yup.number().required().min(1),
  price: yup.number().required().min(0)
})

const { validate } = useForm({ validationSchema: schema })

const submitForm = async () => {
  const isValid = await validate()

  supplyError.value = supplies.value.length === 0 ? 'Bạn chưa chọn vật dụng nào' : ''
  utilityError.value = utilities.value.length === 0 ? 'Bạn chưa chọn tiện ích nào' : ''

  if (!isValid || supplyError.value || utilityError.value) return

  const payload = {
    ...basicInfo.value,
    room_supplies_attributes: supplies.value,
    room_utilities_attributes: utilities.value
  }

  try {
    const response = await createService(payload)
    if (response.success) {
      alert("Tạo phòng thành công")
      router.push({ name: 'rooms' })
    }
  } catch (err) {
    console.log(err)
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
    <div class="max-w-5xl mx-auto space-y-6">
      <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <div class="flex items-center gap-4">
          <div
            class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4">
              </path>
            </svg>
          </div>
          <div>
            <h1 class="text-3xl font-bold text-slate-900">Tạo Phòng Mới</h1>
            <p class="text-slate-600 mt-1">Điền thông tin chi tiết để tạo phòng cho thuê</p>
          </div>
        </div>
      </div>

      <VForm @submit="submitForm" class="space-y-6">
        <div
          class="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 hover:shadow-md transition-shadow duration-300">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h2 class="text-xl font-semibold text-slate-900">Thông tin cơ bản</h2>
          </div>
          <RoomFormBasic v-model="basicInfo" />
        </div>

        <div
          class="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 hover:shadow-md transition-shadow duration-300">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
              </svg>
            </div>
            <h2 class="text-xl font-semibold text-slate-900">Vật dụng phòng</h2>
          </div>
          <RoomFormSupplies v-model="supplies" />
          <span v-if="supplyError" class="text-red-500 text-sm">{{ supplyError }}</span>
        </div>

        <div
          class="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 hover:shadow-md transition-shadow duration-300">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z">
                </path>
              </svg>
            </div>
            <h2 class="text-xl font-semibold text-slate-900">Tiện ích & Dịch vụ</h2>
          </div>
          <RoomFormUtilities v-model="utilities" />
          <span v-if="utilityError" class="text-red-500 text-sm">{{ utilityError }}</span>
        </div>

        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <button type="submit"
            class="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            <span class="flex items-center gap-2">
              <Plus class="size-5" />
              Tạo phòng mới
            </span>
          </button>
        </div>
      </VForm>
    </div>
  </div>
</template>
