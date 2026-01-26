<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div class="lg:col-span-1">
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3">
          <h4 class="font-semibold text-white flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Danh sách phòng trọ
          </h4>
        </div>

        <div class="max-h-[600px] overflow-y-auto">
          <div v-if="loading" class="p-8 text-center">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-500">
            </div>
            <p class="mt-2 text-gray-600">Đang tải...</p>
          </div>

          <ul v-else class="divide-y divide-gray-100">
            <li v-for="r in rooms" :key="r.id" @click="select(r)"
              class="p-4 cursor-pointer transition-all duration-200 hover:bg-blue-50" :class="{
                'bg-blue-50 border-l-4 border-blue-500': selectedId === r.id,
                'hover:border-l-4 hover:border-blue-200': selectedId !== r.id
              }">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                    {{ r.room_name }}
                    <span v-if="selectedId === r.id"
                      class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500 text-white">
                      <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clip-rule="evenodd" />
                      </svg>
                      Đã chọn
                    </span>
                  </div>
                  <div class="flex items-center gap-2 text-sm text-gray-600">
                    <span
                      class="inline-flex items-center px-2 py-1 rounded-md bg-purple-100 text-purple-700 font-medium">
                      {{ r.room_type_label }}
                    </span>
                    <span class="text-blue-600 font-semibold">
                      {{ formatPrice(r.price) }}
                    </span>
                  </div>
                </div>
                <svg class="w-5 h-5 text-gray-400 transition-transform duration-200"
                  :class="{ 'text-blue-500 transform scale-110': selectedId === r.id }" fill="none"
                  stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </li>
          </ul>

          <!-- Empty state -->
          <div v-if="!loading && rooms.length === 0" class="p-8 text-center text-gray-500">
            <svg class="w-16 h-16 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p>Không có phòng nào</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Chi tiết phòng -->
    <div class="lg:col-span-2">
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-3">
          <h4 class="font-semibold text-white flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Thông tin chi tiết
          </h4>
        </div>

        <div class="p-6">
          <!-- Empty state -->
          <div v-if="!selected" class="text-center py-16">
            <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
              <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-1">Chưa chọn phòng</h3>
            <p class="text-gray-500">Vui lòng chọn một phòng từ danh sách bên trái</p>
          </div>

          <!-- Room details -->
          <div v-else class="space-y-6">
            <!-- Thông tin cơ bản -->
            <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-5 border border-blue-100">
              <h5 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                {{ selected.room_name }}
              </h5>

              <div class="grid grid-cols-2 gap-4">
                <div class="bg-white rounded-lg p-3 shadow-sm">
                  <div class="text-xs text-gray-500 mb-1">Loại phòng</div>
                  <div class="font-semibold text-gray-900">{{ selected.room_type_label }}</div>
                </div>
                <div class="bg-white rounded-lg p-3 shadow-sm">
                  <div class="text-xs text-gray-500 mb-1">Giá thuê</div>
                  <div class="font-bold text-blue-600 text-lg">{{ formatPrice(selected.price) }}</div>
                </div>
              </div>

              <div v-if="selected.description" class="mt-4 bg-white rounded-lg p-3 shadow-sm">
                <div class="text-xs text-gray-500 mb-1">Mô tả</div>
                <p class="text-gray-700 text-sm leading-relaxed">{{ selected.description }}</p>
              </div>
            </div>

            <!-- Vật tư -->
            <div v-if="selected.supplies && selected.supplies.length"
              class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-5 border border-green-100">
              <div class="flex items-center justify-between mb-3">
                <h5 class="font-semibold text-gray-900 flex items-center gap-2">
                  <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  Vật tư mặc định
                </h5>
                <button @click="showEditSupplies = !showEditSupplies"
                  class="text-sm px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
                  {{ showEditSupplies ? 'Xong' : 'Chỉnh sửa' }}
                </button>
              </div>
              
              <div v-if="!showEditSupplies" class="grid grid-cols-2 gap-2">
                <div v-for="s in selectedSupplies" :key="s.id"
                  class="bg-white rounded-lg px-3 py-2 shadow-sm flex items-center gap-2">
                  <div class="w-2 h-2 rounded-full bg-green-500"></div>
                  <span class="text-sm text-gray-700 flex-1">{{ s.name }}</span>
                  <span class="text-xs text-gray-500">x{{ getSupplyQuantity(s.id) }}</span>
                </div>
              </div>

              <div v-else class="space-y-2">
                <div v-for="s in selected.supplies" :key="s.id"
                  class="flex items-center gap-3 bg-white rounded-lg p-3 shadow-sm">
                  <label class="flex items-center gap-2 flex-1">
                    <input type="checkbox" :checked="isSupplySelected(s.id)" 
                      @change="toggleSupply(s.id)"
                      class="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-2 focus:ring-green-500 cursor-pointer" />
                    <span class="text-sm text-gray-700">{{ s.name }}</span>
                  </label>
                  <input v-if="isSupplySelected(s.id)" type="number" :value="getSupplyQuantity(s.id)"
                    @input="(e) => setSupplyQuantity(s.id, Number((e.target as HTMLInputElement).value))"
                    min="1" max="100"
                    class="w-16 px-2 py-1 border border-gray-300 rounded text-sm" />
                </div>
              </div>
            </div>

            <!-- Tiện ích -->
            <div v-if="selected.utilities && selected.utilities.length"
              class="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-5 border border-amber-100">
              <div class="flex items-center justify-between mb-3">
                <h5 class="font-semibold text-gray-900 flex items-center gap-2">
                  <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  Tiện ích đi kèm
                </h5>
                <button @click="showEditUtilities = !showEditUtilities"
                  class="text-sm px-3 py-1 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition">
                  {{ showEditUtilities ? 'Xong' : 'Chỉnh sửa' }}
                </button>
              </div>
              
              <div v-if="!showEditUtilities" class="flex flex-wrap gap-2">
                <span v-for="u in selectedUtilities" :key="u.id"
                  class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-white text-amber-700 shadow-sm border border-amber-200">
                  <svg class="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd" />
                  </svg>
                  {{ u.utility_type_label }}
                </span>
              </div>

              <div v-else class="space-y-2">
                <div v-for="u in selected.utilities" :key="u.id"
                  class="flex items-center gap-3 bg-white rounded-lg p-3 shadow-sm"
                  :class="{ 'bg-amber-50 border border-amber-200': u.is_required }">
                  <input type="checkbox" :checked="isUtilitySelected(u.id)" 
                    @change="toggleUtility(u.id)"
                    :disabled="u.is_required"
                    class="w-4 h-4 rounded border-gray-300 text-amber-600 focus:ring-2 focus:ring-amber-500 disabled:cursor-not-allowed disabled:opacity-50" />
                  <span class="text-sm text-gray-700 flex-1">{{ u.utility_type_label }}</span>
                  <span v-if="u.is_required" class="text-xs font-semibold px-2 py-1 bg-amber-200 text-amber-800 rounded-full">
                    Bắt buộc
                  </span>
                </div>
              </div>
            </div>

            <!-- Nút Tiếp tục -->
            <div class="flex justify-end gap-3 mt-6">
              <button
                @click="handleNext"
                :disabled="!selected || isInitializing"
                class="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                <span v-if="isInitializing" class="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                {{ isInitializing ? 'Đang xử lý...' : 'Tiếp tục' }}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import getAvailableRoomService from '@/services/admin/room/getAvailableRoomService'
import step0Service, { type Step0Supply, type Step0Utility } from '@/services/admin/contract_wizard/step0Service'
import { toastSuccess, toastError } from '@/helpers/toast'

const props = defineProps<{ selectedRoomId?: number | null }>()
const emit = defineEmits<{
  (e: 'selected', room: any | null): void
  (e: 'initialized', data: { draft_id: number; selectedSupplyIds: number[]; selectedUtilityIds: number[] }): void
}>()

const rooms = ref<any[]>([])
const loading = ref(false)
const isInitializing = ref(false)
const selected = ref<any | null>(null)
const selectedId = ref<number | null>(null)
const showEditSupplies = ref(false)
const showEditUtilities = ref(false)

// Track selected supplies and utilities with quantities
const selectedSupplyIds = ref<Set<number>>(new Set())
const selectedUtilityIds = ref<Set<number>>(new Set())
const supplyQuantities = ref<Map<number, number>>(new Map())

const formatPrice = (price: any) => {
  if (!price) return '0đ'
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
}

// Computed: Get selected supplies with their data
const selectedSupplies = computed(() => {
  if (!selected.value) return []
  return selected.value.supplies.filter((s: any) => selectedSupplyIds.value.has(s.id))
})

// Computed: Get selected utilities with their data
const selectedUtilities = computed(() => {
  if (!selected.value) return []
  return selected.value.utilities.filter((u: any) => selectedUtilityIds.value.has(u.id))
})

async function load() {
  loading.value = true
  try {
    const res = await getAvailableRoomService()
    rooms.value = res.rooms || []
    if (props.selectedRoomId) {
      const pre = rooms.value.find(r => r.id === props.selectedRoomId)
      if (pre) select(pre)
    }
  } catch (error) {
    console.error('Lỗi khi tải danh sách phòng:', error)
    toastError('Lỗi khi tải danh sách phòng')
  } finally {
    loading.value = false
  }
}

function select(r: any) {
  selected.value = r
  selectedId.value = r.id
  showEditSupplies.value = false
  showEditUtilities.value = false
  
  // Initialize selected items with defaults (all items selected)
  selectedSupplyIds.value = new Set((r.supplies || []).map((s: any) => s.id))
  selectedUtilityIds.value = new Set((r.utilities || []).map((u: any) => u.id))
  supplyQuantities.value = new Map((r.supplies || []).map((s: any) => [s.id, 1]))
  
  emit('selected', r)
}

function isSupplySelected(supplyId: number): boolean {
  return selectedSupplyIds.value.has(supplyId)
}

function toggleSupply(supplyId: number) {
  if (selectedSupplyIds.value.has(supplyId)) {
    selectedSupplyIds.value.delete(supplyId)
    supplyQuantities.value.delete(supplyId)
  } else {
    selectedSupplyIds.value.add(supplyId)
    supplyQuantities.value.set(supplyId, 1)
  }
}

function getSupplyQuantity(supplyId: number): number {
  return supplyQuantities.value.get(supplyId) || 1
}

function setSupplyQuantity(supplyId: number, quantity: number) {
  supplyQuantities.value.set(supplyId, Math.max(1, quantity))
}

function isUtilitySelected(utilityId: number): boolean {
  return selectedUtilityIds.value.has(utilityId)
}

function toggleUtility(utilityId: number) {
  const utility = selected.value?.utilities?.find((u: any) => u.id === utilityId)
  
  // Không cho phép bỏ tick các tiện ích bắt buộc
  if (utility?.is_required && selectedUtilityIds.value.has(utilityId)) {
    return
  }
  
  if (selectedUtilityIds.value.has(utilityId)) {
    selectedUtilityIds.value.delete(utilityId)
  } else {
    selectedUtilityIds.value.add(utilityId)
  }
}

async function handleNext() {
  if (!selected.value) return

  isInitializing.value = true
  try {
    // Chuẩn bị dữ liệu
    const supplyData: Step0Supply[] = Array.from(selectedSupplyIds.value).map(supplyId => {
      const quantity = supplyQuantities.value.get(supplyId) || 1
      return { supply_id: supplyId, quantity }
    })

    const utilityData: Step0Utility[] = Array.from(selectedUtilityIds.value).map(utilityId => ({
      utility_id: utilityId
    }))

    console.log('📤 Gửi step0Service với:', {
      room_id: selected.value.id,
      supplies: supplyData,
      utilities: utilityData
    })

    // Gửi API
    const response = await step0Service({
      room_id: selected.value.id,
      supplies: supplyData,
      utilities: utilityData
    })

    console.log('📥 Response từ step0Service:', response)

    // Phát sự kiện cho component cha
    const draftId = response?.data?.draft_id
    console.log('📌 Draft ID:', draftId)

    if (!draftId) {
      throw new Error('Không nhận được draft_id từ API')
    }

    // Truyền selected supplies và utilities để parent có thể lưu
    const selectedSupplyIdsList = Array.from(selectedSupplyIds.value)
    const selectedUtilityIdsList = Array.from(selectedUtilityIds.value)

    console.log('📌 Selected Supplies:', selectedSupplyIdsList)
    console.log('📌 Selected Utilities:', selectedUtilityIdsList)

    emit('initialized', {
      draft_id: draftId,
      selectedSupplyIds: selectedSupplyIdsList,
      selectedUtilityIds: selectedUtilityIdsList
    })

  } catch (error) {
    console.error('❌ Lỗi khi khởi tạo phòng:', error)
    toastError('Lỗi khi khởi tạo phòng: ' + (error instanceof Error ? error.message : String(error)))
  } finally {
    isInitializing.value = false
  }
}

onMounted(load)
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer
}
</style>
