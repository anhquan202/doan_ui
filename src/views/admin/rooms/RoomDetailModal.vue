<script setup lang="ts">
import { Home, X, DollarSign, Users, Package, Wrench } from 'lucide-vue-next'
import type { Room as RoomDetail } from '@/services/admin/room/showService'
defineProps<{
  room: RoomDetail | null
  onClose: () => void
}>()
</script>

<template>
  <div v-if="room" class="fixed inset-0 bg-opacity-50 flex items-center justify-center p-4 z-50" @click="onClose">
    <div class="modal-container bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] shadow-2xl" @click.stop>
      <!-- Header -->
      <div class="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl z-10">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <Home class="size-8" />
            <div>
              <h2 class="text-2xl font-bold">{{ room.room_name }}</h2>
              <p class="text-blue-100 text-sm">{{ room.room_type }}</p>
            </div>
          </div>
          <button @click="onClose" class="hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-all">
            <X class="size-6" />
          </button>
        </div>
      </div>

      <!-- Nội dung chính -->
      <div class="p-6 space-y-6">
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-green-50 rounded-lg p-4 border border-green-200">
            <div class="flex items-center gap-2 text-green-700 mb-1">
              <DollarSign class="size-5" />
              <span class="text-sm font-semibold">Giá thuê</span>
            </div>
            <p class="text-2xl font-bold text-green-700">{{ room.price.toLocaleString('vi-VN') }} ₫</p>
            <p class="text-xs text-green-600">/ tháng</p>
          </div>
          <div class="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div class="flex items-center gap-2 text-blue-700 mb-1">
              <Users class="size-5" />
              <span class="text-sm font-semibold">Sức chứa</span>
            </div>
            <p class="text-2xl font-bold text-blue-700">{{ room.max_customers }} người</p>
            <p class="text-xs text-blue-600">tối đa</p>
          </div>
        </div>

        <!-- Mô tả -->
        <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h3 class="font-semibold text-gray-800 mb-2">Mô tả</h3>
          <p class="text-gray-600 leading-relaxed">{{ room.description }}</p>
        </div>

        <!-- Trang thiết bị -->
        <div>
          <div class="flex items-center gap-2 mb-3">
            <Package class="text-purple-600 size-6" />
            <h3 class="font-semibold text-gray-800 text-lg">Trang thiết bị</h3>
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div v-for="supply in room.supplies" :key="supply.id"
              class="bg-purple-50 rounded-lg p-3 border border-purple-200 flex items-center gap-2">
              <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span class="text-gray-700">{{ supply.name }}</span>
            </div>
          </div>
        </div>

        <!-- Tiện ích -->
        <div>
          <div class="flex items-center gap-2 mb-3">
            <Wrench class="text-orange-600 size-6" />
            <h3 class="font-semibold text-gray-800 text-lg">Tiện ích & Dịch vụ</h3>
          </div>
          <div class="space-y-2">
            <div v-for="utility in room.utilities" :key="utility.id" class="rounded-lg p-4 border-2"
              :class="utility.is_required ? 'bg-orange-50 border-orange-300' : 'bg-gray-50 border-gray-300'">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <h4 class="font-semibold text-gray-800">{{ utility.utility_type_label }}</h4>
                    <span v-if="utility.is_required"
                      class="px-2 py-0.5 bg-orange-200 text-orange-800 text-xs rounded-full font-semibold">
                      Bắt buộc
                    </span>
                  </div>
                  <p class="text-sm text-gray-600">{{ utility.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="sticky bottom-0 bg-gray-50 p-4 rounded-b-2xl z-10">
        <button @click="onClose"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors">
          Đóng
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-container::-webkit-scrollbar {
  width: 8px;
}

.modal-container::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 10px;
}

.modal-container::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #93c5fd, #3b82f6);
  border-radius: 10px;
  transition: background 0.3s ease;
}

.modal-container::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #60a5fa, #2563eb);
}

.modal-container {
  scrollbar-width: thin;
  scrollbar-color: #3b82f6 transparent;
}

.modal-container {
  scroll-behavior: smooth;
}
</style>