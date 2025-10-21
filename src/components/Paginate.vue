<script setup lang="ts">
import { computed } from 'vue'
import type { Meta } from '@/services/admin/room/showService'

const props = defineProps<{
  meta: Meta | null
  currentPage: number
}>()

const emits = defineEmits<{
  (e: 'change-page', page: number): void
}>()

const totalPages = computed(() => props.meta?.total_pages ?? 0)
const current = computed(() => props.currentPage ?? 1)

const pagesToShow = computed(() => {
  const total = totalPages.value
  const curr = current.value
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const pages: number[] = []
  const left = Math.max(2, curr - 1)
  const right = Math.min(total - 1, curr + 1)

  pages.push(1)
  if (left > 2) pages.push(-1) // -1 as ellipsis

  for (let p = left; p <= right; p++) pages.push(p)

  if (right < total - 1) pages.push(-1)
  pages.push(total)

  return pages
})

const changePage = (page: number) => {
  if (page < 1 || page > totalPages.value || page === current.value) return
  emits('change-page', page)
}

</script>

<template>
  <div v-if="meta && totalPages > 1" class="inline-flex items-center gap-2">
    <button :disabled="current === 1" @click="changePage(current - 1)"
      class="px-3 py-1 rounded-md border hover:bg-gray-100 disabled:opacity-50">
      Prev
    </button>

    <template v-for="p in pagesToShow" :key="p + '-' + (meta?.total_pages || 0)">
      <button v-if="p !== -1" @click="changePage(p)"
        :class="['px-3 py-1 rounded-md border', p === current ? 'bg-primary text-white' : 'hover:bg-gray-100']">
        {{ p }}
      </button>
      <span v-else class="px-2">…</span>
    </template>

    <button :disabled="current === totalPages" @click="changePage(current + 1)"
      class="px-3 py-1 rounded-md border hover:bg-gray-100 disabled:opacity-50">
      Next
    </button>
  </div>
</template>

<style scoped>
.bg-primary {
  background-color: #2563eb;
}
</style>
