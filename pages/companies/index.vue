<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-4">Browse Companies</h1>
      <p class="text-gray-600">Discover amazing companies and their open positions</p>
    </div>

    <!-- Search and Filters -->
    <div class="bg-white rounded-lg shadow-sm border p-6 mb-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <input
          v-model="filters.search"
          type="text"
          placeholder="Company name or industry"
          class="input"
        />
        <select v-model="filters.industry" class="input">
          <option value="">All Industries</option>
          <option value="technology">Technology</option>
          <option value="finance">Finance</option>
          <option value="healthcare">Healthcare</option>
          <option value="education">Education</option>
          <option value="retail">Retail</option>
        </select>
        <select v-model="filters.size" class="input">
          <option value="">All Company Sizes</option>
          <option value="startup">Startup (1-50)</option>
          <option value="small">Small (51-200)</option>
          <option value="medium">Medium (201-1000)</option>
          <option value="large">Large (1000+)</option>
        </select>
      </div>
      
      <div class="flex items-center justify-between">
        <div class="text-sm text-gray-600">
          {{ filteredCompanies.length }} companies found
        </div>
        <div class="flex items-center space-x-2">
          <span class="text-sm text-gray-600">Sort by:</span>
          <select v-model="sortBy" class="input text-sm">
            <option value="name">Company Name</option>
            <option value="jobs">Open Positions</option>
            <option value="size">Company Size</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Company Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="company in paginatedCompanies"
        :key="company._id"
        class="card p-6 hover:border-primary-300 transition-all duration-200 cursor-pointer"
        @click="viewCompany(company._id)"
      >
        <div class="flex items-start space-x-4 mb-4">
          <div class="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center">
            <span class="text-xl font-bold text-gray-600">
              {{ company.name.charAt(0) }}
            </span>
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors">
              {{ company.name }}
            </h3>
            <p class="text-gray-600 text-sm">{{ company.industry }}</p>
            <div class="flex items-center text-xs text-gray-500 mt-1">
              <UsersIcon class="w-3 h-3 mr-1" />
              <span>{{ company.size }} employees</span>
              <span class="mx-2">•</span>
              <MapPinIcon class="w-3 h-3 mr-1" />
              <span>{{ company.location }}</span>
            </div>
          </div>
        </div>
        
        <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ company.description }}</p>
        
        <div class="flex items-center justify-between">
          <div class="flex items-center text-sm">
            <BriefcaseIcon class="w-4 h-4 text-primary-600 mr-1" />
            <span class="text-primary-600 font-medium">{{ company.openJobs }} open positions</span>
          </div>
          <button
            @click.stop="followCompany(company._id)"
            class="text-gray-400 hover:text-primary-600 transition-colors"
          >
            <HeartIcon class="w-5 h-5" />
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
import { UsersIcon, MapPinIcon, BriefcaseIcon, HeartIcon } from '@heroicons/vue/24/outline'

const router = useRouter()

const filters = reactive({
  search: '',
  industry: '',
  size: ''
})

const sortBy = ref('name')
const currentPage = ref(1)
const companiesPerPage = 12

const { data: companies, pending, error } = await useFetch('/api/companies', {
  lazy: true,
  server: false
})

const filteredCompanies = computed(() => {
  let filtered = companies.value

  if (filters.search) {
    filtered = filtered.filter(company =>
      company.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      company.industry.toLowerCase().includes(filters.search.toLowerCase())
    )
  }

  if (filters.industry) {
    filtered = filtered.filter(company => 
      company.industry.toLowerCase() === filters.industry.toLowerCase()
    )
  }

  if (filters.size) {
    filtered = filtered.filter(company => {
      const size = company.size.toLowerCase()
      switch (filters.size) {
        case 'startup':
          return size.includes('1-50') || size.includes('50')
        case 'small':
          return size.includes('51-200') || size.includes('200')
        case 'medium':
          return size.includes('201-1000') || size.includes('500')
        case 'large':
          return size.includes('1000+')
        default:
          return true
      }
    })
  }

  // Sort companies
  switch (sortBy.value) {
    case 'name':
      filtered.sort((a, b) => a.name.localeCompare(b.name))
      break
    case 'jobs':
      filtered.sort((a, b) => b.openJobs - a.openJobs)
      break
    case 'size':
      // Would implement proper size sorting
      break
  }

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredCompanies.value.length / companiesPerPage))

const paginatedCompanies = computed(() => {
  const start = (currentPage.value - 1) * companiesPerPage
  const end = start + companiesPerPage
  return filteredCompanies.value.slice(start, end)
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

function viewCompany(companyId) {
  router.push(`/companies/${companyId}`)
}

function followCompany(companyId) {
  // Handle following company
  console.log('Following company:', companyId)
}

// Watch filters and reset pagination
watch(filters, () => {
  currentPage.value = 1
}, { deep: true })

useSeoMeta({
  title: 'Browse Companies - JobPortal',
  description: 'Discover amazing companies and explore their open positions.'
})
</script>