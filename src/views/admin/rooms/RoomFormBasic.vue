<script setup lang="ts">
import { Field, ErrorMessage, useField } from 'vee-validate'
import { reactive, ref, computed } from 'vue'
import { ChevronDownIcon, CheckIcon } from 'lucide-vue-next'

const model = reactive<{
  room_type: string
  max_people: number | null
  price: number | null
}>({
  room_type: '',
  max_people: null,
  price: null,
})

const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)
const options = [
  { label: 'Phòng đơn', value: 'single' },
  { label: 'Phòng đôi', value: 'double' },
  { label: 'Phòng ba', value: 'three' },
]
const selectedLabel = computed(() => {
  const found = options.find(o => o.value === model.room_type)
  return found ? found.label : '-- Chọn loại phòng --'
})
function selectOption(value: string) {
  model.room_type = value
  isOpen.value = false
}

const { errorMessage: roomTypeError, validate: validateRoomType } = useField('room_type')
const { errorMessage: maxPeopleError, validate: validateMaxPeople } = useField('max_people')
const { errorMessage: defaultPriceError, validate: validateDefaultPrice } = useField('price')

function onRoomTypeOpen() {
  isOpen.value = true
  validateRoomType()
}
function onMaxFocus() {
  validateMaxPeople()
}
function onPriceFocus() {
  validateDefaultPrice()
}
</script>

<template>
  <div class="space-y-4">
    <h2 class="text-xl font-semibold text-slate-800">Thông tin cơ bản</h2>

    <div class="grid grid-cols-3 gap-4">
      <div class="w-full">
        <label class="block text-sm font-medium mb-1 text-slate-700">Loại phòng</label>

        <div class="relative" ref="dropdownRef">
          <button type="button" @click="onRoomTypeOpen"
            class="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-left flex items-center justify-between hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all">
            <span :class="model.room_type ? 'text-slate-800' : 'text-slate-400'">
              {{ selectedLabel }}
            </span>
            <ChevronDownIcon :class="['w-5 h-5 transition-transform', isOpen && 'rotate-180']" />
          </button>

          <div v-if="isOpen" class="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-xl border border-slate-200">
            <button v-for="option in options" :key="option.value" type="button" @click="selectOption(option.value)"
              class="w-full px-4 py-3 text-left hover:bg-blue-50 flex items-center justify-between">
              <span>{{ option.label }}</span>
              <CheckIcon v-if="model.room_type === option.value && option.value" class="w-5 h-5 text-blue-600" />
            </button>
          </div>
        </div>
        <span class="text-red-500 text-sm mt-1 block">{{ roomTypeError }}</span>
      </div>

      <div>
        <label class="block text-sm font-medium mb-1">Số người tối đa</label>
        <Field type="number" name="max_people" v-model="model.max_people" placeholder="VD: 2" min="1"
          class="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          @focus="onMaxFocus" />
        <span class="text-red-500 text-sm mt-1 block">{{ maxPeopleError }}</span>
      </div>

      <div>
        <label class="block text-sm font-medium mb-1">Giá mặc định (VND)</label>
        <Field type="number" name="price" v-model="model.price" placeholder="VD: 500000" min="0" step="1000"
          class="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          @focus="onPriceFocus" />
        <span class="text-red-500 text-sm mt-1 block">{{ defaultPriceError }}</span>
      </div>
    </div>
  </div>
</template>
