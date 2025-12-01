<script lang="ts" setup>
import { getContractDetailService } from '@/services/admin/contracts/getContractDetailService'
import type { Contract } from '@/types/Contracts';
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router';

const contractDetail = ref<Contract>()
const loading = ref(false)

const route = useRoute()
const router = useRouter()
const id = Number(route.params.id)
const fetchDetail = async () => {
  try {
    loading.value = true
    const res = await getContractDetailService(id)
    console.log(res.data.contract);

    contractDetail.value = res.data.contract
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}
const backToIndex = () => {
  router.push({ name: 'contracts' })
}
onMounted(() => fetchDetail())
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-3xl font-bold text-slate-800 flex items-center gap-2">
            <svg class="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
              </path>
            </svg>
            Chi tiết hợp đồng
          </h2>
        </div>
        <button @click="backToIndex"
          class="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200">
          <svg class="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" fill="none"
            stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18">
            </path>
          </svg>
          Back to View
        </button>
      </div>

      <!-- Contract Header Card -->
      <div class="bg-white rounded-2xl shadow-xl p-8 mb-6 border border-indigo-100" v-if="contractDetail">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div class="flex items-center gap-3 mb-2">
              <h2
                class="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Hợp đồng #{{ contractDetail.contract_code }}
              </h2>
              <span class="px-4 py-1.5 bg-green-100 text-green-700 text-sm rounded-full font-semibold">
                Đang hoạt động
              </span>
            </div>
            <div class="flex items-center gap-2 text-gray-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6">
                </path>
              </svg>
              <span class="text-lg font-semibold">Phòng {{ contractDetail.room_info.name }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6" v-if="contractDetail">
        <!-- Room Information Card -->
        <div class="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div class="flex items-center gap-2 mb-6">
            <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6">
              </path>
            </svg>
            <h2 class="text-2xl font-bold text-gray-800">Thông tin phòng</h2>
          </div>

          <div class="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-xl mb-6 text-white shadow-lg">
            <p class="text-sm opacity-90 mb-1">Tên phòng</p>
            <p class="text-3xl font-bold">
              {{ contractDetail.room_info.name }}
            </p>
          </div>

          <div class="mb-6">
            <h3 class="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
              </svg>
              Trang thiết bị
            </h3>
            <div class="grid grid-cols-2 gap-3">
              <div v-for="supply in contractDetail.room_info.supplies" :key="supply.id"
                class="bg-gradient-to-br from-gray-50 to-blue-50 p-4 rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all duration-200">
                <div class="flex items-center gap-2">
                  <div class="w-2 h-2 bg-indigo-600 rounded-full"></div>
                  <span class="text-gray-800 font-medium">{{ supply.name }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Utilities -->
          <div>
            <h3 class="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z">
                </path>
              </svg>
              Dịch vụ
            </h3>

            <div v-for="utility in contractDetail.room_info.utilities" :key="utility.id"
              class="bg-gradient-to-r from-yellow-50 to-amber-50 p-4 rounded-xl border border-yellow-200 mb-3 hover:shadow-lg transition-all duration-200">
              <div class="flex justify-between items-center">
                <div class="flex items-center gap-2">
                  <div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                  </div>
                  <div class="flex flex-col">
                    <p class="font-semibold text-gray-800">
                      {{ utility.utility_type_label }}
                    </p>
                    <p class="text-sm text-gray-600">{{ utility.description }}</p>
                  </div>
                </div>
                <div class="flex gap-2 justify-center items-center">
                  <p class="text-xl font-bold text-amber-700">
                    {{ utility.fee }}
                  </p>
                  <p class="text-xs text-gray-600">/ đơn vị</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div class="flex items-center gap-2 mb-6">
            <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z">
              </path>
            </svg>
            <h2 class="text-2xl font-bold text-gray-800">Khách thuê</h2>
            <span class="ml-auto px-3 py-1 bg-indigo-100 text-indigo-700 text-sm rounded-full font-medium">
              {{ contractDetail.customers.length }} người
            </span>
          </div>

          <div class="space-y-4">
            <div v-for="(customer, index) in contractDetail.customers" :key="customer.id"
              class="bg-gradient-to-br from-white to-indigo-50 p-6 rounded-xl border-2 border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all duration-200">
              <div class="flex items-start justify-between mb-4">
                <div class="flex items-center space-x-3">
                  <div
                    class="w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {{ customer.full_name.charAt(0) }}
                  </div>
                  <div>
                    <h3 class="font-bold text-gray-800 text-lg">{{ customer.full_name }}</h3>
                    <p class="text-sm text-gray-500 flex items-center gap-1">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                      {{ customer.gender_text }}
                    </p>
                  </div>
                </div>

                <span v-if="index === 0"
                  class="px-3 py-1.5 bg-blue-500 text-white text-xs rounded-full font-semibold shadow-md">
                  Chủ hợp đồng
                </span>
              </div>

              <div class="space-y-2.5 text-sm">
                <div class="flex items-center gap-2 text-gray-700">
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2">
                    </path>
                  </svg>
                  <span class="font-medium">CMND:</span>
                  <span>{{ customer.identity_code }}</span>
                </div>
                <div class="flex items-center gap-2 text-gray-700">
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z">
                    </path>
                  </svg>
                  <span class="font-medium">Email:</span>
                  <span class="truncate">{{ customer.email }}</span>
                </div>
                <div class="flex items-center gap-2 text-gray-700">
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z">
                    </path>
                  </svg>
                  <span class="font-medium">SĐT:</span>
                  <span>{{ customer.phone }}</span>
                </div>
                <div class="flex items-start gap-2 text-gray-700">
                  <svg class="w-4 h-4 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <span class="font-medium">Địa chỉ:</span>
                  <span class="flex-1">{{ customer.address }}</span>
                </div>
                <div class="flex items-center gap-2 text-gray-700">
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <span class="font-medium">Ngày sinh:</span>
                  <span>{{ customer.date_of_birth }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
