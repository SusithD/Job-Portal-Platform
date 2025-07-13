<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-4">Browse Jobs</h1>
      <p class="text-gray-600">Discover your next career opportunity</p>
    </div>

    <!-- Search and Filters -->
    <div class="bg-white rounded-lg shadow-sm border p-6 mb-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <input
          v-model="filters.search"
          type="text"
          placeholder="Job title or keywords"
          class="input"
        />
        <input
          v-model="filters.location"
          type="text"
          placeholder="Location"
          class="input"
        />
        <select v-model="filters.type" class="input">
          <option value="">All Job Types</option>
          <option value="full-time">Full-time</option>
          <option value="part-time">Part-time</option>
          <option value="contract">Contract</option>
          <option value="remote">Remote</option>
        </select>
        <select v-model="filters.category" class="input">
          <option value="">All Categories</option>
          <option value="technology">Technology</option>
          <option value="marketing">Marketing</option>
          <option value="design">Design</option>
          <option value="sales">Sales</option>
          <option value="finance">Finance</option>
        </select>
      </div>
      
      <div class="flex items-center justify-between">
        <div class="text-sm text-gray-600">
          {{ filteredJobs.length }} jobs found
        </div>
        <div class="flex items-center space-x-2">
          <span class="text-sm text-gray-600">Sort by:</span>
          <select v-model="sortBy" class="input text-sm">
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="salary-high">Salary: High to Low</option>
            <option value="salary-low">Salary: Low to High</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Job Listings -->
    <div class="space-y-6">
      <div
        v-for="job in paginatedJobs"
        :key="job._id"
        class="card p-6 hover:border-primary-300 transition-all duration-200 cursor-pointer"
        @click="viewJob(job._id)"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-start space-x-4">
            <div class="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
              <span class="text-lg font-semibold text-gray-600">
                {{ job.company.charAt(0) }}
              </span>
            </div>
            <div>
              <h3 class="text-xl font-semibold text-gray-900 hover:text-primary-600 transition-colors">
                {{ job.title }}
              </h3>
              <p class="text-gray-600 font-medium">{{ job.company }}</p>
              <div class="flex items-center text-sm text-gray-500 mt-1">
                <MapPinIcon class="w-4 h-4 mr-1" />
                <span>{{ job.location }}</span>
                <span class="mx-2">•</span>
                <span class="capitalize">{{ job.type }}</span>
                <span class="mx-2">•</span>
                <span>{{ new Date(job.createdAt).toLocaleDateString() }}</span>
              </div>
            </div>
          </div>
          
          <div class="flex flex-col items-end space-y-2">
            <span class="text-lg font-semibold text-primary-600">{{ job.salary }}</span>
            <button
              @click.stop="saveJob(job._id)"
              class="p-2 text-gray-400 hover:text-red-500 transition-colors"
            >
              <HeartIcon class="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <p class="text-gray-600 mb-4 line-clamp-2">{{ job.description }}</p>
        
        <div class="flex items-center justify-between">
          <div class="flex flex-wrap gap-2">
            <span
              v-for="skill in job.skills"
              :key="skill"
              class="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
            >
              {{ skill }}
            </span>
          </div>
          
          <button
            @click.stop="applyToJob(job._id)"
            class="btn btn-primary"
          >
            Apply Now
          </button>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="mt-8 flex justify-center">
      <nav class="flex items-center space-x-2">
        <button
          :disabled="currentPage === 1"
          @click="currentPage--"
          class="px-3 py-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        
        <span
          v-for="page in visiblePages"
          :key="page"
          class="px-3 py-2 rounded-lg cursor-pointer transition-colors"
          :class="page === currentPage ? 'bg-primary-600 text-white' : 'text-gray-700 hover:bg-gray-100'"
          @click="currentPage = page"
        >
          {{ page }}
        </span>
        
        <button
          :disabled="currentPage === totalPages"
          @click="currentPage++"
          class="px-3 py-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { MapPinIcon, HeartIcon } from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()

// Initialize filters from query params
const filters = reactive({
  search: route.query.q || '',
  location: route.query.location || '',
  type: route.query.type || '',
  category: route.query.category || ''
})

const sortBy = ref('newest')
const currentPage = ref(1)
const jobsPerPage = 10

const { data: jobs, pending, error } = await useFetch('/api/jobs')

const filteredJobs = computed(() => {
  if (!jobs.value) return []
  let filtered = jobs.value

  if (filters.search) {
    filtered = filtered.filter(job =>
      job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      job.company.toLowerCase().includes(filters.search.toLowerCase()) ||
      job.skills.some(skill => skill.toLowerCase().includes(filters.search.toLowerCase()))
    )
  }

  if (filters.location) {
    filtered = filtered.filter(job =>
      job.location.toLowerCase().includes(filters.location.toLowerCase())
    )
  }

  if (filters.type) {
    filtered = filtered.filter(job => job.type === filters.type)
  }

  if (filters.category) {
    filtered = filtered.filter(job => job.category === filters.category)
  }

  // Sort jobs
  switch (sortBy.value) {
    case 'newest':
      // Would sort by date in real implementation
      break
    case 'oldest':
      filtered = [...filtered].reverse()
      break
    case 'salary-high':
      // Would sort by salary in real implementation
      break
    case 'salary-low':
      // Would sort by salary in real implementation
      break
  }

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredJobs.value.length / jobsPerPage))

const paginatedJobs = computed(() => {
  const start = (currentPage.value - 1) * jobsPerPage
  const end = start + jobsPerPage
  return filteredJobs.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, start + 4)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

function viewJob(jobId) {
  router.push(`/jobs/${jobId}`)
}

function applyToJob(jobId) {
  // Handle job application
  console.log('Applying to job:', jobId)
}

function saveJob(jobId) {
  // Handle saving job
  console.log('Saving job:', jobId)
}

// Watch filters and update URL
watch(filters, () => {
  const query = {}
  if (filters.search) query.q = filters.search
  if (filters.location) query.location = filters.location
  if (filters.type) query.type = filters.type
  if (filters.category) query.category = filters.category
  
  router.replace({ query })
  currentPage.value = 1
}, { deep: true })

useSeoMeta({
  title: 'Browse Jobs - JobPortal',
  description: 'Find your next career opportunity. Browse thousands of job listings from top companies.'
})
</script>