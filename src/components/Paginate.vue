<script setup lang="ts">
import { computed } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
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
const totalItems = computed(() => props.meta?.total ?? 0)
const perPage = computed(() => props.meta?.per_page ?? 10)

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
  <div v-if="meta && totalPages > 1" class="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
    <!-- Pagination buttons -->
    <div class="flex items-center gap-1">
      <!-- Previous button -->
      <button :disabled="current === 1" @click="changePage(current - 1)"
        class="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        :class="{ 'hover:bg-gray-50': current !== 1 }">
        <ChevronLeft :size="16" />
        <span class="hidden sm:inline">Trước</span>
      </button>

      <!-- Page numbers -->
      <div class="flex items-center gap-1">
        <template v-for="p in pagesToShow" :key="p + '-' + (meta?.total_pages || 0)">
          <button v-if="p !== -1" @click="changePage(p)" :class="[
            'min-w-[40px] px-3 py-2 text-sm font-medium rounded-lg border transition-colors',
            p === current
              ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          ]">
            {{ p }}
          </button>
          <span v-else class="px-2 text-gray-500">…</span>
        </template>
      </div>

      <!-- Next button -->
      <button :disabled="current === totalPages" @click="changePage(current + 1)"
        class="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        :class="{ 'hover:bg-gray-50': current !== totalPages }">
        <span class="hidden sm:inline">Sau</span>
        <ChevronRight :size="16" />
      </button>
    </div>
  </div>
</template>