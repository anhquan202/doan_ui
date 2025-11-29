<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { type CustomerDetail } from '@/types/Customers'
import { getCustomerDetailService } from '@/services/admin/customers/getCustomerDetailService'

interface Props {
  id: number | null
  show: boolean
  close: () => void
}

const props = defineProps<Props>()
const emit = defineEmits<{ (e: 'close'): void }>()

const customer = ref<CustomerDetail>()
const loading = ref(false)

const fetchDetail = async (id: number) => {
  try {
    loading.value = true
    const res = await getCustomerDetailService(id)
    console.log(res.data.customer);
    if (res.success) {
      customer.value = res.data.customer
    }
  } catch (err) {
    console.log(err)
  } finally {
    loading.value = false
  }
}

watch(
  () => [props.id, props.show],
  ([id, show]) => {
    if (typeof id === 'number' && show) fetchDetail(id)
  },
  { immediate: true }
)
</script>

<template>
  <div v-if="props.show" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40" @click="props.close()">
    <div class="bg-white rounded-lg p-6 w-96 relative" @click.stop>

      <button @click="props.close()" class="absolute top-2 right-2 text-gray-500 hover:text-gray-700">✕</button>

      <div v-if="loading" class="flex justify-center py-8">
        <div class="animate-spin h-10 w-10 border-4 border-t-blue-500 border-gray-300 rounded-full"></div>
      </div>

      <div v-else-if="customer">
        <h2 class="text-lg font-semibold mb-4">Thông tin khách hàng</h2>
        <div class="space-y-2">
          <p><strong>Họ tên:</strong> {{ customer.full_name }}</p>
          <p><strong>Phòng đang ở:</strong> {{ customer.room_name }}</p>
        </div>
      </div>

      <div v-else class="text-center py-8 text-gray-500">
        Không có dữ liệu
      </div>
    </div>
  </div>
</template>
