<template>
  <div v-if="job" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Job Header -->
    <div class="card p-8 mb-8">
      <div class="flex items-start justify-between mb-6">
        <div class="flex items-start space-x-6">
          <div class="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center">
            <span class="text-2xl font-bold text-gray-600">
              {{ job.company.charAt(0) }}
            </span>
          </div>
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ job.title }}</h1>
            <p class="text-xl text-gray-600 font-medium mb-2">{{ job.company }}</p>
            <div class="flex items-center text-gray-500 space-x-4">
              <div class="flex items-center">
                <MapPinIcon class="w-5 h-5 mr-1" />
                <span>{{ job.location }}</span>
              </div>
              <div class="flex items-center">
                <ClockIcon class="w-5 h-5 mr-1" />
                <span class="capitalize">{{ job.type }}</span>
              </div>
              <div class="flex items-center">
                <CalendarIcon class="w-5 h-5 mr-1" />
                <span>Posted {{ job.posted }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="flex flex-col space-y-3">
          <span class="text-2xl font-bold text-primary-600">{{ job.salary }}</span>
          <div class="flex space-x-2">
            <button
              @click="saveJob"
              class="btn btn-outline"
              :class="{ 'bg-red-50 border-red-300 text-red-700': isSaved }"
            >
              <HeartIcon class="w-4 h-4 mr-2" />
              {{ isSaved ? 'Saved' : 'Save' }}
            </button>
            <button
              @click="applyToJob"
              class="btn btn-primary"
              :disabled="hasApplied"
            >
              {{ hasApplied ? 'Applied' : 'Apply Now' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Main Content -->
      <div class="lg:col-span-2 space-y-8">
        <!-- Job Description -->
        <div class="card p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
          <div class="prose max-w-none text-gray-600">
            <p class="mb-4">{{ job.description }}</p>
            <p class="mb-4">{{ job.longDescription }}</p>
          </div>
        </div>

        <!-- Requirements -->
        <div class="card p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Requirements</h2>
          <ul class="space-y-2 text-gray-600">
            <li v-for="requirement in job.requirements" :key="requirement" class="flex items-start">
              <CheckIcon class="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>{{ requirement }}</span>
            </li>
          </ul>
        </div>

        <!-- Skills -->
        <div class="card p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Required Skills</h2>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="skill in job.skills"
              :key="skill"
              class="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full font-medium"
            >
              {{ skill }}
            </span>
          </div>
        </div>

        <!-- Benefits -->
        <div class="card p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Benefits</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div v-for="benefit in job.benefits" :key="benefit" class="flex items-center">
              <CheckCircleIcon class="w-5 h-5 text-green-500 mr-2" />
              <span class="text-gray-600">{{ benefit }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Company Info -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">About {{ job.company }}</h3>
          <p class="text-gray-600 mb-4">{{ job.companyDescription }}</p>
          <div class="space-y-3 text-sm">
            <div class="flex items-center">
              <UsersIcon class="w-4 h-4 text-gray-400 mr-2" />
              <span class="text-gray-600">{{ job.companySize }} employees</span>
            </div>
            <div class="flex items-center">
              <BuildingOfficeIcon class="w-4 h-4 text-gray-400 mr-2" />
              <span class="text-gray-600">{{ job.industry }}</span>
            </div>
            <div class="flex items-center">
              <GlobeAltIcon class="w-4 h-4 text-gray-400 mr-2" />
              <span class="text-gray-600">{{ job.companyWebsite }}</span>
            </div>
          </div>
          <NuxtLink :to="`/companies/${job.companyId}`" class="btn btn-outline w-full mt-4">
            View Company Profile
          </NuxtLink>
        </div>

        <!-- Job Details -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Job Details</h3>
          <div class="space-y-3">
            <div>
              <span class="text-sm font-medium text-gray-500">Experience Level</span>
              <p class="text-gray-900">{{ job.experienceLevel }}</p>
            </div>
            <div>
              <span class="text-sm font-medium text-gray-500">Employment Type</span>
              <p class="text-gray-900 capitalize">{{ job.type }}</p>
            </div>
            <div>
              <span class="text-sm font-medium text-gray-500">Remote Work</span>
              <p class="text-gray-900">{{ job.remote ? 'Yes' : 'No' }}</p>
            </div>
            <div>
              <span class="text-sm font-medium text-gray-500">Application Deadline</span>
              <p class="text-gray-900">{{ job.deadline }}</p>
            </div>
          </div>
        </div>

        <!-- Similar Jobs -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Similar Jobs</h3>
          <div class="space-y-4">
            <div v-for="similarJob in similarJobs" :key="similarJob.id" class="border-b border-gray-200 pb-4 last:border-b-0">
              <NuxtLink :to="`/jobs/${similarJob.id}`" class="block hover:text-primary-600">
                <h4 class="font-medium text-gray-900">{{ similarJob.title }}</h4>
                <p class="text-sm text-gray-600">{{ similarJob.company }}</p>
                <p class="text-sm text-gray-500">{{ similarJob.location }}</p>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  MapPinIcon,
  ClockIcon,
  CalendarIcon,
  HeartIcon,
  CheckIcon,
  CheckCircleIcon,
  UsersIcon,
  BuildingOfficeIcon,
  GlobeAltIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()
const { user } = useAuth()

const isSaved = ref(false)
const hasApplied = ref(false)

const { data: job, pending, error } = await useFetch(`/api/jobs/${route.params.id}`)

// TODO: Fetch similar jobs from API
const similarJobs = ref([])

async function saveJob() {
  if (!user.value) {
    navigateTo('/auth/login')
    return
  }

  isSaved.value = !isSaved.value
  try {
    await useFetch('/api/candidate/saved-jobs', {
      method: 'PUT',
      body: {
        jobId: job.value._id,
        save: isSaved.value
      }
    })
  } catch (error) {
    console.error('Failed to save job:', error)
    // Optionally, revert the isSaved state and show an error
    isSaved.value = !isSaved.value
  }
}

async function applyToJob() {
  if (!user.value) {
    navigateTo('/auth/login')
    return
  }
  
  try {
    await useFetch('/api/applications', {
      method: 'POST',
      body: {
        jobId: job.value._id
      }
    })
    hasApplied.value = true
  } catch (error) {
    console.error('Failed to apply for job:', error)
    // Optionally, show an error message to the user
  }
}

useSeoMeta({
  title: () => `${job.value?.title} at ${job.value?.company} - JobPortal`,
  description: () => job.value?.description
})
</script>