<template>
  <nav class="flex items-center space-x-2 text-sm mb-6" aria-label="Breadcrumb">
    <ol class="flex items-center space-x-2">
      <li>
        <router-link to="/" class="text-blue-600 hover:text-blue-800 hover:underline transition">
          <Home :size="18" class="inline" />
        </router-link>
      </li>

      <li v-for="(breadcrumb, index) in breadcrumbs" :key="index" class="flex items-center space-x-2">
        <ChevronRight :size="16" class="text-gray-400" />
        <router-link v-if="breadcrumb.to && index !== breadcrumbs.length - 1" :to="breadcrumb.to"
          class="text-blue-600 hover:text-blue-800 hover:underline transition">
          {{ breadcrumb.label }}
        </router-link>
        <span v-else class="text-gray-700">{{ breadcrumb.label }}</span>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Home, ChevronRight } from 'lucide-vue-next'

interface Breadcrumb {
  label: string
  to?: string
}

const route = useRoute()

const breadcrumbs = computed<Breadcrumb[]>(() => {
  const crumbs: Breadcrumb[] = []

  // Sử dụng breadcrumbs từ route meta nếu có
  if (route.meta?.breadcrumbs) {
    const metaBreadcrumbs = route.meta.breadcrumbs as Breadcrumb[]
    return metaBreadcrumbs
  }

  // Tạo breadcrumbs từ path nếu không có trong meta
  const pathSegments = route.path.split('/').filter(Boolean)

  pathSegments.forEach((segment, index) => {
    const label = formatLabel(segment)

    // Bỏ qua nếu label trống (ví dụ: ID hoặc path parameter)
    if (!label) {
      return
    }

    const path = '/' + pathSegments.slice(0, index + 1).join('/')

    // Không thêm breadcrumb cho segment cuối cùng (current page)
    if (index < pathSegments.length - 1) {
      crumbs.push({
        label,
        to: path,
      })
    } else {
      crumbs.push({
        label,
      })
    }
  })

  return crumbs
})

const breadcrumbLabels: Record<string, string> = {
  // Routes chính
  rooms: 'Phòng',
  'rooms-create': 'Tạo phòng',
  'rooms-edit': 'Sửa phòng',
  supplies: 'Vật tư',
  contracts: 'Hợp đồng',
  'contracts-create': 'Tạo hợp đồng',
  'contracts-edit': 'Sửa hợp đồng',
  customers: 'Khách hàng',
  'customers-edit': 'Sửa khách hàng',
  'meter-readings': 'Chỉ số công tơ',
  vehicles: 'Phương tiện',
  utilities: 'Tiện ích',
  about: 'Giới thiệu',
  home: 'Trang chủ',
}

const formatLabel = (segment: string): string => {
  // Loại bỏ ID từ URL (ví dụ: ":id" hoặc các ID số)
  if (segment.startsWith(':') || /^\d+$/.test(segment)) {
    return ''
  }

  // Kiểm tra xem segment có trong breadcrumbLabels không
  if (breadcrumbLabels[segment]) {
    return breadcrumbLabels[segment]
  }

  // Fallback: format từ segment (chuyển kebab-case thành Title Case)
  return segment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
</script>

<style scoped>
nav {
  animation: slideDown 0.3s ease-in-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
