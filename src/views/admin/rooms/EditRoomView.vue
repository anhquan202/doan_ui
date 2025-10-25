<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Form as VForm, useForm } from 'vee-validate'
import * as yup from 'yup'
import RoomFormSupplies from './RoomFormSupplies.vue'
import RoomFormUtilities from './RoomFormUtilities.vue'
import RoomFormBasic from './RoomFormBasic.vue'
import { Edit2 } from 'lucide-vue-next'
import { useRouter, useRoute } from 'vue-router'
import editService from '@/services/admin/room/editService'
import detailService from '@/services/admin/room/detailService'

const router = useRouter()
const route = useRoute()
const roomId = Number(route.params.id)

const basicInfo = ref({
  room_type: '',
  description: '',
  price: 0,
  status: '',
})
const supplies = ref<any[]>([])
const utilities = ref<any[]>([])

const supplyError = ref('')
const utilityError = ref('')

const schema = yup.object({
  room_type: yup.string().required('Vui lòng chọn loại phòng'),
  price: yup.number().required('Vui lòng nhập giá phòng').min(0),
})

const { validate } = useForm({ validationSchema: schema })

onMounted(async () => {
  try {
    const res = await detailService(roomId)
    if (res.success && res.data) {
      const room = res.data.room

      basicInfo.value = {
        room_type: room.room_type,
        description: room.description,
        price: room.price,
        status: room.status,
      }

      supplies.value = room.room_supplies.map(s => ({
        supply_id: s.supply_id,
        name: s.name,
        unit: s.unit,
        quantity: s.quantity || 1,
      }))

      utilities.value = room.room_utilities.map(u => ({
        utility_id: u.utility_id,
        utility_type: u.utility_type,
        fee: u.fee || 0,
        is_required: u.is_required,
      }))
    }
  } catch (err) {
    console.error('Lỗi khi tải thông tin phòng:', err)
  }
})

const submitForm = async () => {
  const isValid = await validate()
  supplyError.value = supplies.value.length === 0 ? 'Bạn chưa chọn vật dụng nào' : ''
  utilityError.value = utilities.value.length === 0 ? 'Bạn chưa chọn tiện ích nào' : ''

  if (!isValid || supplyError.value || utilityError.value) return

  const payload = {
    ...basicInfo.value,
    room_supplies_attributes: supplies.value,
    room_utilities_attributes: utilities.value,
  }

  try {
    const response = await editService(roomId, payload)
    if (response.success) {
      alert('Cập nhật phòng thành công!')
      router.push({ name: 'rooms' })
    }
  } catch (err) {
    console.error('Lỗi khi cập nhật phòng:', err)
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
    <div class="max-w-5xl mx-auto space-y-6">
      <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex items-center gap-4">
        <div
          class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
          <Edit2 class="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 class="text-3xl font-bold text-slate-900">Chỉnh sửa phòng</h1>
          <p class="text-slate-600 mt-1">Cập nhật thông tin chi tiết của phòng</p>
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
          <RoomFormBasic v-model="basicInfo" :is-edit="true" />
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

        <!-- Submit -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex justify-end">
          <button type="submit"
            class="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            <span class="flex items-center gap-2">
              <Edit2 class="size-5" />
              Cập nhật
            </span>
          </button>
        </div>
      </VForm>
    </div>
  </div>
</template>
