<template>
  <div class="min-h-screen bg-gray-50">
    <DashboardHeader />
    <div class="flex">
      <DashboardSidebar />
      <main class="flex-1 p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})
</script>