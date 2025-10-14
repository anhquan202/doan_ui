<template>
  <div class="min-h-screen bg-gray-50">
    <Header @toggleSidebar="toggleSidebar" />
    <Sidebar :isOpen="isSidebarOpen" @toggleSidebar="toggleSidebar" />
    <main class="pt-16 lg:pl-64">
      <div class="p-6">
        <RouterView />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Header from './Header.vue'
import Sidebar from './Sidebar.vue'

const isSidebarOpen = ref(false)
const toggleSidebar = () => (isSidebarOpen.value = !isSidebarOpen.value)
</script>
