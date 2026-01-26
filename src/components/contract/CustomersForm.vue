<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { Form, Field, ErrorMessage } from 'vee-validate'

const props = defineProps<{ customers: any[], max_customers: number }>()

const isMaxReached = computed(() => appliedCustomers.value.length >= props.max_customers)

const emit = defineEmits(['update', 'edit'])

const currentEditIndex = ref<number | null>(null)
const currentForm = reactive({
  identity_code: '',
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  address: '',
  gender: null as number | null,
  date_of_birth: '',
  is_represent: false,
  vehicle: {
    vehicleId: 0,
    plateNumber: ''
  }
})

const appliedCustomers = ref<any[]>((props.customers || []).map(c => ({ ...c })))
const formErrors = ref<Record<string, string>>({})

watch(() => props.customers, v => {
  appliedCustomers.value = (v || []).map(c => ({ ...c }))
})

const required = (value: any) => {
  if (!value) return 'Trường này không được để trống'
  return true
}

const emailRules = (value: any) => {
  if (!value) return 'Email không được để trống'
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(value)) return 'Email không hợp lệ'
  return true
}

function clearForm() {
  currentForm.identity_code = ''
  currentForm.first_name = ''
  currentForm.last_name = ''
  currentForm.email = ''
  currentForm.phone = ''
  currentForm.address = ''
  currentForm.gender = null
  currentForm.date_of_birth = ''
  currentForm.is_represent = false
  currentForm.vehicle.vehicleId = 0
  currentForm.vehicle.plateNumber = ''
  currentEditIndex.value = null
  formErrors.value = {}
}

function add() {
  clearForm()
}

function addCustomer() {
  if (!validateForm()) return

  const customerData = {
    identity_code: currentForm.identity_code,
    first_name: currentForm.first_name,
    last_name: currentForm.last_name,
    email: currentForm.email,
    phone: currentForm.phone,
    address: currentForm.address,
    gender: currentForm.gender,
    date_of_birth: currentForm.date_of_birth,
    is_represent: currentForm.is_represent,
    vehicle: {
      vehicleId: currentForm.vehicle.vehicleId,
      plateNumber: currentForm.vehicle.plateNumber
    }
  }

  if (currentEditIndex.value !== null) {
    // Update existing
    appliedCustomers.value[currentEditIndex.value] = customerData
  } else {
    // Add new
    appliedCustomers.value.push(customerData)
  }

  emit('update', appliedCustomers.value)
  clearForm()
}

function validateForm() {
  const errors: Record<string, string> = {}

  if (!currentForm.identity_code) errors.identity_code = 'CMND/CCCD không được để trống'
  if (!currentForm.first_name) errors.first_name = 'Họ không được để trống'
  if (!currentForm.last_name) errors.last_name = 'Tên không được để trống'
  if (!currentForm.email) errors.email = 'Email không được để trống'
  else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(currentForm.email)) errors.email = 'Email không hợp lệ'
  }
  if (!currentForm.phone) errors.phone = 'Số điện thoại không được để trống'
  if (!currentForm.address) errors.address = 'Địa chỉ không được để trống'
  if (!currentForm.gender) errors.gender = 'Giới tính không được để trống'
  if (!currentForm.date_of_birth) errors.date_of_birth = 'Ngày sinh không được để trống'
  if (!currentForm.vehicle?.vehicleId) errors.vehicleId = 'Loại phương tiện không được để trống'
  if (!currentForm.vehicle?.plateNumber) errors.plateNumber = 'Biển số xe không được để trống'

  formErrors.value = errors
  return Object.keys(errors).length === 0
}

function editCustomer(idx: number) {
  currentEditIndex.value = idx
  const customer = appliedCustomers.value[idx]
  currentForm.identity_code = customer.identity_code
  currentForm.first_name = customer.first_name
  currentForm.last_name = customer.last_name
  currentForm.email = customer.email
  currentForm.phone = customer.phone
  currentForm.address = customer.address
  currentForm.gender = customer.gender
  currentForm.date_of_birth = customer.date_of_birth
  currentForm.is_represent = customer.is_represent
  currentForm.vehicle.vehicleId = customer.vehicle?.vehicleId || 0
  currentForm.vehicle.plateNumber = customer.vehicle?.plateNumber || ''
}

function removeCustomer(idx: number) {
  appliedCustomers.value.splice(idx, 1)
  emit('update', appliedCustomers.value)
  if (currentEditIndex.value === idx) clearForm()
}

function setRepresentative(idx: number) {
  appliedCustomers.value.forEach((t, i) => (t.is_represent = i === idx))
  currentForm.is_represent = true
}
</script>

<style scoped></style>

<template>
  <div class="space-y-6 w-1/2">
    <h4 class="font-semibold text-lg mb-4 text-gray-800">Khách thuê (tối đa {{ props.max_customers }} người)</h4>

    <!-- Form thêm/edit khách -->
    <div class="bg-white border-2 border-blue-200 rounded-xl p-6 space-y-4">
      <h5 class="font-semibold text-md text-gray-800">{{ currentEditIndex !== null ? 'Chỉnh sửa khách' : 'Thêm khách mới' }}</h5>

      <div v-if="Object.keys(formErrors).length > 0" class="bg-red-50 border border-red-200 rounded-lg p-3">
        <p v-for="(error, key) in formErrors" :key="key" class="text-red-600 text-sm">• {{ error }}</p>
      </div>

      <div>
        <input v-model="currentForm.identity_code" placeholder="CMND/CCCD"
          class="w-full bg-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 border border-gray-300" />
      </div>

      <div class="grid grid-cols-2 gap-3">
        <input v-model="currentForm.first_name" placeholder="Họ"
          class="w-full bg-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 border border-gray-300" />
        <input v-model="currentForm.last_name" placeholder="Tên"
          class="w-full bg-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 border border-gray-300" />
      </div>

      <div class="grid grid-cols-2 gap-3">
        <input v-model="currentForm.email" placeholder="Email"
          class="w-full bg-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 border border-gray-300" />
        <input v-model="currentForm.phone" placeholder="Số điện thoại"
          class="w-full bg-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 border border-gray-300" />
      </div>

      <input v-model="currentForm.address" placeholder="Địa chỉ"
        class="w-full bg-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 border border-gray-300" />

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-gray-700 mb-1 font-medium">Giới tính</label>
          <div class="flex gap-2">
            <button type="button" :class="[
              'px-4 py-2 rounded-lg border transition flex-1',
              currentForm.gender === 1
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white border-gray-300 text-gray-700'
            ]" @click="currentForm.gender = 1">
              Nam
            </button>
            <button type="button" :class="[
              'px-4 py-2 rounded-lg border transition flex-1',
              currentForm.gender === 2
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white border-gray-300 text-gray-700'
            ]" @click="currentForm.gender = 2">
              Nữ
            </button>
          </div>
        </div>

        <div>
          <label class="block text-gray-700 mb-1 font-medium">Ngày sinh</label>
          <input type="date" v-model="currentForm.date_of_birth"
            class="w-full bg-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 border border-gray-300" />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Loại phương tiện</label>
          <select :value="String(currentForm.vehicle.vehicleId)" @change="(e) => currentForm.vehicle.vehicleId = parseInt((e.target as HTMLSelectElement).value)"
            class="w-full bg-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 border border-gray-300">
            <option value="0" disabled>-- Chọn phương tiện --</option>
            <option value="1">Xe máy</option>
            <option value="2">Ô tô</option>
            <option value="3">Xe đạp</option>
            <option value="4">Khác</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Biển số xe</label>
          <input v-model="currentForm.vehicle.plateNumber" placeholder="Biển số xe"
            class="w-full bg-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 border border-gray-300" />
        </div>
      </div>

      <label class="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" v-model="currentForm.is_represent" class="w-4 h-4 text-blue-500 cursor-pointer" />
        <span class="text-gray-700">Đại diện hợp đồng</span>
      </label>

      <div class="flex gap-3 pt-3">
        <button type="button" @click="addCustomer"
          class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex-1">
          {{ currentEditIndex !== null ? 'Cập nhật' : 'Lưu khách' }}
        </button>
        <button v-if="currentEditIndex !== null" type="button" @click="clearForm"
          class="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium">
          Hủy
        </button>
      </div>
    </div>

    <!-- Danh sách khách đã thêm -->
    <div v-if="appliedCustomers.length > 0" class="space-y-3">
      <h5 class="font-semibold text-md text-gray-800">Danh sách khách ({{ appliedCustomers.length }}/{{
        props.max_customers }})</h5>
      <div class="space-y-3">
        <div v-for="(customer, idx) in appliedCustomers" :key="idx"
          class="bg-blue-50 p-4 rounded-lg border-2 border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors"
          @click="editCustomer(idx)">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <p class="font-medium text-gray-800">
                {{ customer.first_name }} {{ customer.last_name }}
                <span v-if="customer.is_represent" class="ml-2 text-xs bg-blue-500 text-white px-2 py-1 rounded">
                  Đại diện
                </span>
              </p>
              <p class="text-sm text-gray-600">CMND/CCCD: {{ customer.identity_code }}</p>
              <p class="text-sm text-gray-600">Email: {{ customer.email }}</p>
              <p class="text-sm text-gray-600">SĐT: {{ customer.phone }}</p>
              <p class="text-sm text-gray-600">Địa chỉ: {{ customer.address }}</p>
              <p class="text-sm text-gray-600">
                Giới tính: {{ customer.gender === 1 ? 'Nam' : 'Nữ' }} | Ngày sinh: {{ customer.date_of_birth }}
              </p>
              <p class="text-sm text-gray-600">Biển số: {{ customer.vehicle?.plateNumber || 'N/A' }}</p>
            </div>
            <button type="button" @click.stop="removeCustomer(idx)"
              class="ml-3 px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors">
              Xoá
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-gray-500 italic bg-gray-50 p-4 rounded-lg">
      Chưa có khách thuê
    </div>
  </div>
</template>