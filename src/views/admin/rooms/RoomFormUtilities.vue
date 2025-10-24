<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import getUtilitiesService from '@/services/admin/utilities/getUtilitiesService'
import { Check } from 'lucide-vue-next'

const props = defineProps<{ modelValue: { utility_id: number; is_required: boolean }[] }>()
const emit = defineEmits(['update:modelValue'])

const utilities = ref<any[]>([])
const selected = ref<{ utility_id: number; is_required: boolean }[]>([...props.modelValue])

onMounted(async () => {
  utilities.value = await getUtilitiesService()
})

watch(selected, (val) => {
  emit('update:modelValue', val)
}, { deep: true })

const toggleUtility = (id: number) => {
  const existing = selected.value.find(u => u.utility_id === id)
  if (existing) selected.value = selected.value.filter(u => u.utility_id !== id)
  else selected.value.push({ utility_id: id, is_required: false })
}

const toggleRequired = (id: number) => {
  selected.value = selected.value.map(u =>
    u.utility_id === id ? { ...u, is_required: !u.is_required } : u
  )
}
</script>

<template>
  <div>
    <div class="space-y-2">
      <div v-for="item in utilities" :key="item.id"
        class="flex items-center justify-between p-3 rounded-xl border border-slate-300 hover:border-blue-400 transition-all">
        <div class="flex items-center gap-3">
          <button type="button" @click="toggleUtility(item.id)"
            class="w-6 h-6 border-2 rounded flex items-center justify-center transition-all" :class="selected.some(s => s.utility_id === item.id)
              ? 'bg-blue-600 border-blue-600'
              : 'border-gray-300 hover:border-blue-400'">
            <Check v-if="selected.some(s => s.utility_id === item.id)" class="w-4 h-4 text-white" />
          </button>
          <span>{{ item.utility_type_label }}</span>
        </div>

        <button v-if="selected.some(s => s.utility_id === item.id)" @click="toggleRequired(item.id)"
          class="px-3 py-1 text-sm rounded-full border transition-all" :class="selected.find(s => s.utility_id === item.id)?.is_required
            ? 'bg-blue-100 text-blue-600 border-blue-400'
            : 'bg-gray-100 text-gray-500 border-gray-300 hover:bg-gray-200'">
          {{selected.find(s => s.utility_id === item.id)?.is_required ? 'Bắt buộc' : 'Tùy chọn'}}
        </button>
      </div>
    </div>
  </div>
</template>
