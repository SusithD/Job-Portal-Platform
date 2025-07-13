<template>
  <header class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <div class="flex items-center">
          <NuxtLink to="/" class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-sm">JP</span>
            </div>
            <span class="text-xl font-bold text-gray-900">JobPortal</span>
          </NuxtLink>
        </div>

        <!-- User Menu -->
        <div class="flex items-center space-x-4">
          <div class="relative" ref="dropdownRef">
            <button
              @click="showDropdown = !showDropdown"
              class="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <div class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span class="text-primary-700 font-medium text-sm">
                  {{ user?.name?.charAt(0).toUpperCase() }}
                </span>
              </div>
              <span class="hidden md:block text-sm font-medium">{{ user?.name }}</span>
              <ChevronDownIcon class="w-4 h-4" />
            </button>
            
            <div
              v-if="showDropdown"
              class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
            >
              <NuxtLink
                to="/profile"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Profile Settings
              </NuxtLink>
              <button
                @click="logout"
                class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ChevronDownIcon } from '@heroicons/vue/24/outline'

const { user, logout } = useAuth()
const showDropdown = ref(false)
const dropdownRef = ref(null)

onClickOutside(dropdownRef, () => {
  showDropdown.value = false
})
</script>