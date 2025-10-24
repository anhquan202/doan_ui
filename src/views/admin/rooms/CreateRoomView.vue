<script setup lang="ts">
import { ref, computed } from 'vue'
import RoomFormBasic from './RoomFormBasic.vue'
import RoomFormSupplies from './RoomFormSupplies.vue'
import RoomFormUtilities from './RoomFormUtilities.vue'

const basicInfo = ref({ room_type: '', max_people: null, default_price: null })
const supplies = ref([])
const utilities = ref([])
const showPreview = ref(false)

const payload = computed(() => ({
  ...basicInfo.value,
  room_supplies_attributes: supplies.value,
  room_utilities_attributes: utilities.value
}))

const submitForm = () => {
  console.log('Payload gửi:', payload.value)
  showPreview.value = true
}

const resetForm = () => {
  basicInfo.value = { room_type: '', max_people: null, default_price: null }
  supplies.value = []
  utilities.value = []
  showPreview.value = false
}
</script>
<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
    <div class="max-w-5xl mx-auto space-y-6">
      <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <div class="flex items-center gap-4">
          <div
            class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4">
              </path>
            </svg>
          </div>
          <div>
            <h1 class="text-3xl font-bold text-slate-900">Tạo Phòng Mới</h1>
            <p class="text-slate-600 mt-1">Điền thông tin chi tiết để tạo phòng cho thuê</p>
          </div>
        </div>
      </div>

      <form @submit.prevent="submitForm" class="space-y-6">
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
          <RoomFormBasic v-model="basicInfo" />
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
        </div>

        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div class="flex justify-end gap-4">
            <button type="button"
              class="px-8 py-3 border-2 border-slate-300 text-slate-700 font-medium rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
              @click="resetForm">
              <span class="flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                Hủy bỏ
              </span>
            </button>
            <button type="submit"
              class="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              <span class="flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                Tạo phòng mới
              </span>
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
