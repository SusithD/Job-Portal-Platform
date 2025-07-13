<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Company Header -->
    <div class="card p-8 mb-8">
      <div class="flex items-start justify-between mb-6">
        <div class="flex items-start space-x-6">
          <div class="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center">
            <span class="text-3xl font-bold text-gray-600">
              {{ company.name.charAt(0) }}
            </span>
          </div>
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ company.name }}</h1>
            <p class="text-xl text-gray-600 mb-3">{{ company.tagline }}</p>
            <div class="flex items-center space-x-6 text-gray-500">
              <div class="flex items-center">
                <MapPinIcon class="w-5 h-5 mr-1" />
                <span>{{ company.location }}</span>
              </div>
              <div class="flex items-center">
                <UsersIcon class="w-5 h-5 mr-1" />
                <span>{{ company.size }} employees</span>
              </div>
              <div class="flex items-center">
                <BuildingOfficeIcon class="w-5 h-5 mr-1" />
                <span>{{ company.industry }}</span>
              </div>
              <div class="flex items-center">
                <GlobeAltIcon class="w-5 h-5 mr-1" />
                <a :href="`https://${company.website}`" target="_blank" class="text-primary-600 hover:text-primary-700">
                  {{ company.website }}
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div class="flex space-x-3">
          <button
            @click="followCompany"
            class="btn btn-outline"
            :class="{ 'bg-primary-50 border-primary-300 text-primary-700': isFollowing }"
          >
            <HeartIcon class="w-4 h-4 mr-2" />
            {{ isFollowing ? 'Following' : 'Follow' }}
          </button>
          <button class="btn btn-secondary">
            <ShareIcon class="w-4 h-4 mr-2" />
            Share
          </button>
        </div>
      </div>
      
      <!-- Company Stats -->
      <div class="grid grid-cols-4 gap-6 pt-6 border-t border-gray-200">
        <div class="text-center">
          <div class="text-2xl font-bold text-primary-600">{{ company.openJobs }}</div>
          <div class="text-sm text-gray-600">Open Positions</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-primary-600">{{ company.founded }}</div>
          <div class="text-sm text-gray-600">Founded</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-primary-600">{{ company.rating }}</div>
          <div class="text-sm text-gray-600">Company Rating</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-primary-600">{{ company.followers }}</div>
          <div class="text-sm text-gray-600">Followers</div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Main Content -->
      <div class="lg:col-span-2 space-y-8">
        <!-- About -->
        <div class="card p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">About {{ company.name }}</h2>
          <div class="prose max-w-none text-gray-600">
            <p class="mb-4">{{ company.description }}</p>
            <p>{{ company.longDescription }}</p>
          </div>
        </div>

        <!-- Open Positions -->
        <div class="card p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold text-gray-900">Open Positions ({{ openJobs.length }})</h2>
            <NuxtLink to="/jobs" class="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View All Jobs
            </NuxtLink>
          </div>
          
          <div class="space-y-4">
            <div
              v-for="job in openJobs"
              :key="job.id"
              class="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors cursor-pointer"
              @click="viewJob(job.id)"
            >
              <div class="flex items-start justify-between">
                <div>
                  <h3 class="font-semibold text-gray-900 hover:text-primary-600">{{ job.title }}</h3>
                  <div class="flex items-center text-sm text-gray-500 mt-1">
                    <MapPinIcon class="w-4 h-4 mr-1" />
                    <span>{{ job.location }}</span>
                    <span class="mx-2">•</span>
                    <span class="capitalize">{{ job.type }}</span>
                    <span class="mx-2">•</span>
                    <span>{{ job.posted }}</span>
                  </div>
                  <p class="text-gray-600 text-sm mt-2 line-clamp-2">{{ job.description }}</p>
                </div>
                <div class="text-right">
                  <div class="text-primary-600 font-semibold">{{ job.salary }}</div>
                  <button
                    @click.stop="applyToJob(job.id)"
                    class="btn btn-primary text-sm mt-2"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Company Culture -->
        <div class="card p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Company Culture & Values</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="value in company.values" :key="value.title" class="flex items-start">
              <div class="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mr-3 mt-1">
                <CheckIcon class="w-4 h-4 text-primary-600" />
              </div>
              <div>
                <h3 class="font-medium text-gray-900">{{ value.title }}</h3>
                <p class="text-sm text-gray-600">{{ value.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Company Details -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Company Details</h3>
          <div class="space-y-3">
            <div>
              <span class="text-sm font-medium text-gray-500">Industry</span>
              <p class="text-gray-900">{{ company.industry }}</p>
            </div>
            <div>
              <span class="text-sm font-medium text-gray-500">Company Size</span>
              <p class="text-gray-900">{{ company.size }} employees</p>
            </div>
            <div>
              <span class="text-sm font-medium text-gray-500">Headquarters</span>
              <p class="text-gray-900">{{ company.headquarters }}</p>
            </div>
            <div>
              <span class="text-sm font-medium text-gray-500">Founded</span>
              <p class="text-gray-900">{{ company.founded }}</p>
            </div>
            <div>
              <span class="text-sm font-medium text-gray-500">Funding</span>
              <p class="text-gray-900">{{ company.funding }}</p>
            </div>
          </div>
        </div>

        <!-- Benefits -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Benefits & Perks</h3>
          <div class="space-y-2">
            <div v-for="benefit in company.benefits" :key="benefit" class="flex items-center">
              <CheckCircleIcon class="w-4 h-4 text-green-500 mr-2" />
              <span class="text-sm text-gray-600">{{ benefit }}</span>
            </div>
          </div>
        </div>

        <!-- Tech Stack -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Tech Stack</h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="tech in company.techStack"
              :key="tech"
              class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
            >
              {{ tech }}
            </span>
          </div>
        </div>

        <!-- Contact -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Get in Touch</h3>
          <div class="space-y-3">
            <a :href="`mailto:${company.email}`" class="flex items-center text-gray-600 hover:text-primary-600">
              <EnvelopeIcon class="w-4 h-4 mr-2" />
              <span class="text-sm">{{ company.email }}</span>
            </a>
            <a :href="`tel:${company.phone}`" class="flex items-center text-gray-600 hover:text-primary-600">
              <PhoneIcon class="w-4 h-4 mr-2" />
              <span class="text-sm">{{ company.phone }}</span>
            </a>
            <div class="flex space-x-3 pt-2">
              <a v-for="social in company.socialLinks" :key="social.platform" :href="social.url" target="_blank" class="text-gray-400 hover:text-primary-600">
                <component :is="social.icon" class="w-5 h-5" />
              </a>
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
  UsersIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
  HeartIcon,
  ShareIcon,
  CheckIcon,
  CheckCircleIcon,
  EnvelopeIcon,
  PhoneIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()

const isFollowing = ref(false)

const { data: company, pending, error } = await useFetch(`/api/companies/${route.params.id}`, {
  lazy: true,
  server: false
})

// TODO: Fetch open jobs for this company
const openJobs = ref([])

function followCompany() {
  isFollowing.value = !isFollowing.value
}

function viewJob(jobId) {
  router.push(`/jobs/${jobId}`)
}

function applyToJob(jobId) {
  router.push(`/jobs/${jobId}`)
}

useSeoMeta({
  title: `${company.value.name} - Company Profile | JobPortal`,
  description: company.value.description
})
</script>