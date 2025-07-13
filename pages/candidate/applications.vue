<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">My Applications</h1>
      <p class="text-gray-600">Track the status of your job applications</p>
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

    <!-- Filters -->
    <div class="card p-6 mb-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          v-model="filters.search"
          type="text"
          placeholder="Search applications..."
          class="input"
        />
        <select v-model="filters.status" class="input">
          <option value="">All Statuses</option>
          <option value="applied">Applied</option>
          <option value="in-review">In Review</option>
          <option value="shortlisted">Shortlisted</option>
          <option value="interview">Interview</option>
          <option value="rejected">Rejected</option>
          <option value="hired">Hired</option>
        </select>
        <select v-model="filters.dateRange" class="input">
          <option value="">All Time</option>
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
          <option value="quarter">Last 3 Months</option>
        </select>
        <select v-model="sortBy" class="input">
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="company">Company Name</option>
          <option value="status">Status</option>
        </select>
      </div>
    </div>

    <!-- Applications List -->
    <div class="space-y-4">
      <div
        v-for="application in filteredApplications"
        :key="application.id"
        class="card p-6 hover:shadow-md transition-shadow"
      >
        <div class="flex items-start justify-between">
          <div class="flex items-start space-x-4">
            <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <span class="text-lg font-semibold text-gray-600">
                {{ application.company.charAt(0) }}
              </span>
            </div>
            <div class="flex-1">
              <div class="flex items-start justify-between">
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 hover:text-primary-600 cursor-pointer">
                    {{ application.jobTitle }}
                  </h3>
                  <p class="text-gray-600 font-medium">{{ application.company }}</p>
                  <div class="flex items-center text-sm text-gray-500 mt-1">
                    <MapPinIcon class="w-4 h-4 mr-1" />
                    <span>{{ application.location }}</span>
                    <span class="mx-2">•</span>
                    <span>Applied {{ application.appliedDate }}</span>
                  </div>
                </div>
                <div class="flex items-center space-x-3">
                  <span
                    class="px-3 py-1 text-sm font-medium rounded-full"
                    :class="getStatusClass(application.status)"
                  >
                    {{ getStatusText(application.status) }}
                  </span>
                  <div class="relative">
                    <button
                      @click="toggleDropdown(application.id)"
                      class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                    >
                      <EllipsisVerticalIcon class="w-5 h-5" />
                    </button>
                    <div
                      v-if="activeDropdown === application.id"
                      class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10"
                    >
                      <button
                        @click="viewApplication(application.id)"
                        class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        View Details
                      </button>
                      <button
                        @click="withdrawApplication(application.id)"
                        class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Withdraw Application
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Application Timeline -->
              <div class="mt-4 pt-4 border-t border-gray-200">
                <div class="flex items-center space-x-4">
                  <div
                    v-for="(step, index) in application.timeline"
                    :key="step.status"
                    class="flex items-center"
                  >
                    <div
                      class="w-3 h-3 rounded-full"
                      :class="step.completed ? 'bg-primary-600' : 'bg-gray-300'"
                    ></div>
                    <span
                      class="ml-2 text-xs"
                      :class="step.completed ? 'text-gray-900' : 'text-gray-500'"
                    >
                      {{ step.label }}
                    </span>
                    <div
                      v-if="index < application.timeline.length - 1"
                      class="w-8 h-px bg-gray-300 mx-3"
                    ></div>
                  </div>
                </div>
                
                <!-- Next Steps -->
                <div v-if="application.nextSteps" class="mt-3">
                  <p class="text-sm text-gray-600">
                    <span class="font-medium">Next:</span> {{ application.nextSteps }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredApplications.length === 0" class="text-center py-12">
      <DocumentTextIcon class="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
      <p class="text-gray-600 mb-6">Start applying to jobs to see your applications here.</p>
      <NuxtLink to="/jobs" class="btn btn-primary">
        Browse Jobs
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import {
  DocumentTextIcon,
  EyeIcon,
  ClockIcon,
  CheckCircleIcon,
  MapPinIcon,
  EllipsisVerticalIcon
} from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

const activeDropdown = ref(null)

const filters = reactive({
  search: '',
  status: '',
  dateRange: ''
})

const sortBy = ref('newest')

const stats = [
  {
    title: 'Total Applications',
    value: '24',
    icon: DocumentTextIcon,
    colorClass: 'bg-primary-600'
  },
  {
    title: 'In Review',
    value: '8',
    icon: EyeIcon,
    colorClass: 'bg-yellow-600'
  },
  {
    title: 'Interviews',
    value: '3',
    icon: ClockIcon,
    colorClass: 'bg-blue-600'
  },
  {
    title: 'Offers',
    value: '1',
    icon: CheckCircleIcon,
    colorClass: 'bg-green-600'
  }
]

const applications = ref([
  {
    id: 1,
    jobTitle: 'Senior Frontend Developer',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    status: 'interview',
    appliedDate: '2 days ago',
    timeline: [
      { status: 'applied', label: 'Applied', completed: true },
      { status: 'review', label: 'Review', completed: true },
      { status: 'interview', label: 'Interview', completed: true },
      { status: 'decision', label: 'Decision', completed: false }
    ],
    nextSteps: 'Final interview scheduled for tomorrow at 2 PM'
  },
  {
    id: 2,
    jobTitle: 'Product Manager',
    company: 'InnovateLab',
    location: 'New York, NY',
    status: 'shortlisted',
    appliedDate: '5 days ago',
    timeline: [
      { status: 'applied', label: 'Applied', completed: true },
      { status: 'review', label: 'Review', completed: true },
      { status: 'interview', label: 'Interview', completed: false },
      { status: 'decision', label: 'Decision', completed: false }
    ],
    nextSteps: 'Waiting for interview invitation'
  },
  {
    id: 3,
    jobTitle: 'UX Designer',
    company: 'DesignStudio',
    location: 'Remote',
    status: 'in-review',
    appliedDate: '1 week ago',
    timeline: [
      { status: 'applied', label: 'Applied', completed: true },
      { status: 'review', label: 'Review', completed: true },
      { status: 'interview', label: 'Interview', completed: false },
      { status: 'decision', label: 'Decision', completed: false }
    ],
    nextSteps: 'Application under review by hiring team'
  },
  {
    id: 4,
    jobTitle: 'Full Stack Developer',
    company: 'StartupXYZ',
    location: 'Austin, TX',
    status: 'rejected',
    appliedDate: '2 weeks ago',
    timeline: [
      { status: 'applied', label: 'Applied', completed: true },
      { status: 'review', label: 'Review', completed: true },
      { status: 'interview', label: 'Interview', completed: false },
      { status: 'decision', label: 'Decision', completed: true }
    ],
    nextSteps: null
  }
])

const filteredApplications = computed(() => {
  let filtered = applications.value

  if (filters.search) {
    filtered = filtered.filter(app =>
      app.jobTitle.toLowerCase().includes(filters.search.toLowerCase()) ||
      app.company.toLowerCase().includes(filters.search.toLowerCase())
    )
  }

  if (filters.status) {
    filtered = filtered.filter(app => app.status === filters.status)
  }

  // Sort applications
  switch (sortBy.value) {
    case 'newest':
      // Would sort by actual date
      break
    case 'oldest':
      filtered = [...filtered].reverse()
      break
    case 'company':
      filtered.sort((a, b) => a.company.localeCompare(b.company))
      break
    case 'status':
      filtered.sort((a, b) => a.status.localeCompare(b.status))
      break
  }

  return filtered
})

function getStatusClass(status) {
  switch (status) {
    case 'applied':
      return 'bg-blue-100 text-blue-800'
    case 'in-review':
      return 'bg-yellow-100 text-yellow-800'
    case 'shortlisted':
      return 'bg-purple-100 text-purple-800'
    case 'interview':
      return 'bg-indigo-100 text-indigo-800'
    case 'rejected':
      return 'bg-red-100 text-red-800'
    case 'hired':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

function getStatusText(status) {
  switch (status) {
    case 'applied':
      return 'Applied'
    case 'in-review':
      return 'In Review'
    case 'shortlisted':
      return 'Shortlisted'
    case 'interview':
      return 'Interview'
    case 'rejected':
      return 'Rejected'
    case 'hired':
      return 'Hired'
    default:
      return status
  }
}

function toggleDropdown(applicationId) {
  activeDropdown.value = activeDropdown.value === applicationId ? null : applicationId
}

function viewApplication(applicationId) {
  // Navigate to application details
  activeDropdown.value = null
}

function withdrawApplication(applicationId) {
  // Handle application withdrawal
  activeDropdown.value = null
}

// Close dropdown when clicking outside
onClickOutside(() => {
  activeDropdown.value = null
})

useSeoMeta({
  title: 'My Applications - JobPortal',
  description: 'Track the status of your job applications'
})
</script>