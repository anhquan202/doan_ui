<template>
  <div class="space-y-6">
    <h4 class="font-semibold text-lg mb-4 text-gray-800">Khách thuê</h4>

    <Form @submit="apply" v-slot="{ errors }">
      <div v-if="fields.length === 0" class="text-gray-500 italic bg-gray-50 p-4 rounded-lg">
        Chưa có khách thuê
      </div>

      <div v-for="(t, idx) in fields" :key="idx"
        class="bg-gray-50 p-4 rounded-lg mb-3 hover:bg-gray-100 transition-colors">
        <div class="space-y-3">

          <div>
            <Field :name="`customers[${idx}].identity_code`" v-model="t.identity_code" placeholder="CMND/CCCD"
              :rules="required"
              class="w-full bg-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-shadow" />
            <ErrorMessage :name="`customers[${idx}].identity_code`" class="text-red-500 text-sm mt-1 block" />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <Field :name="`customers[${idx}].first_name`" v-model="t.first_name" placeholder="Họ" :rules="required"
                class="w-full bg-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-shadow" />
              <ErrorMessage :name="`customers[${idx}].first_name`" class="text-red-500 text-sm mt-1 block" />
            </div>
            <div>
              <Field :name="`customers[${idx}].last_name`" v-model="t.last_name" placeholder="Tên" :rules="required"
                class="w-full bg-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-shadow" />
              <ErrorMessage :name="`customers[${idx}].last_name`" class="text-red-500 text-sm mt-1 block" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <Field :name="`customers[${idx}].email`" v-model="t.email" placeholder="Email" :rules="emailRules"
                class="w-full bg-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-shadow" />
              <ErrorMessage :name="`customers[${idx}].email`" class="text-red-500 text-sm mt-1 block" />
            </div>
            <div>
              <Field :name="`customers[${idx}].phone`" v-model="t.phone" placeholder="Số điện thoại" :rules="required"
                class="w-full bg-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-shadow" />
              <ErrorMessage :name="`customers[${idx}].phone`" class="text-red-500 text-sm mt-1 block" />
            </div>
          </div>

          <div>
            <Field :name="`customers[${idx}].address`" v-model="t.address" placeholder="Địa chỉ" :rules="required"
              class="w-full bg-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-shadow" />
            <ErrorMessage :name="`customers[${idx}].address`" class="text-red-500 text-sm mt-1 block" />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-gray-700 mb-1 font-medium">Giới tính</label>
              <div class="flex gap-2">
                <button type="button" :class="[
                  'px-4 py-2 rounded-lg border transition',
                  t.gender === 1
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white border-gray-300 text-gray-700'
                ]" @click="t.gender = 1">
                  Nam
                </button>
                <button type="button" :class="[
                  'px-4 py-2 rounded-lg border transition',
                  t.gender === 2
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white border-gray-300 text-gray-700'
                ]" @click="t.gender = 2">
                  Nữ
                </button>
              </div>
              <ErrorMessage :name="`customers[${idx}].gender`" class="text-red-500 text-sm mt-1 block" />
            </div>

            <div>
              <label class="block text-gray-700 mb-1 font-medium">Ngày sinh</label>
              <Field type="date" :name="`customers[${idx}].date_of_birth`" v-model="t.date_of_birth" :rules="required"
                class="w-full bg-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-shadow" />
              <ErrorMessage :name="`customers[${idx}].date_of_birth`" class="text-red-500 text-sm mt-1 block" />
            </div>
          </div>

          <label class="flex items-center gap-2 mt-3 cursor-pointer">
            <input type="radio" :checked="t.is_represent" @change="setRepresentative(idx)"
              class="w-4 h-4 text-blue-500 cursor-pointer" />
            <span class="text-gray-700">Đại diện hợp đồng</span>
          </label>

          <button type="button"
            class="mt-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
            @click="remove(idx)">
            Xóa khách này
          </button>
        </div>
      </div>

      <p v-if="repError" class="text-red-600 text-sm mb-3 bg-red-50 p-3 rounded-lg">
        {{ repError }}
      </p>

      <div class="mt-4 flex gap-3">
        <button type="button"
          class="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          @click="add">
          + Thêm khách
        </button>
        <button type="submit"
          class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium">
          Áp dụng
        </button>
      </div>
    </Form>

    <!-- Thông tin đã ghi nhận -->
    <div v-if="appliedCustomers.length > 0" class="mt-6 border-t pt-6">
      <h5 class="font-semibold text-md mb-3 text-gray-800">Thông tin đã ghi nhận</h5>
      <div class="space-y-3">
        <div v-for="(customer, idx) in appliedCustomers" :key="idx" class="bg-blue-50 p-4 rounded-lg">
          <div class="flex items-start justify-between">
            <div class="space-y-1">
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
                Giới tính: {{ customer.gender === 1 ? 'Nam' : 'Nữ' }} |
                Ngày sinh: {{ customer.date_of_birth }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { Form, Field, ErrorMessage } from 'vee-validate'

const props = defineProps<{ customers: any[] }>()
const emit = defineEmits(['update'])

const fields = reactive((props.customers || []).map(c => ({ ...c })))
const repError = ref("")
const appliedCustomers = ref<any[]>([])

watch(() => props.customers, v => {
  fields.splice(0, fields.length, ...(v || []).map(c => ({ ...c })))
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

function add() {
  fields.push({
    identity_code: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    gender: null,
    date_of_birth: '',
    is_represent: false
  })
}

function remove(i: number) {
  fields.splice(i, 1)
}

function setRepresentative(idx: number) {
  fields.forEach((t, i) => (t.is_represent = i === idx))
}

function apply() {
  if (fields.length === 0) {
    repError.value = "Phải có ít nhất một khách thuê"
    return
  }

  if (!fields.some(t => t.is_represent)) {
    repError.value = "Phải chọn ít nhất một khách đại diện hợp đồng"
    return
  }

  for (let i = 0; i < fields.length; i++) {
    const f = fields[i]
    if (!f.identity_code || !f.first_name || !f.last_name ||
      !f.email || !f.phone || !f.address ||
      !f.gender || !f.date_of_birth) {
      repError.value = `Vui lòng điền đầy đủ thông tin cho khách thứ ${i + 1}`
      return
    }
  }

  repError.value = ""

  appliedCustomers.value = fields.map(t => ({ ...t }))

  emit("update", appliedCustomers.value)
}
</script>

<style scoped>
.btn {
  padding: .4rem .8rem;
  border-radius: .35rem;
  background: #e5e7eb;
}

.btn-primary {
  background: #2563eb;
  color: white;
  padding: .4rem .8rem;
  border-radius: .35rem;
}
</style>