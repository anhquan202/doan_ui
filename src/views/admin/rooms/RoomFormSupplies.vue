<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { Check } from 'lucide-vue-next'
import getListSuppliesService from '@/services/admin/supplies/getListSuppliesService'

const props = defineProps<{ modelValue: { supply_id: number; quantity: number }[] }>()
const emit = defineEmits(['update:modelValue'])

const supplies = ref<any[]>([])
const selectedSupplies = ref<{ supply_id: number; name: string; quantity: number }[]>([])

onMounted(async () => {
  supplies.value = await getListSuppliesService()
  selectedSupplies.value = props.modelValue.map(item => {
    const found = supplies.value.find((s: any) => s.id === item.supply_id)
    return { ...item, name: found?.name || '' }
  })
})

watch(selectedSupplies, (val) => {
  emit('update:modelValue', val.map(({ supply_id, quantity }) => ({ supply_id, quantity })))
}, { deep: true })

const toggleSupply = (id: number) => {
  const existing = selectedSupplies.value.find(s => s.supply_id === id)
  if (existing) selectedSupplies.value = selectedSupplies.value.filter(s => s.supply_id !== id)
  else {
    const found = supplies.value.find(s => s.id === id)
    if (found) selectedSupplies.value.push({ supply_id: id, name: found.name, quantity: 1 })
  }
}

const updateQuantity = (id: number, qty: number) => {
  selectedSupplies.value = selectedSupplies.value.map(s =>
    s.supply_id === id ? { ...s, quantity: Math.max(1, qty) } : s
  )
}
</script>

<template>
  <div>
    <div class="space-y-2">
      <div v-for="item in supplies" :key="item.id"
        class="flex items-center justify-between p-3 rounded-xl border border-slate-300 hover:border-blue-400 transition-all">
        <div class="flex items-center gap-3">
          <button type="button" @click="toggleSupply(item.id)"
            class="w-6 h-6 border-2 rounded flex items-center justify-center transition-all" :class="selectedSupplies.some(s => s.supply_id === item.id)
              ? 'bg-blue-600 border-blue-600'
              : 'border-gray-300 hover:border-blue-400'">
            <Check v-if="selectedSupplies.some(s => s.supply_id === item.id)" class="w-4 h-4 text-white" />
          </button>
          <span>{{ item.name }}</span>
        </div>

        <div v-if="selectedSupplies.some(s => s.supply_id === item.id)" class="flex items-center gap-2">
          <span class="text-sm text-gray-500">Số lượng:</span>
          <input type="number" min="1"
            class="w-20 border rounded-xl px-3 py-2 text-center hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            :value="selectedSupplies.find(s => s.supply_id === item.id)?.quantity"
            @input="updateQuantity(item.id, +($event.target as HTMLInputElement).value)" />
        </div>
      </div>
    </div>
  </div>
</template>
