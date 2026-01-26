<template>
  <header class="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50">
    <div class="flex items-center justify-between h-full px-4">
      <!-- Logo -->
      <div class="flex items-center gap-2">
        <button @click="$emit('toggleSidebar')" class="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
          <Menu :size="20" />
        </button>
        <div class="flex items-center gap-2">
          <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Home class="text-white" :size="24" />
          </div>
          <span class="text-xl font-bold text-gray-800">PhòngTrọ.vn</span>
        </div>
      </div>

      <!-- Avatar + Dropdown -->
      <div class="relative" @mouseenter="cancelHide" @mouseleave="startHide">
        <!-- Avatar button -->
        <button @click="toggleDropdown"
          class="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <div class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
            {{ userInitial }}
          </div>
          <ChevronDown :size="16" class="text-gray-600" />
        </button>

        <!-- Dropdown -->
        <transition enter-active-class="transition ease-out duration-100"
          enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
          leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100"
          leave-to-class="transform opacity-0 scale-95">
          <div v-show="showDropdown"
            class="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
            <div class="px-4 py-3 border-b border-gray-200">
              <p class="text-sm font-semibold text-gray-800">{{ userName }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ userEmail }}</p>
              <span class="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                {{ userRole }}
              </span>
            </div>

            <div class="py-1">
              <button @click="handleInfo"
                class="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                <User :size="16" />
                <span>Thông tin cá nhân</span>
              </button>
              <button @click="handleLogout"
                class="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                <LogOut :size="16" />
                <span>Đăng xuất</span>
              </button>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { Menu, Home, ChevronDown, User, LogOut } from "lucide-vue-next"
import { sessionStorageHelper } from '@/helpers/sessionStorageHelper'

const userName = ref("")
const userEmail = ref("")
const userRole = ref("Quản trị viên")
const userInitial = ref("")
const showDropdown = ref(false)
let hideTimeout = null

onMounted(() => {
  const user = sessionStorageHelper.getUser()
  if (user) {
    const fullName = `${user.first_name} ${user.last_name}`.trim()
    userName.value = fullName
    userEmail.value = user.email
    userInitial.value = fullName.charAt(0).toUpperCase()
  }
})

const toggleDropdown = () => (showDropdown.value = !showDropdown.value)

const startHide = () => {
  hideTimeout = setTimeout(() => (showDropdown.value = false), 200)
}

const cancelHide = () => {
  if (hideTimeout) clearTimeout(hideTimeout)
  showDropdown.value = true
}

const handleInfo = () => console.log("Thông tin cá nhân")
const handleLogout = () => console.log("Đăng xuất")
</script>
