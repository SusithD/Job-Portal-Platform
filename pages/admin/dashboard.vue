<template>
  <div>
    <!-- Welcome Section -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
      <p class="text-gray-600">Platform overview and management</p>
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
            <p class="text-xs" :class="stat.changeClass">{{ stat.change }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <!-- User Growth Chart -->
      <div class="card p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">User Growth</h2>
        <div class="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <p class="text-gray-500">Chart placeholder - User growth over time</p>
        </div>
      </div>

      <!-- Job Applications Chart -->
      <div class="card p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Job Applications</h2>
        <div class="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <p class="text-gray-500">Chart placeholder - Applications per month</p>
        </div>
      </div>
    </div>

    <!-- Recent Activity and Quick Actions -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <!-- Recent Activity -->
      <div class="card p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div class="space-y-4">
          <div v-for="activity in recentActivity" :key="activity.id" class="flex items-start space-x-3">
            <div class="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
            <div class="flex-1">
              <p class="text-sm text-gray-900">{{ activity.message }}</p>
              <p class="text-xs text-gray-500">{{ activity.time }}</p>
            </div>
            <span
              class="px-2 py-1 text-xs font-medium rounded-full"
              :class="getActivityTypeClass(activity.type)"
            >
              {{ activity.type }}
            </span>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="card p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div class="grid grid-cols-2 gap-4">
          <NuxtLink to="/admin/companies" class="btn btn-outline">
            <BuildingOfficeIcon class="w-4 h-4 mr-2" />
            Manage Companies
          </NuxtLink>
          <NuxtLink to="/admin/candidates" class="btn btn-outline">
            <UsersIcon class="w-4 h-4 mr-2" />
            Manage Candidates
          </NuxtLink>
          <NuxtLink to="/admin/jobs" class="btn btn-outline">
            <BriefcaseIcon class="w-4 h-4 mr-2" />
            Review Jobs
          </NuxtLink>
          <NuxtLink to="/admin/reports" class="btn btn-outline">
            <DocumentChartBarIcon class="w-4 h-4 mr-2" />
            Generate Reports
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Platform Health -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- System Status -->
      <div class="card p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">System Status</h2>
        <div class="space-y-3">
          <div v-for="service in systemStatus" :key="service.name" class="flex items-center justify-between">
            <span class="text-sm text-gray-700">{{ service.name }}</span>
            <div class="flex items-center">
              <div
                class="w-2 h-2 rounded-full mr-2"
                :class="service.status === 'operational' ? 'bg-green-500' : 'bg-red-500'"
              ></div>
              <span class="text-xs text-gray-500 capitalize">{{ service.status }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Top Companies -->
      <div class="card p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Top Companies</h2>
        <div class="space-y-3">
          <div v-for="company in topCompanies" :key="company.id" class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                <span class="text-xs font-medium text-gray-600">{{ company.name.charAt(0) }}</span>
              </div>
              <span class="text-sm text-gray-900">{{ company.name }}</span>
            </div>
            <span class="text-xs text-gray-500">{{ company.jobs }} jobs</span>
          </div>
        </div>
      </div>

      <!-- Recent Reports -->
      <div class="card p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Recent Reports</h2>
        <div class="space-y-3">
          <div v-for="report in recentReports" :key="report.id" class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-900">{{ report.title }}</p>
              <p class="text-xs text-gray-500">{{ report.type }} • {{ report.date }}</p>
            </div>
            <span
              class="px-2 py-1 text-xs font-medium rounded-full"
              :class="getReportStatusClass(report.status)"
            >
              {{ report.status }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  UsersIcon,
  BuildingOfficeIcon,
  BriefcaseIcon,
  DocumentChartBarIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

const stats = [
  {
    title: 'Total Users',
    value: '12,543',
    change: '+12% from last month',
    changeClass: 'text-green-600',
    icon: UsersIcon,
    colorClass: 'bg-primary-600'
  },
  {
    title: 'Active Companies',
    value: '1,247',
    change: '+8% from last month',
    changeClass: 'text-green-600',
    icon: BuildingOfficeIcon,
    colorClass: 'bg-green-600'
  },
  {
    title: 'Job Postings',
    value: '3,891',
    change: '+15% from last month',
    changeClass: 'text-green-600',
    icon: BriefcaseIcon,
    colorClass: 'bg-blue-600'
  },
  {
    title: 'Applications',
    value: '28,456',
    change: '+23% from last month',
    changeClass: 'text-green-600',
    icon: DocumentChartBarIcon,
    colorClass: 'bg-purple-600'
  }
]

const recentActivity = ref([
  {
    id: 1,
    message: 'New company "TechStartup Inc." registered',
    time: '2 hours ago',
    type: 'company'
  },
  {
    id: 2,
    message: 'Job posting flagged for review',
    time: '4 hours ago',
    type: 'review'
  },
  {
    id: 3,
    message: 'User reported inappropriate content',
    time: '6 hours ago',
    type: 'report'
  },
  {
    id: 4,
    message: 'System maintenance completed',
    time: '1 day ago',
    type: 'system'
  },
  {
    id: 5,
    message: 'Monthly analytics report generated',
    time: '2 days ago',
    type: 'report'
  }
])

const systemStatus = ref([
  { name: 'API Server', status: 'operational' },
  { name: 'Database', status: 'operational' },
  { name: 'File Storage', status: 'operational' },
  { name: 'Email Service', status: 'operational' },
  { name: 'Search Engine', status: 'operational' }
])

const topCompanies = ref([
  { id: 1, name: 'TechCorp Inc.', jobs: 15 },
  { id: 2, name: 'InnovateLab', jobs: 12 },
  { id: 3, name: 'DesignStudio', jobs: 8 },
  { id: 4, name: 'StartupXYZ', jobs: 6 },
  { id: 5, name: 'FinanceFlow', jobs: 5 }
])

const recentReports = ref([
  {
    id: 1,
    title: 'Monthly User Report',
    type: 'Analytics',
    date: '2 days ago',
    status: 'completed'
  },
  {
    id: 2,
    title: 'Security Audit',
    type: 'Security',
    date: '1 week ago',
    status: 'in-progress'
  },
  {
    id: 3,
    title: 'Performance Review',
    type: 'System',
    date: '2 weeks ago',
    status: 'completed'
  }
])

function getActivityTypeClass(type) {
  switch (type) {
    case 'company':
      return 'bg-blue-100 text-blue-800'
    case 'review':
      return 'bg-yellow-100 text-yellow-800'
    case 'report':
      return 'bg-red-100 text-red-800'
    case 'system':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

function getReportStatusClass(status) {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800'
    case 'in-progress':
      return 'bg-yellow-100 text-yellow-800'
    case 'pending':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

useSeoMeta({
  title: 'Admin Dashboard - JobPortal',
  description: 'Platform administration and management'
})
</script>