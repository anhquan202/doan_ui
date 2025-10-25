<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { ChevronDownIcon, CheckIcon } from 'lucide-vue-next'
import getRoomStatusService from '@/services/admin/room/getRoomStatusService'

interface Room {
  room_type?: string
  price?: number
  description?: string
  status?: string
}

const props = defineProps<{ modelValue: Room; isEdit?: boolean }>()
const emit = defineEmits(['update:modelValue'])

const roomTypeOptions = [
  { label: 'Phòng đơn', value: 'single' },
  { label: 'Phòng đôi', value: 'double' },
  { label: 'Phòng ba', value: 'three' },
]

// --- Dropdown state ---
const isOpenType = ref(false)
const isOpenStatus = ref(false)

// --- Status options from API ---
const statusOptions = ref<{ label: string; key: string; value: number }[]>([])

onMounted(async () => {
  try {
    const data = await getRoomStatusService()

    statusOptions.value = data
  } catch (error) {
    console.error('Error fetching room status:', error)
  }
})

// --- Toggle dropdown ---
const toggleType = () => (isOpenType.value = !isOpenType.value)
const toggleStatus = () => (isOpenStatus.value = !isOpenStatus.value)

const updateField = (key: string, value: any) => {
  const next = { ...props.modelValue, [key]: value }
  try {
    if (JSON.stringify(next) === JSON.stringify(props.modelValue)) return
  } catch (e) {
    // fallback: continue
  }
  // schedule emit to avoid synchronous reactive loops
  setTimeout(() => emit('update:modelValue', next), 0)
}
</script>

<template>
  <div class="space-y-4">
    <h2 class="text-xl font-semibold text-slate-800">Thông tin cơ bản</h2>
    <div class="grid grid-cols-2 gap-4">
      <!-- Room Type -->
      <div class="w-full">
        <label class="block text-sm font-medium mb-1 text-slate-700">Loại phòng</label>
        <div class="relative">
          <button type="button" @click="toggleType"
            class="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-left flex items-center justify-between hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all">
            <span :class="props.modelValue?.room_type ? 'text-slate-800' : 'text-slate-400'">
              {{roomTypeOptions.find(o => o.value === props.modelValue?.room_type)?.label || '-- Chọn loại phòng --'}}
            </span>
            <ChevronDownIcon :class="['w-5 h-5 transition-transform', isOpenType && 'rotate-180']" />
          </button>

          <div v-if="isOpenType"
            class="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-xl border border-slate-200">
            <button v-for="option in roomTypeOptions" :key="option.value" type="button"
              @click="() => { updateField('room_type', option.value); isOpenType = false }"
              class="w-full px-4 py-3 text-left hover:bg-blue-50 flex items-center justify-between">
              <span>{{ option.label }}</span>
              <CheckIcon v-if="props.modelValue?.room_type === option.value" class="w-5 h-5 text-blue-600" />
            </button>
          </div>
        </div>
      </div>

      <!-- Status (only show when editing) -->
      <div v-if="props.isEdit">
        <label class="block text-sm font-medium mb-1 text-slate-700">Trạng thái</label>
        <div class="relative">
          <button type="button" @click="toggleStatus"
            class="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-left flex items-center justify-between hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all">
            <span :class="props.modelValue?.status ? 'text-slate-800' : 'text-slate-400'">
              {{statusOptions.find(s => s.key === props.modelValue?.status)?.label || '-- Chọn trạng thái --'}}
            </span>
            <ChevronDownIcon :class="['w-5 h-5 transition-transform', isOpenStatus && 'rotate-180']" />
          </button>

          <div v-if="isOpenStatus"
            class="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-xl border border-slate-200">
            <button v-for="option in statusOptions" :key="option.key" type="button"
              @click="() => { updateField('status', option.key); isOpenStatus = false }"
              class="w-full px-4 py-3 text-left hover:bg-blue-50 flex items-center justify-between">
              <span>{{ option.label }}</span>
              <CheckIcon v-if="props.modelValue?.status === option.key" class="w-5 h-5 text-blue-600" />
            </button>
          </div>
        </div>
      </div>

      <!-- Price -->
      <div>
        <label class="block text-sm font-medium mb-1">Giá mặc định (VND)</label>
        <input type="number" min="0" step="1000" :value="props.modelValue?.price"
          @input="(e) => updateField('price', +(e.target as HTMLInputElement).value)" placeholder="VD: 500000"
          class="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
      </div>

      <!-- Description -->
      <div class="col-span-2">
        <label class="block text-sm font-medium mb-1">Mô tả phòng</label>
        <textarea rows="4" :value="props.modelValue?.description"
          @input="(e) => updateField('description', (e.target as HTMLTextAreaElement).value)"
          placeholder="Mô tả ngắn gọn về phòng..."
          class="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"></textarea>
      </div>
    </div>
  </div>
</template>
