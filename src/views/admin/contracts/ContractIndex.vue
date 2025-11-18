<template>
  <div class="p-4">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-2xl font-semibold">Danh sách hợp đồng</h2>
      <router-link :to="{ name: 'contracts.create' }" class="btn-primary">Tạo hợp đồng</router-link>
    </div>

    <div v-if="loading" class="text-gray-600">Đang tải hợp đồng...</div>

    <div v-else>
      <div v-if="error" class="text-red-600 mb-4">{{ error }}</div>

      <div v-else-if="contracts.length === 0" class="text-gray-600">Chưa có hợp đồng nào.</div>

      <div v-else>
        <table class="min-w-full bg-white border">
          <thead>
            <tr class="text-left">
              <th class="px-4 py-2 border">Mã</th>
              <th class="px-4 py-2 border">Phòng</th>
              <th class="px-4 py-2 border">Thời hạn</th>
              <th class="px-4 py-2 border">Bắt đầu</th>
              <th class="px-4 py-2 border">Kết thúc</th>
              <th class="px-4 py-2 border">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="contract in contracts" :key="contract.id" class="hover:bg-gray-50">
              <td class="px-4 py-2 border">{{ contract.contract_code }}</td>
              <td class="px-4 py-2 border">{{ getRoomName(contract) }}</td>
              <td class="px-4 py-2 border">{{ contract.term_months }} tháng</td>
              <td class="px-4 py-2 border">{{ contract.start_date_formatted }}</td>
              <td class="px-4 py-2 border">{{ contract.end_date_formatted }}</td>
              <td class="px-4 py-2 border">{{ contract.status || contract.state || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getContractService } from '@/services/admin/contracts/getContractService'

const contracts = ref<any[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const loadContracts = async () => {
  loading.value = true
  error.value = null
  try {
    const res: any = await getContractService()
    const payload = res.data.contracts
    contracts.value = payload
  } catch (err: any) {
    error.value = err?.message || String(err) || 'Lỗi khi tải dữ liệu'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadContracts()
})

const getRoomName = (c: any) => {
  return c?.room_name
}
</script>

<style scoped>
.btn-primary {
  background: #2563eb;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  text-decoration: none;
}
</style>
