<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Job Postings</h1>
        <p class="text-gray-600">Manage your job listings and track applications</p>
      </div>
      <NuxtLink to="/company/jobs/new" class="btn btn-primary">
        <PlusIcon class="w-4 h-4 mr-2" />
        Post New Job
      </NuxtLink>
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
          placeholder="Search jobs..."
          class="input"
        />
        <select v-model="filters.status" class="input">
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="closed">Closed</option>
          <option value="draft">Draft</option>
        </select>
        <select v-model="filters.type" class="input">
          <option value="">All Types</option>
          <option value="full-time">Full-time</option>
          <option value="part-time">Part-time</option>
          <option value="contract">Contract</option>
          <option value="remote">Remote</option>
        </select>
        <select v-model="sortBy" class="input">
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="applications">Most Applications</option>
          <option value="views">Most Views</option>
        </select>
      </div>
    </div>

    <!-- Jobs List -->
    <div class="space-y-6">
      <div
        v-for="job in filteredJobs"
        :key="job.id"
        class="card p-6 hover:shadow-md transition-shadow"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-start justify-between mb-4">
              <div>
                <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ job.title }}</h3>
                <div class="flex items-center text-sm text-gray-500 space-x-4">
                  <div class="flex items-center">
                    <MapPinIcon class="w-4 h-4 mr-1" />
                    <span>{{ job.location }}</span>
                  </div>
                  <div class="flex items-center">
                    <ClockIcon class="w-4 h-4 mr-1" />
                    <span class="capitalize">{{ job.type }}</span>
                  </div>
                  <div class="flex items-center">
                    <CalendarIcon class="w-4 h-4 mr-1" />
                    <span>Posted {{ job.posted }}</span>
                  </div>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <span
                  class="px-3 py-1 text-sm font-medium rounded-full"
                  :class="getStatusClass(job.status)"
                >
                  {{ job.status }}
                </span>
                <div class="relative">
                  <button
                    @click="toggleDropdown(job.id)"
                    class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                  >
                    <EllipsisVerticalIcon class="w-5 h-5" />
                  </button>
                  <div
                    v-if="activeDropdown === job.id"
                    class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10"
                  >
                    <NuxtLink
                      :to="`/company/jobs/${job.id}`"
                      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      View Details
                    </NuxtLink>
                    <NuxtLink
                      :to="`/company/jobs/${job.id}/edit`"
                      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Edit Job
                    </NuxtLink>
                    <button
                      @click="toggleJobStatus(job.id)"
                      class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {{ job.status === 'active' ? 'Pause Job' : 'Activate Job' }}
                    </button>
                    <button
                      @click="duplicateJob(job.id)"
                      class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Duplicate Job
                    </button>
                    <button
                      @click="deleteJob(job.id)"
                      class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Delete Job
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <p class="text-gray-600 mb-4 line-clamp-2">{{ job.description }}</p>
            
            <!-- Job Stats -->
            <div class="grid grid-cols-4 gap-6 py-4 border-t border-gray-200">
              <div class="text-center">
                <div class="text-2xl font-bold text-primary-600">{{ job.applications }}</div>
                <div class="text-sm text-gray-600">Applications</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-primary-600">{{ job.views }}</div>
                <div class="text-sm text-gray-600">Views</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-primary-600">{{ job.shortlisted }}</div>
                <div class="text-sm text-gray-600">Shortlisted</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-primary-600">{{ job.hired }}</div>
                <div class="text-sm text-gray-600">Hired</div>
              </div>
            </div>
            
            <!-- Action Buttons -->
            <div class="flex items-center justify-between pt-4 border-t border-gray-200">
              <div class="flex space-x-2">
                <span
                  v-for="skill in job.skills.slice(0, 3)"
                  :key="skill"
                  class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                >
                  {{ skill }}
                </span>
                <span
                  v-if="job.skills.length > 3"
                  class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                >
                  +{{ job.skills.length - 3 }} more
                </span>
              </div>
              
              <div class="flex space-x-2">
                <NuxtLink
                  :to="`/company/jobs/${job.id}/applications`"
                  class="btn btn-outline text-sm"
                >
                  View Applications ({{ job.applications }})
                </NuxtLink>
                <NuxtLink
                  :to="`/jobs/${job.id}`"
                  class="btn btn-secondary text-sm"
                  target="_blank"
                >
                  Preview
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredJobs.length === 0" class="text-center py-12">
      <BriefcaseIcon class="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
      <p class="text-gray-600 mb-6">Start by posting your first job to attract candidates.</p>
      <NuxtLink to="/company/jobs/new" class="btn btn-primary">
        Post Your First Job
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import {
  PlusIcon,
  BriefcaseIcon,
  UsersIcon,
  EyeIcon,
  CheckCircleIcon,
  MapPinIcon,
  ClockIcon,
  CalendarIcon,
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
  type: ''
})

const sortBy = ref('newest')

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
    title: 'Total Views',
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

const jobs = ref([
  {
    id: 1,
    title: 'Senior Frontend Developer',
    location: 'San Francisco, CA',
    type: 'full-time',
    status: 'active',
    posted: '2 days ago',
    description: 'Join our team to build amazing user experiences with React, Vue, and modern JavaScript.',
    applications: 24,
    views: 156,
    shortlisted: 8,
    hired: 2,
    skills: ['React', 'Vue.js', 'TypeScript', 'CSS', 'JavaScript']
  },
  {
    id: 2,
    title: 'Product Manager',
    location: 'Remote',
    type: 'full-time',
    status: 'active',
    posted: '1 week ago',
    description: 'Lead product strategy and work with cross-functional teams to deliver innovative solutions.',
    applications: 18,
    views: 89,
    shortlisted: 5,
    hired: 1,
    skills: ['Product Strategy', 'Agile', 'Analytics', 'Leadership']
  },
  {
    id: 3,
    title: 'UX Designer',
    location: 'New York, NY',
    type: 'contract',
    status: 'paused',
    posted: '3 days ago',
    description: 'Create beautiful and intuitive user interfaces for web and mobile applications.',
    applications: 12,
    views: 67,
    shortlisted: 3,
    hired: 0,
    skills: ['Figma', 'Sketch', 'Prototyping', 'User Research']
  }
])

const filteredJobs = computed(() => {
  let filtered = jobs.value

  if (filters.search) {
    filtered = filtered.filter(job =>
      job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      job.skills.some(skill => skill.toLowerCase().includes(filters.search.toLowerCase()))
    )
  }

  if (filters.status) {
    filtered = filtered.filter(job => job.status === filters.status)
  }

  if (filters.type) {
    filtered = filtered.filter(job => job.type === filters.type)
  }

  // Sort jobs
  switch (sortBy.value) {
    case 'newest':
      // Would sort by actual date
      break
    case 'oldest':
      filtered = [...filtered].reverse()
      break
    case 'applications':
      filtered.sort((a, b) => b.applications - a.applications)
      break
    case 'views':
      filtered.sort((a, b) => b.views - a.views)
      break
  }

  return filtered
})

function getStatusClass(status) {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800'
    case 'paused':
      return 'bg-yellow-100 text-yellow-800'
    case 'closed':
      return 'bg-red-100 text-red-800'
    case 'draft':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

function toggleDropdown(jobId) {
  activeDropdown.value = activeDropdown.value === jobId ? null : jobId
}

function toggleJobStatus(jobId) {
  const job = jobs.value.find(j => j.id === jobId)
  if (job) {
    job.status = job.status === 'active' ? 'paused' : 'active'
  }
  activeDropdown.value = null
}

function duplicateJob(jobId) {
  // Handle job duplication
  activeDropdown.value = null
}

function deleteJob(jobId) {
  // Handle job deletion
  activeDropdown.value = null
}

// Close dropdown when clicking outside
onClickOutside(() => {
  activeDropdown.value = null
})

useSeoMeta({
  title: 'Job Postings - JobPortal',
  description: 'Manage your job listings and track applications'
})
</script>