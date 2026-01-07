<template>
  <div class="max-w-md mx-auto p-6">
    <div class="bg-white rounded-2xl shadow-lg p-8 space-y-6">
      <div class="text-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800 mb-2">Thông tin kỳ hạn</h2>
        <p class="text-gray-500 text-sm">Vui lòng chọn ngày bắt đầu và kỳ hạn thuê phòng</p>
      </div>

      <!-- Ngày bắt đầu -->
      <div class="space-y-2">
        <label class="block text-sm font-semibold text-gray-700">
          <span class="flex items-center gap-2">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Ngày bắt đầu
          </span>
        </label>

        <input type="date" v-model="form.start_date" class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 
                 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 
                 transition-all duration-200 outline-none text-gray-700" />
      </div>

      <!-- Kỳ hạn -->
      <div class="space-y-2">
        <label class="block text-sm font-semibold text-gray-700">
          <span class="flex items-center gap-2">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Kỳ hạn
          </span>
        </label>

        <div class="grid grid-cols-3 gap-3">
          <button v-for="m in termOptions" :key="m" type="button" @click="form.term_months = m"
            class="py-3 px-4 rounded-xl font-semibold transition-all duration-200 border-2" :class="form.term_months === m
              ? 'bg-blue-600 text-white border-blue-600 shadow-lg transform scale-105'
              : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50'">
            <div class="text-lg">{{ m }}</div>
            <div class="text-xs opacity-90">tháng</div>
          </button>
        </div>
      </div>

      <!-- Preview -->
      <div v-if="isValid" class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
        <div class="text-sm text-gray-700">
          <p class="font-semibold mb-1">Thông tin đã chọn:</p>
          <p>• Ngày bắt đầu: <span class="font-semibold">{{ formatDate(form.start_date) }}</span></p>
          <p>• Kỳ hạn: <span class="font-semibold">{{ form.term_months }} tháng</span></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from "vue";
import dayjs from "dayjs";

const emit = defineEmits<{
  (e: "next", payload: { start_date: string; term_months: number }): void;
}>();

// Dùng number cho value
const form = reactive({
  start_date: "",
  term_months: 0,
});

const termOptions = [6, 9, 12];

const isValid = computed(() => form.start_date !== "" && form.term_months > 0);

function formatDate(date: string) {
  return dayjs(date).format("DD/MM/YYYY");
}

function handleNext() {
  if (!isValid.value) return;

  emit("next", {
    start_date: form.start_date,
    term_months: form.term_months,
  });
}
</script>
