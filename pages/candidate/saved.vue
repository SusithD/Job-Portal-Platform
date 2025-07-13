<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Saved Jobs</h1>
      <p class="text-gray-600">Jobs you've bookmarked for later</p>
    </div>

    <!-- Filters -->
    <div class="card p-6 mb-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          v-model="filters.search"
          type="text"
          placeholder="Search saved jobs..."
          class="input"
        />
        <select v-model="filters.type" class="input">
          <option value="">All Job Types</option>
          <option value="full-time">Full-time</option>
          <option value="part-time">Part-time</option>
          <option value="contract">Contract</option>
          <option value="remote">Remote</option>
        </select>
        <select v-model="sortBy" class="input">
          <option value="newest">Recently Saved</option>
          <option value="oldest">Oldest First</option>
          <option value="salary">Salary</option>
          <option value="company">Company</option>
        </select>
      </div>
    </div>

    <!-- Saved Jobs List -->
    <div v-if="filteredJobs.length > 0" class="space-y-6">
      <div
        v-for="job in filteredJobs"
        :key="job.id"
        class="card p-6 hover:border-primary-300 transition-all duration-200"
      >
        <div class="flex items-start justify-between">
          <div class="flex items-start space-x-4 flex-1">
            <div class="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
              <span class="text-lg font-semibold text-gray-600">
                {{ job.company.charAt(0) }}
              </span>
            </div>
            <div class="flex-1">
              <div class="flex items-start justify-between">
                <div>
                  <h3 class="text-xl font-semibold text-gray-900 hover:text-primary-600 cursor-pointer">
                    {{ job.title }}
                  </h3>
                  <p class="text-gray-600 font-medium">{{ job.company }}</p>
                  <div class="flex items-center text-sm text-gray-500 mt-1">
                    <MapPinIcon class="w-4 h-4 mr-1" />
                    <span>{{ job.location }}</span>
                    <span class="mx-2">•</span>
                    <span class="capitalize">{{ job.type }}</span>
                    <span class="mx-2">•</span>
                    <span>Posted {{ job.posted }}</span>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <span class="text-lg font-semibold text-primary-600">{{ job.salary }}</span>
                  <button
                    @click="unsaveJob(job.id)"
                    class="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove from saved"
                  >
                    <HeartIcon class="w-5 h-5 fill-current" />
                  </button>
                </div>
              </div>
              
              <p class="text-gray-600 mt-3 line-clamp-2">{{ job.description }}</p>
              
              <div class="flex items-center justify-between mt-4">
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="skill in job.skills.slice(0, 4)"
                    :key="skill"
                    class="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                  >
                    {{ skill }}
                  </span>
                  <span
                    v-if="job.skills.length > 4"
                    class="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                  >
                    +{{ job.skills.length - 4 }} more
                  </span>
                </div>
                
                <div class="flex space-x-2">
                  <NuxtLink
                    :to="`/jobs/${job.id}`"
                    class="btn btn-outline"
                  >
                    View Details
                  </NuxtLink>
                  <button
                    @click="applyToJob(job.id)"
                    class="btn btn-primary"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
              
              <!-- Saved Date -->
              <div class="mt-3 pt-3 border-t border-gray-200">
                <div class="flex items-center justify-between text-sm text-gray-500">
                  <span>Saved {{ job.savedDate }}</span>
                  <div class="flex items-center space-x-4">
                    <span v-if="job.applicationDeadline" class="flex items-center">
                      <ClockIcon class="w-4 h-4 mr-1" />
                      Deadline: {{ job.applicationDeadline }}
                    </span>
                    <span v-if="job.isUrgent" class="text-red-600 font-medium">
                      Urgent Hiring
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <HeartIcon class="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">No saved jobs yet</h3>
      <p class="text-gray-600 mb-6">Start saving jobs you're interested in to keep track of them.</p>
      <NuxtLink to="/jobs" class="btn btn-primary">
        Browse Jobs
      </NuxtLink>
    </div>

    <!-- Bulk Actions -->
    <div v-if="selectedJobs.length > 0" class="fixed bottom-6 left-1/2 transform -translate-x-1/2">
      <div class="bg-white rounded-lg shadow-lg border border-gray-200 p-4 flex items-center space-x-4">
        <span class="text-sm text-gray-600">{{ selectedJobs.length }} jobs selected</span>
        <button
          @click="applyToSelectedJobs"
          class="btn btn-primary text-sm"
        >
          Apply to Selected
        </button>
        <button
          @click="removeSelectedJobs"
          class="btn btn-outline text-sm"
        >
          Remove Selected
        </button>
        <button
          @click="clearSelection"
          class="text-gray-400 hover:text-gray-600"
        >
          <XMarkIcon class="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  HeartIcon,
  MapPinIcon,
  ClockIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

const filters = reactive({
  search: '',
  type: ''
})

const sortBy = ref('newest')
const selectedJobs = ref([])

// Mock saved jobs data
const savedJobs = ref([
  {
    id: 1,
    title: 'Senior Frontend Developer',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    type: 'full-time',
    salary: '$120K - $180K',
    posted: '2 days ago',
    savedDate: '1 day ago',
    applicationDeadline: 'March 15, 2025',
    isUrgent: false,
    description: 'Join our team to build amazing user experiences with React, Vue, and modern JavaScript.',
    skills: ['React', 'Vue.js', 'TypeScript', 'CSS', 'JavaScript', 'Git']
  },
  {
    id: 2,
    title: 'Product Manager',
    company: 'InnovateLab',
    location: 'New York, NY',
    type: 'full-time',
    salary: '$130K - $200K',
    posted: '1 day ago',
    savedDate: '3 hours ago',
    applicationDeadline: 'March 20, 2025',
    isUrgent: true,
    description: 'Lead product strategy and work with cross-functional teams to deliver innovative solutions.',
    skills: ['Product Strategy', 'Agile', 'Analytics', 'Leadership', 'SQL']
  },
  {
    id: 3,
    title: 'UX Designer',
    company: 'DesignStudio',
    location: 'Remote',
    type: 'contract',
    salary: '$80K - $120K',
    posted: '3 days ago',
    savedDate: '2 days ago',
    applicationDeadline: null,
    isUrgent: false,
    description: 'Create beautiful and intuitive user interfaces for web and mobile applications.',
    skills: ['Figma', 'Sketch', 'Prototyping', 'User Research', 'Design Systems']
  },
  {
    id: 4,
    title: 'Full Stack Developer',
    company: 'StartupXYZ',
    location: 'Austin, TX',
    type: 'full-time',
    salary: '$100K - $150K',
    posted: '1 week ago',
    savedDate: '5 days ago',
    applicationDeadline: 'March 10, 2025',
    isUrgent: false,
    description: 'Build end-to-end web applications using modern technologies and frameworks.',
    skills: ['Node.js', 'React', 'MongoDB', 'Express', 'AWS', 'Docker']
  }
])

const filteredJobs = computed(() => {
  let filtered = savedJobs.value

  if (filters.search) {
    filtered = filtered.filter(job =>
      job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      job.company.toLowerCase().includes(filters.search.toLowerCase()) ||
      job.skills.some(skill => skill.toLowerCase().includes(filters.search.toLowerCase()))
    )
  }

  if (filters.type) {
    filtered = filtered.filter(job => job.type === filters.type)
  }

  // Sort jobs
  switch (sortBy.value) {
    case 'newest':
      // Would sort by actual saved date
      break
    case 'oldest':
      filtered = [...filtered].reverse()
      break
    case 'salary':
      // Would sort by actual salary values
      break
    case 'company':
      filtered.sort((a, b) => a.company.localeCompare(b.company))
      break
  }

  return filtered
})

function unsaveJob(jobId) {
  const index = savedJobs.value.findIndex(job => job.id === jobId)
  if (index > -1) {
    savedJobs.value.splice(index, 1)
  }
  // Remove from selection if selected
  selectedJobs.value = selectedJobs.value.filter(id => id !== jobId)
}

function applyToJob(jobId) {
  navigateTo(`/jobs/${jobId}`)
}

function applyToSelectedJobs() {
  // Handle bulk application
  console.log('Applying to jobs:', selectedJobs.value)
  clearSelection()
}

function removeSelectedJobs() {
  selectedJobs.value.forEach(jobId => {
    unsaveJob(jobId)
  })
  clearSelection()
}

function clearSelection() {
  selectedJobs.value = []
}

useSeoMeta({
  title: 'Saved Jobs - JobPortal',
  description: 'Your bookmarked job opportunities'
})
</script>