<template>
  <div>
    <!-- Welcome Section -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Welcome back, {{ user?.name }}!</h1>
      <p class="text-gray-600">Here's your hiring overview</p>
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

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <div class="card p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div class="grid grid-cols-2 gap-4">
          <NuxtLink to="/company/jobs/new" class="btn btn-primary">
            <PlusIcon class="w-4 h-4 mr-2" />
            Post New Job
          </NuxtLink>
          <NuxtLink to="/company/applications" class="btn btn-outline">
            <DocumentTextIcon class="w-4 h-4 mr-2" />
            View Applications
          </NuxtLink>
          <NuxtLink to="/company/analytics" class="btn btn-outline">
            <ChartBarIcon class="w-4 h-4 mr-2" />
            View Analytics
          </NuxtLink>
          <NuxtLink to="/company/settings" class="btn btn-outline">
            <CogIcon class="w-4 h-4 mr-2" />
            Company Settings
          </NuxtLink>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="card p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div class="space-y-3">
          <div v-for="activity in recentActivity" :key="activity.id" class="flex items-start space-x-3">
            <div class="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
            <div>
              <p class="text-sm text-gray-900">{{ activity.message }}</p>
              <p class="text-xs text-gray-500">{{ activity.time }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Active Jobs and Applications -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Active Jobs -->
      <div class="card p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold text-gray-900">Active Jobs</h2>
          <NuxtLink to="/company/jobs" class="text-primary-600 hover:text-primary-700 text-sm font-medium">
            View All
          </NuxtLink>
        </div>

        <div class="space-y-4">
          <div v-for="job in activeJobs" :key="job.id" class="border-b border-gray-200 pb-4 last:border-b-0">
            <div class="flex items-start justify-between">
              <div>
                <h3 class="font-medium text-gray-900">{{ job.title }}</h3>
                <p class="text-sm text-gray-600">{{ job.location }} • {{ job.type }}</p>
                <p class="text-xs text-gray-500 mt-1">Posted {{ job.posted }}</p>
              </div>
              <div class="text-right">
                <span class="text-sm font-medium text-primary-600">{{ job.applications }} applications</span>
                <p class="text-xs text-gray-500">{{ job.views }} views</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Applications -->
      <div class="card p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold text-gray-900">Recent Applications</h2>
          <NuxtLink to="/company/applications" class="text-primary-600 hover:text-primary-700 text-sm font-medium">
            View All
          </NuxtLink>
        </div>

        <div class="space-y-4">
          <div v-for="application in recentApplications" :key="application.id" class="border-b border-gray-200 pb-4 last:border-b-0">
            <div class="flex items-start justify-between">
              <div class="flex items-start space-x-3">
                <div class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <span class="text-xs font-medium text-gray-600">
                    {{ application.candidate.charAt(0) }}
                  </span>
                </div>
                <div>
                  <h3 class="font-medium text-gray-900">{{ application.candidate }}</h3>
                  <p class="text-sm text-gray-600">{{ application.jobTitle }}</p>
                  <p class="text-xs text-gray-500 mt-1">Applied {{ application.appliedDate }}</p>
                </div>
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
    </div>

    <!-- Hiring Pipeline -->
    <div class="mt-8">
      <div class="card p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-6">Hiring Pipeline</h2>
        <div class="grid grid-cols-5 gap-4">
          <div v-for="stage in hiringPipeline" :key="stage.name" class="text-center">
            <div class="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-2 flex items-center justify-center">
              <span class="text-2xl font-bold text-gray-600">{{ stage.count }}</span>
            </div>
            <h3 class="font-medium text-gray-900 text-sm">{{ stage.name }}</h3>
            <p class="text-xs text-gray-500">{{ stage.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  BriefcaseIcon,
  UsersIcon,
  EyeIcon,
  CheckCircleIcon,
  PlusIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CogIcon
} from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

const { user } = useAuth()

const stats = [
  {
    title: 'Active Jobs',
    value: '8',
    icon: BriefcaseIcon,
    colorClass: 'bg-primary-600'
  },
  {
    title: 'Total Applications',
    value: '156',
    icon: UsersIcon,
    colorClass: 'bg-green-600'
  },
  {
    title: 'Profile Views',
    value: '2.4K',
    icon: EyeIcon,
    colorClass: 'bg-blue-600'
  },
  {
    title: 'Hired',
    value: '12',
    icon: CheckCircleIcon,
    colorClass: 'bg-purple-600'
  }
]

const recentActivity = ref([
  {
    id: 1,
    message: 'New application received for Senior Frontend Developer',
    time: '2 hours ago'
  },
  {
    id: 2,
    message: 'Job posting "Product Manager" was published',
    time: '1 day ago'
  },
  {
    id: 3,
    message: 'Interview scheduled with John Smith',
    time: '2 days ago'
  },
  {
    id: 4,
    message: 'Candidate Sarah Johnson was hired',
    time: '3 days ago'
  }
])

const activeJobs = ref([
  {
    id: 1,
    title: 'Senior Frontend Developer',
    location: 'San Francisco, CA',
    type: 'Full-time',
    posted: '2 days ago',
    applications: 24,
    views: 156
  },
  {
    id: 2,
    title: 'Product Manager',
    location: 'Remote',
    type: 'Full-time',
    posted: '1 week ago',
    applications: 18,
    views: 89
  },
  {
    id: 3,
    title: 'UX Designer',
    location: 'New York, NY',
    type: 'Contract',
    posted: '3 days ago',
    applications: 12,
    views: 67
  }
])

const recentApplications = ref([
  {
    id: 1,
    candidate: 'Alice Johnson',
    jobTitle: 'Senior Frontend Developer',
    status: 'New',
    appliedDate: '2 hours ago'
  },
  {
    id: 2,
    candidate: 'Bob Smith',
    jobTitle: 'Product Manager',
    status: 'Reviewed',
    appliedDate: '1 day ago'
  },
  {
    id: 3,
    candidate: 'Carol Davis',
    jobTitle: 'UX Designer',
    status: 'Interview',
    appliedDate: '2 days ago'
  }
])

const hiringPipeline = ref([
  {
    name: 'Applied',
    count: 45,
    description: 'New applications'
  },
  {
    name: 'Screening',
    count: 18,
    description: 'Under review'
  },
  {
    name: 'Interview',
    count: 8,
    description: 'Scheduled interviews'
  },
  {
    name: 'Offer',
    count: 3,
    description: 'Pending offers'
  },
  {
    name: 'Hired',
    count: 2,
    description: 'Successfully hired'
  }
])

function getStatusClass(status) {
  switch (status.toLowerCase()) {
    case 'new':
      return 'bg-blue-100 text-blue-800'
    case 'reviewed':
      return 'bg-yellow-100 text-yellow-800'
    case 'interview':
      return 'bg-purple-100 text-purple-800'
    case 'hired':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

useSeoMeta({
  title: 'Company Dashboard - JobPortal',
  description: 'Manage your job postings and applications'
})
</script>