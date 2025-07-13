<template>
  <div>
    <!-- Welcome Section -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Welcome back, {{ user?.name }}!</h1>
      <p class="text-gray-600">Here's your job search overview</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div v-for="stat in stats" :key="stat.title" class="card p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-lg" :class="stat.colorClass">
            <component :is="stat.icon" class="w-6 h-6 text-white" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">{{ stat.title }}</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stat.value }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Applications -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div class="card p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold text-gray-900">Recent Applications</h2>
          <NuxtLink to="/candidate/applications" class="text-primary-600 hover:text-primary-700 text-sm font-medium">
            View All
          </NuxtLink>
        </div>

        <div class="space-y-4">
          <div v-for="application in recentApplications" :key="application.id" class="border-b border-gray-200 pb-4 last:border-b-0">
            <div class="flex items-start justify-between">
              <div>
                <h3 class="font-medium text-gray-900">{{ application.jobTitle }}</h3>
                <p class="text-sm text-gray-600">{{ application.company }}</p>
                <p class="text-xs text-gray-500 mt-1">Applied {{ application.appliedDate }}</p>
              </div>
              <span
                class="px-2 py-1 text-xs font-medium rounded-full"
                :class="getStatusClass(application.status)"
              >
                {{ application.status }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Recommended Jobs -->
      <div class="card p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold text-gray-900">Recommended Jobs</h2>
          <NuxtLink to="/jobs" class="text-primary-600 hover:text-primary-700 text-sm font-medium">
            Browse All
          </NuxtLink>
        </div>

        <div class="space-y-4">
          <div v-for="job in recommendedJobs" :key="job.id" class="border-b border-gray-200 pb-4 last:border-b-0">
            <div class="flex items-start justify-between">
              <div>
                <h3 class="font-medium text-gray-900 hover:text-primary-600 cursor-pointer">
                  {{ job.title }}
                </h3>
                <p class="text-sm text-gray-600">{{ job.company }}</p>
                <p class="text-xs text-gray-500 mt-1">{{ job.location }} • {{ job.posted }}</p>
              </div>
              <button class="btn btn-outline text-xs px-3 py-1">
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Profile Completion -->
    <div class="mt-8">
      <div class="card p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900">Profile Completion</h2>
          <span class="text-sm text-gray-600">{{ profileCompletion }}% complete</span>
        </div>
        
        <div class="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            class="bg-primary-600 h-2 rounded-full transition-all duration-300"
            :style="{ width: `${profileCompletion}%` }"
          ></div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="item in profileItems" :key="item.title" class="flex items-center justify-between">
            <div class="flex items-center">
              <CheckCircleIcon
                v-if="item.completed"
                class="w-5 h-5 text-green-500 mr-2"
              />
              <XCircleIcon
                v-else
                class="w-5 h-5 text-gray-300 mr-2"
              />
              <span class="text-sm" :class="item.completed ? 'text-gray-900' : 'text-gray-500'">
                {{ item.title }}
              </span>
            </div>
            <NuxtLink
              v-if="!item.completed"
              :to="item.link"
              class="text-primary-600 hover:text-primary-700 text-xs font-medium"
            >
              Complete
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  DocumentTextIcon,
  EyeIcon,
  HeartIcon,
  BriefcaseIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

const { user } = useAuth()

const stats = [
  {
    title: 'Applications',
    value: '12',
    icon: DocumentTextIcon,
    colorClass: 'bg-primary-600'
  },
  {
    title: 'Profile Views',
    value: '48',
    icon: EyeIcon,
    colorClass: 'bg-green-600'
  },
  {
    title: 'Saved Jobs',
    value: '7',
    icon: HeartIcon,
    colorClass: 'bg-yellow-600'
  },
  {
    title: 'Interviews',
    value: '3',
    icon: BriefcaseIcon,
    colorClass: 'bg-blue-600'
  }
]

const recentApplications = ref([
  {
    id: 1,
    jobTitle: 'Senior Frontend Developer',
    company: 'TechCorp Inc.',
    status: 'In Review',
    appliedDate: '2 days ago'
  },
  {
    id: 2,
    jobTitle: 'Product Manager',
    company: 'InnovateLab',
    status: 'Shortlisted',
    appliedDate: '5 days ago'
  },
  {
    id: 3,
    jobTitle: 'UX Designer',
    company: 'DesignStudio',
    status: 'Applied',
    appliedDate: '1 week ago'
  }
])

const recommendedJobs = ref([
  {
    id: 1,
    title: 'Full Stack Developer',
    company: 'StartupXYZ',
    location: 'Remote',
    posted: '1 day ago'
  },
  {
    id: 2,
    title: 'React Developer',
    company: 'WebFlow Inc.',
    location: 'San Francisco, CA',
    posted: '3 days ago'
  },
  {
    id: 3,
    title: 'JavaScript Engineer',
    company: 'CodeCraft',
    location: 'New York, NY',
    posted: '5 days ago'
  }
])

const profileItems = ref([
  { title: 'Basic Information', completed: true, link: '/candidate/profile' },
  { title: 'Resume Upload', completed: true, link: '/candidate/profile' },
  { title: 'Skills & Expertise', completed: false, link: '/candidate/profile' },
  { title: 'Work Experience', completed: false, link: '/candidate/profile' },
  { title: 'Education', completed: true, link: '/candidate/profile' },
  { title: 'Portfolio', completed: false, link: '/candidate/profile' }
])

const profileCompletion = computed(() => {
  const completedItems = profileItems.value.filter(item => item.completed).length
  return Math.round((completedItems / profileItems.value.length) * 100)
})

function getStatusClass(status) {
  switch (status.toLowerCase()) {
    case 'applied':
      return 'bg-blue-100 text-blue-800'
    case 'in review':
      return 'bg-yellow-100 text-yellow-800'
    case 'shortlisted':
      return 'bg-green-100 text-green-800'
    case 'rejected':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

useSeoMeta({
  title: 'Dashboard - JobPortal',
  description: 'Your job search dashboard'
})
</script>