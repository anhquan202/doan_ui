<script setup lang="ts">
import { toastError, toastSuccess } from '@/helpers/toast'
import { getVehiclesService } from '@/services/admin/vehicles/getVehiclesService'
import { toggleActiveVehicleService } from '@/services/admin/vehicles/toggleActiveVehicleService'
import type { Vehicle } from '@/types/Vehicles'
import { onMounted, ref } from 'vue'
const vehicles = ref<Vehicle[]>([])
const showModal = ref(false)
const selectedVehicle = ref<Vehicle | null>(null)

const fetchVehicles = async () => {
  try {
    const res = await getVehiclesService()
    vehicles.value = res.data.vehicles
  } catch (error) {
    console.log(error)
  }
}

const handleToggleClick = (vehicle: Vehicle) => {
  selectedVehicle.value = vehicle
  showModal.value = true
}

const confirmToggle = async (id: number) => {
  try {
    const res = await toggleActiveVehicleService(id)
    if (res.success) {
      toastSuccess("Thay đổi trạng thái thành công")
      fetchVehicles()
    }
  } catch (error) {
    console.log(error)
    toastError("Thay đổi trạng thái gặp vấn đề!")
  } finally {
    showModal.value = false
    selectedVehicle.value = null
  }
}

const cancelToggle = () => {
  showModal.value = false
  selectedVehicle.value = null
}

onMounted(() => fetchVehicles())
</script>
<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-800 mb-6">Quản lý phương tiện</h1>

      <div class="bg-white rounded-lg shadow overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Loại phương
                tiện</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Mô tả</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Trạng thái</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Hành động</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="vehicle in vehicles" :key="vehicle.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ vehicle.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ vehicle.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ vehicle.description }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="['px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full', vehicle.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800']">
                  {{ vehicle.is_active ? 'Hoạt động' : 'Ngừng hoạt động' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <button @click="handleToggleClick(vehicle)"
                  :class="['px-4 py-2 rounded-md font-medium transition-colors', vehicle.is_active ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white']">
                  {{ vehicle.is_active ? 'Ngừng' : 'Mở lại' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showModal && selectedVehicle" class="fixed inset-0 flex h-fit top-1/4 justify-center p-4 z-50">
      <div class="bg-gray-50 rounded-lg shadow-xl max-w-md w-full p-6 transform transition-all">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Xác nhận thay đổi</h3>
        <p class="text-gray-600 mb-6">
          Bạn chắc chắn muốn {{ selectedVehicle.is_active ? 'ngừng hoạt động' : 'mở lại hoạt động' }}
          <span class="font-semibold text-gray-900">{{ selectedVehicle.name }}</span>?
        </p>
        <div class="flex gap-3 justify-end">
          <button @click="cancelToggle"
            class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md font-medium transition-colors">
            Hủy
          </button>
          <button @click="confirmToggle(selectedVehicle.id)"
            :class="['px-4 py-2 rounded-md font-medium text-white transition-colors', selectedVehicle.is_active ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600']">
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
