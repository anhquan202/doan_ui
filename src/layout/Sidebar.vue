<template>
  <aside :class="[
    'fixed top-16 left-0 bottom-0 w-64 bg-white border-r border-gray-200 transition-transform duration-300 z-40',
    isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
  ]">
    <nav class="p-4 space-y-1">
      <template v-for="item in menuItems" :key="item.id">
        <!-- Menu đơn -->
        <RouterLink v-if="!item.children" :to="item.link"
          class="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg"
          active-class="bg-blue-50 text-blue-600">
          <component :is="item.icon" :size="20" />
          <span class="font-medium">{{ item.label }}</span>
        </RouterLink>

        <!-- Menu có submenu -->
        <div v-else>
          <button @click="toggleMenu(item.id)"
            class="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg">
            <div class="flex items-center gap-3">
              <component :is="item.icon" :size="20" />
              <span class="font-medium">{{ item.label }}</span>
            </div>
            <ChevronDown :size="16" :class="['transition-transform', openMenus[item.id] && 'rotate-180']" />
          </button>

          <Transition name="fade">
            <div v-if="openMenus[item.id]" class="ml-4 mt-1 space-y-1">
              <RouterLink v-for="child in item.children" :key="child.id" :to="child.link"
                class="block text-sm text-gray-600 px-4 py-2 hover:bg-gray-100 rounded-lg"
                active-class="bg-gray-100 text-blue-600">
                {{ child.label }}
              </RouterLink>
            </div>
          </Transition>
        </div>
      </template>
    </nav>
  </aside>

  <!-- Overlay -->
  <Transition name="fade">
    <div v-if="isOpen" @click="$emit('toggleSidebar')" class="fixed inset-0 bg-black/50 z-30 lg:hidden"></div>
  </Transition>
</template>

<script setup>
import { ref } from 'vue'
import { Building2, ChevronDown, FileText, Users } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
import { APP_URL } from '@/constants/appUrl'

const props = defineProps({ isOpen: Boolean })
const emit = defineEmits(['toggleSidebar'])

const menuItems = ref([
  {
    id: 'rooms',
    label: 'Quản lý phòng trọ',
    icon: Building2,
    link: APP_URL.ROOM
  },
  {
    id: 'users',
    label: 'Quản lý con người',
    icon: Users,
    children: [
      { id: 'user-list', label: 'Danh sách khách thuê', link: '/users' }
    ]
  },
  {
    id: 'invoice',
    label: 'Hóa đơn',
    icon: FileText,
    link: '/invoice'
  }
])

const openMenus = ref({})
const toggleMenu = (menu) => {
  openMenus.value[menu] = !openMenus.value[menu]
}
</script>
