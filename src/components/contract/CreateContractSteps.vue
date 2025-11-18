<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between mb-6">
      <template v-for="(label, i) in stepLabels" :key="i">
        <div class="flex items-center gap-2 cursor-pointer select-none" @click="goTo(i)">
          <div :class="[
            'w-9 h-9 flex items-center justify-center rounded-full border transition-all duration-300 text-sm font-medium',
            currentStep === i
              ? 'bg-blue-600 text-white border-blue-600 shadow-md'
              : 'bg-white text-gray-600 border-gray-300'
          ]">
            {{ i + 1 }}
          </div>
          <span :class="[
            'font-medium transition-colors duration-200',
            currentStep === i ? 'text-blue-600' : 'text-gray-600'
          ]">
            {{ label }}
          </span>
          <div v-if="i < stepLabels.length - 1" class="flex-1 h-px bg-gray-300 mx-4"></div>
        </div>
      </template>
    </div>

    <!-- Step content -->
    <div class="step-panel p-6 rounded-xl shadow-sm border border-gray-200 bg-white">
      <RoomSelector v-if="currentStep === 0" @selected="onRoomSelected" :selectedRoomId="form.roomId" />

      <CustomersForm v-if="currentStep === 1" :customers="form.customers" @update="val => form.customers = val" />

      <SelectedTimeContractForm v-if="currentStep === 2" @next="onTimeSelected" />

      <div v-if="currentStep === 3" class="space-y-6 max-w-4xl mx-auto">
        <div class="text-center mb-6">
          <h3 class="text-2xl font-bold text-gray-800 mb-2">Xem lại thông tin hợp đồng</h3>
          <p class="text-gray-500">Vui lòng kiểm tra kỹ thông tin trước khi xác nhận</p>
        </div>

        <div class="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
          <div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
            <div class="flex items-center gap-3 text-white">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <h4 class="text-lg font-semibold">Thông tin phòng</h4>
            </div>
          </div>
          <div class="p-6 space-y-4">
            <div class="flex justify-between items-center py-2 border-b border-gray-100">
              <span class="text-gray-600">Tên phòng</span>
              <span class="font-semibold text-gray-800 text-lg">{{ selectedRoom?.room_name }}</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-gray-100">
              <span class="text-gray-600">Giá thuê</span>
              <span class="font-bold text-blue-600 text-xl">
                {{ selectedRoom?.price.toLocaleString() }} đ<span class="text-sm text-gray-500">/tháng</span>
              </span>
            </div>
            <div class="mt-4">
              <p class="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Tiện ích đi kèm
              </p>
              <div class="grid grid-cols-2 gap-2">
                <div v-for="u in selectedRoom?.utilities" :key="u.id"
                  class="flex items-center gap-2 p-2 bg-blue-50 rounded-lg text-sm text-gray-700">
                  <span class="w-2 h-2 bg-blue-500 rounded-full"></span>
                  {{ u.utility_type_label }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
          <div class="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
            <div class="flex items-center gap-3 text-white">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h4 class="text-lg font-semibold">Thời gian thuê</h4>
            </div>
          </div>
          <div class="p-6">
            <div class="grid md:grid-cols-2 gap-4">
              <div class="bg-green-50 rounded-xl p-4 border border-green-200">
                <p class="text-sm text-gray-600 mb-1">Ngày bắt đầu</p>
                <p class="text-xl font-bold text-gray-800">{{ form.startDate }}</p>
              </div>
              <div class="bg-green-50 rounded-xl p-4 border border-green-200">
                <p class="text-sm text-gray-600 mb-1">Kỳ hạn</p>
                <p class="text-xl font-bold text-gray-800">{{ form.termMonths }} tháng</p>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
          <div class="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
            <div class="flex items-center gap-3 text-white">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h4 class="text-lg font-semibold">Khách thuê ({{ form.customers.length }} người)</h4>
            </div>
          </div>
          <div class="p-6 space-y-4">
            <div v-for="(c, i) in form.customers" :key="i"
              class="relative bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border-2 border-purple-200">
              <div v-if="c.is_represent"
                class="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                Đại diện
              </div>

              <div class="grid md:grid-cols-2 gap-4">
                <div>
                  <p class="text-xs text-gray-500 mb-1">Họ và tên</p>
                  <p class="font-semibold text-gray-800 text-lg">{{ c.first_name }} {{ c.last_name }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500 mb-1">Số CCCD</p>
                  <p class="font-medium text-gray-700">{{ c.identity_code }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500 mb-1">Số điện thoại</p>
                  <p class="font-medium text-gray-700 flex items-center gap-2">
                    <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {{ c.phone }}
                  </p>
                </div>
                <div>
                  <p class="text-xs text-gray-500 mb-1">Email</p>
                  <p class="font-medium text-gray-700 flex items-center gap-2 break-all">
                    <svg class="w-4 h-4 text-purple-600 flex-shrink-0" fill="none" stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {{ c.email }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-blue-50 border-l-4 border-blue-600 rounded-lg p-4">
          <div class="flex gap-3">
            <svg class="w-6 h-6 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div class="text-sm text-gray-700">
              <p class="font-semibold mb-1">Lưu ý quan trọng:</p>
              <ul class="list-disc ml-5 space-y-1">
                <li>Vui lòng kiểm tra kỹ thông tin trước khi xác nhận</li>
                <li>Sau khi xác nhận, hợp đồng sẽ được tạo và gửi đến email của bạn</li>
                <li>Liên hệ quản lý nếu có bất kỳ thắc mắc nào</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex items-center justify-between mt-6">
      <button class="btn" :disabled="currentStep === 0" @click="prev">
        ← Quay lại
      </button>

      <button v-if="currentStep < 3" class="btn-primary" @click="next" :disabled="currentStep === 0 && !form.roomId">
        Tiếp tục →
      </button>

      <button v-else class="btn-primary" @click="submit">
        ✓ Hoàn tất
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue"
import RoomSelector from "./RoomSelector.vue"
import CustomersForm from "./CustomersForm.vue"
import SelectedTimeContractForm from "./SelectedTimeContractForm.vue"
import dayjs from "dayjs"
import { createContractService } from "@/services/admin/contracts/createContractService"
import { toastError, toastSuccess } from "@/helpers/toast"
import { useRouter } from 'vue-router'

type Customer = {
  identity_code: string
  first_name: string
  last_name: string
  email: string
  phone: string
  address: string
  gender: number
  date_of_birth: string
  is_represent: boolean
}

const currentStep = ref(0)

const form = reactive({
  roomId: 0 as number,
  startDate: dayjs().format("YYYY-MM-DD"),
  termMonths: 6,
  deposit: 0 as number,
  customers: [] as Customer[],
  utilities: [] as { utility_id?: number; status?: number }[]
})

const stepLabels = ["Chọn phòng", "Khách thuê", "Thời gian thuê", "Kiểm tra"]

const router = useRouter()

function goTo(i: number) {
  currentStep.value = i
}

function next() {
  if (currentStep.value < 3) currentStep.value++
}

function prev() {
  if (currentStep.value > 0) currentStep.value--
}

const selectedRoom = ref<any>(null)
function onRoomSelected(room: any) {
  selectedRoom.value = room
  form.roomId = room?.id ?? null
  form.deposit = room?.price ?? 0
  form.utilities =
    room?.utilities?.map((u: any) => ({
      utility_id: u.id
    })) || []
}


function onTimeSelected(payload: { start_date: string; term_months: number }) {
  form.startDate = payload.start_date
  form.termMonths = payload.term_months
  next()
}

async function submit() {
  const payload = {
    start_date: form.startDate,
    term_months: form.termMonths,
    deposit: form.deposit,
    room_id: form.roomId!,
    customers: form.customers.map(c => ({
      identity_code: c.identity_code,
      first_name: c.first_name,
      last_name: c.last_name,
      email: c.email,
      phone: c.phone,
      address: c.address,
      gender: c.gender,
      date_of_birth: c.date_of_birth,
      is_represent: c.is_represent
    })),
    utilities: form.utilities
      .filter(u => u.utility_id !== undefined && u.utility_id !== null)
      .map(u => ({
        utility_id: u.utility_id!
      }))
  }

  try {
    const res = await createContractService(payload)
    if (res.success) {
      toastSuccess("Tạo hợp đồng thành công")
      await router.push({ name: 'contracts' })
    } else {
      toastError("Có lỗi xảy ra khi tạo hợp đồng")
    }
  } catch (err: any) {
    console.error("Create contract error:", err)
    toastError("Lỗi ngoài ý muốn")
  }
}
</script>

<style scoped>
.btn {
  padding: 0.55rem 1.3rem;
  border-radius: 0.5rem;
  background: #f3f4f6;
  font-weight: 500;
  transition: 0.2s;
}

.btn:hover:not(:disabled) {
  background: #e5e7eb;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  padding: 0.55rem 1.3rem;
  border-radius: 0.5rem;
  background: #2563eb;
  color: white;
  font-weight: 500;
  transition: 0.2s;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
}

.btn-primary:hover {
  background: #1d4ed8;
}
</style>
