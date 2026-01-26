<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Eye, Pencil, Trash2 } from 'lucide-vue-next'
import { getCustomersService } from '@/services/admin/customers/getCustomersService'
import type { Customer, PaginationMeta } from '@/types/Customers'
import Paginate from '@/components/Paginate.vue'
import { getCustomerStatusClass } from '@/helpers/statuses/customerStatusHelpers'
import router from '@/router'
import CustomerDetailView from './CustomerDetailView.vue'

const customers = ref<Customer[]>([])

const selectedCustomerId = ref<number | null>(null)
const showModalCustomerDetail = ref(false)

const meta = ref<PaginationMeta | null>(null)
const currentPage = ref(1)
const loading = ref(false)

const fetchCustomers = async (page = 1, perPage = 10) => {
  try {
    loading.value = true
    const res = await getCustomersService(page, perPage)
    if (res && res.success) {
      customers.value = res.data.customers
      meta.value = res.data.meta
      currentPage.value = res.data.meta.current_page
    }
  } catch (err) {
    console.log(err)
  } finally {
    loading.value = false
  }
}

const handleChangePage = (page: number) => fetchCustomers(page)

const handleView = (customer: Customer) => {
  selectedCustomerId.value = customer.id
  showModalCustomerDetail.value = true
}

const closeModal = () => {
  showModalCustomerDetail.value = false
  selectedCustomerId.value = null
}

const handleEdit = (customer: Customer) => {
  router.push({ name: 'customers.edit', params: { id: customer.id } })
}

onMounted(() => {
  fetchCustomers()
})
</script>

<template>
  <CustomerDetailView :id="selectedCustomerId" :show="showModalCustomerDetail" :close="closeModal" />
  <div class="container mx-auto p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Quản lý khách hàng</h1>
    </div>

    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div v-if="loading" class="p-8 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <p class="mt-2 text-gray-600">Đang tải...</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                CMND/CCCD
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Họ và tên
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Số điện thoại
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Giới tính
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày sinh
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="customer in customers" :key="customer.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ customer.id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ customer.identity_code }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ customer.full_name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ customer.email }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ customer.phone }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ customer.gender_text }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ customer.date_of_birth }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getCustomerStatusClass(customer.status)">
                  {{ customer.status_text }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex gap-2">
                  <button @click="handleView(customer)"
                    class="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition"
                    title="Xem chi tiết">
                    <Eye :size="18" />
                  </button>
                  <button @click="handleEdit(customer)"
                    class="text-yellow-600 hover:text-yellow-900 p-1 rounded hover:bg-yellow-50 transition"
                    title="Chỉnh sửa">
                    <Pencil :size="18" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="customers.length === 0" class="p-8 text-center text-gray-500">
          Không có dữ liệu khách hàng
        </div>
      </div>
    </div>

    <div class="mt-6">
      <Paginate :meta="meta" :current-page="currentPage" @change-page="handleChangePage" />
    </div>
  </div>
</template>