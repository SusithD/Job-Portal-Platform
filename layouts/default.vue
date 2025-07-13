<template>
  <div class="min-h-screen bg-gray-50">
    <NavHeader />
    <main>
      <slot />
    </main>
    <Footer />
  </div>
</template>

<script setup>
const { $auth } = useNuxtApp()
</script>