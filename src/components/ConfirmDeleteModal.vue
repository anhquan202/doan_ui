<script setup lang="ts">
import { ref, watch } from 'vue'
import { AlertTriangle, X } from 'lucide-vue-next'

interface Props {
  show: boolean
  title?: string
  message?: string
  onConfirm: () => void
  onCancel: () => void
}

const props = defineProps<Props>()
const isVisible = ref(props.show)

watch(() => props.show, (v) => (isVisible.value = v))
</script>

<template>
  <transition name="fade">
    <div v-if="isVisible" class="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
      <div class="bg-white rounded-2xl shadow-xl w-[90%] max-w-md p-6 relative animate-fadeIn">
        <button @click="props.onCancel" class="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition">
          <X class="w-5 h-5" />
        </button>

        <div class="flex flex-col items-center text-center space-y-3">
          <AlertTriangle class="w-12 h-12 text-red-500" />
          <h3 class="text-lg font-semibold text-gray-800">
            {{ props.title || 'Xác nhận xoá' }}
          </h3>
          <p class="text-gray-500 text-sm leading-relaxed">
            {{ props.message || 'Bạn có chắc muốn xoá mục này? Hành động này không thể hoàn tác.' }}
          </p>

          <div class="flex gap-3 mt-4">
            <button @click="props.onCancel"
              class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition">
              Huỷ
            </button>
            <button @click="props.onConfirm"
              class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition">
              Xoá
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.animate-fadeIn {
  animation: fadeIn 0.25s ease-out;
}

@keyframes fadeIn {
  from {
    transform: translateY(10px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
