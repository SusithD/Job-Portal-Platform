<template>
  <aside class="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
    <nav class="p-6">
      <ul class="space-y-2">
        <li v-for="item in navigationItems" :key="item.name">
          <NuxtLink
            :to="item.href"
            class="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            :class="{ 'bg-primary-50 text-primary-700': $route.path === item.href }"
          >
            <component :is="item.icon" class="w-5 h-5" />
            <span class="font-medium">{{ item.name }}</span>
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup>
import {
  HomeIcon,
  BriefcaseIcon,
  UsersIcon,
  DocumentTextIcon,
  CogIcon,
  ChartBarIcon
} from '@heroicons/vue/24/outline'

const { user } = useAuth()

const navigationItems = computed(() => {
  const baseItems = [
    { name: 'Dashboard', href: `/${user.value?.role}/dashboard`, icon: HomeIcon }
  ]

  if (user.value?.role === 'company') {
    return [
      ...baseItems,
      { name: 'Jobs', href: '/company/jobs', icon: BriefcaseIcon },
      { name: 'Applications', href: '/company/applications', icon: DocumentTextIcon },
      { name: 'Analytics', href: '/company/analytics', icon: ChartBarIcon },
      { name: 'Settings', href: '/company/settings', icon: CogIcon }
    ]
  } else if (user.value?.role === 'candidate') {
    return [
      ...baseItems,
      { name: 'My Applications', href: '/candidate/applications', icon: DocumentTextIcon },
      { name: 'Saved Jobs', href: '/candidate/saved', icon: BriefcaseIcon },
      { name: 'Profile', href: '/candidate/profile', icon: UsersIcon },
      { name: 'Settings', href: '/candidate/settings', icon: CogIcon }
    ]
  } else if (user.value?.role === 'admin') {
    return [
      ...baseItems,
      { name: 'Companies', href: '/admin/companies', icon: BriefcaseIcon },
      { name: 'Candidates', href: '/admin/candidates', icon: UsersIcon },
      { name: 'Jobs', href: '/admin/jobs', icon: DocumentTextIcon },
      { name: 'Analytics', href: '/admin/analytics', icon: ChartBarIcon },
      { name: 'Settings', href: '/admin/settings', icon: CogIcon }
    ]
  }

  return baseItems
})
</script>