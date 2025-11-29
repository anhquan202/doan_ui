<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getCustomerDetailService } from '@/services/admin/customers/getCustomerDetailService'
import { editCustomerService } from '@/services/admin/customers/editCustomerService'
import { type CustomerDetail, type EditCustomerPayload } from '@/types/Customers'
import { toastError, toastSuccess } from '@/helpers/toast'

const route = useRoute()
const router = useRouter()

const id = Number(route.params.id)
const customer = ref<CustomerDetail>()
const form = ref<EditCustomerPayload>({
  id,
  email: '',
  phone: '',
  address: ''
})

const loading = ref(false)
const saving = ref(false)

const fetchDetail = async () => {
  try {
    loading.value = true
    const res = await getCustomerDetailService(id)

    if (res.success) {
      customer.value = res.data.customer
      form.value.email = res.data.customer.email
      form.value.phone = res.data.customer.phone
      form.value.address = res.data.customer.address
    }
  } catch (err) {
    console.log(err)
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  try {
    saving.value = true
    const res = await editCustomerService(form.value)

    if (res.success) {
      toastSuccess('Cập nhật thông tin khách hàng thành công!')
      router.push({ name: 'customers' })
    }
  } catch (err) {
    toastError('Có lỗi xảy ra khi cập nhật thông tin khách hàng.')
    console.log(err)
  } finally {
    saving.value = false
  }
}

onMounted(() => fetchDetail())
</script>

<template>
  <div class="container mx-auto px-4 py-8 max-w-3xl">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Chỉnh sửa khách hàng</h1>
      <p class="text-sm text-gray-500 mt-1">Cập nhật thông tin khách hàng trong hệ thống</p>
    </div>

    <div v-if="loading" class="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
      <div class="animate-spin h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
      <p class="mt-3 text-gray-600">Đang tải thông tin...</p>
    </div>

    <form v-else @submit.prevent="handleSubmit" class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="p-6 space-y-6">
        <div class="pb-6 border-b border-gray-200">
          <h2 class="text-base font-semibold text-gray-800 mb-4">Thông tin cơ bản</h2>

          <div v-if="customer" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">CMND/CCCD</label>
              <input :value="customer.identity_code" disabled
                class="w-full px-3 py-2 text-sm border border-gray-200 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
              <input :value="customer.full_name" disabled
                class="w-full px-3 py-2 text-sm border border-gray-200 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
              <input :value="customer.gender_text" disabled
                class="w-full px-3 py-2 text-sm border border-gray-200 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
              <input :value="customer.date_of_birth" disabled
                class="w-full px-3 py-2 text-sm border border-gray-200 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed" />
            </div>
          </div>
        </div>

        <div>
          <h2 class="text-base font-semibold text-gray-800 mb-4">Thông tin liên hệ</h2>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Email <span class="text-red-500">*</span>
              </label>
              <input v-model="form.email" type="email" required
                class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="example@email.com" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Số điện thoại <span class="text-red-500">*</span>
              </label>
              <input v-model="form.phone" type="text" required
                class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0912345678" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
              <textarea v-model="form.address" rows="3"
                class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Nhập địa chỉ" />
            </div>
          </div>
        </div>
      </div>

      <!-- Action buttons -->
      <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg flex items-center justify-end gap-3">
        <button type="button" @click="router.back()"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors">
          Hủy
        </button>

        <button type="submit" :disabled="saving"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          {{ saving ? "Đang lưu..." : "Lưu thay đổi" }}
        </button>
      </div>
    </form>
  </div>
</template>