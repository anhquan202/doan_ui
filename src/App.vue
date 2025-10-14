<template>
  <router-view v-slot="{ Component, route }">
    <DefaultLayout v-if="route.meta.requiresAuth">
      <component :is="Component" />
    </DefaultLayout>

    <component v-else :is="Component" />
  </router-view>
</template>

<script setup>
import DefaultLayout from './layout/DefaultLayout.vue';
</script>
