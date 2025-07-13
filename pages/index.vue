<template>
  <div>
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-primary-600 to-primary-800 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div class="text-center">
          <h1 class="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Find Your Dream Job
          </h1>
          <p class="text-xl md:text-2xl text-primary-100 mb-8 max-w-3xl mx-auto animate-slide-up">
            Connect with top companies and discover opportunities that match your skills and aspirations.
          </p>
          
          <!-- Search Bar -->
          <div class="max-w-4xl mx-auto bg-white rounded-2xl p-2 shadow-2xl animate-slide-up">
            <div class="flex flex-col md:flex-row gap-2">
              <div class="flex-1">
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Job title, keywords, or company"
                  class="w-full px-4 py-3 text-gray-900 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div class="flex-1">
                <input
                  v-model="locationQuery"
                  type="text"
                  placeholder="Location"
                  class="w-full px-4 py-3 text-gray-900 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <button
                @click="searchJobs"
                class="px-8 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium"
              >
                Search Jobs
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div v-for="stat in stats" :key="stat.label" class="animate-fade-in">
            <div class="text-3xl md:text-4xl font-bold text-primary-600 mb-2">{{ stat.value }}</div>
            <div class="text-gray-600">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Jobs -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Jobs</h2>
          <p class="text-xl text-gray-600">Discover opportunities from top companies</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div v-for="job in featuredJobs" :key="job.id" class="card p-6 group cursor-pointer hover:border-primary-300">
            <div class="flex items-start justify-between mb-4">
              <div>
                <h3 class="font-semibold text-lg text-gray-900 group-hover:text-primary-600 transition-colors">
                  {{ job.title }}
                </h3>
                <p class="text-gray-600">{{ job.company }}</p>
              </div>
              <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <span class="text-lg font-semibold text-gray-600">{{ job.company.charAt(0) }}</span>
              </div>
            </div>
            
            <div class="flex items-center text-sm text-gray-500 mb-4">
              <MapPinIcon class="w-4 h-4 mr-1" />
              <span>{{ job.location }}</span>
              <span class="mx-2">•</span>
              <span>{{ job.type }}</span>
            </div>
            
            <p class="text-gray-600 mb-4 text-sm line-clamp-2">{{ job.description }}</p>
            
            <div class="flex items-center justify-between">
              <span class="text-primary-600 font-semibold">{{ job.salary }}</span>
              <span class="text-xs text-gray-500">{{ job.posted }}</span>
            </div>
          </div>
        </div>

        <div class="text-center">
          <NuxtLink to="/jobs" class="btn btn-primary">
            View All Jobs
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p class="text-xl text-gray-600">Get started in three simple steps</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="(step, index) in steps" :key="step.title" class="text-center">
            <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-2xl font-bold text-primary-600">{{ index + 1 }}</span>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ step.title }}</h3>
            <p class="text-gray-600">{{ step.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 bg-primary-600 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
        <p class="text-xl text-primary-100 mb-8">Join thousands of professionals finding their dream jobs</p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink to="/auth/register?type=candidate" class="btn bg-white text-primary-600 hover:bg-gray-100">
            Find Jobs
          </NuxtLink>
          <NuxtLink to="/auth/register?type=company" class="btn border-2 border-white text-white hover:bg-white hover:text-primary-600">
            Hire Talent
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { MapPinIcon } from '@heroicons/vue/24/outline'

const searchQuery = ref('')
const locationQuery = ref('')

const stats = [
  { value: '10K+', label: 'Active Jobs' },
  { value: '5K+', label: 'Companies' },
  { value: '50K+', label: 'Job Seekers' },
  { value: '95%', label: 'Success Rate' }
]

const featuredJobs = [
  {
    id: 1,
    title: 'Senior Frontend Developer',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    type: 'Full-time',
    description: 'Join our team to build amazing user experiences with modern technologies.',
    salary: '$120K - $180K',
    posted: '2 days ago'
  },
  {
    id: 2,
    title: 'Product Manager',
    company: 'InnovateLab',
    location: 'New York, NY',
    type: 'Full-time',
    description: 'Lead product strategy and work with cross-functional teams.',
    salary: '$130K - $200K',
    posted: '1 day ago'
  },
  {
    id: 3,
    title: 'UX Designer',
    company: 'DesignStudio',
    location: 'Remote',
    type: 'Contract',
    description: 'Create beautiful and intuitive user interfaces for web and mobile.',
    salary: '$80K - $120K',
    posted: '3 days ago'
  }
]

const steps = [
  {
    title: 'Create Your Profile',
    description: 'Build a compelling profile that showcases your skills and experience.'
  },
  {
    title: 'Apply to Jobs',
    description: 'Browse and apply to thousands of job opportunities from top companies.'
  },
  {
    title: 'Get Hired',
    description: 'Connect with employers and land your dream job.'
  }
]

function searchJobs() {
  navigateTo({
    path: '/jobs',
    query: {
      q: searchQuery.value,
      location: locationQuery.value
    }
  })
}

useSeoMeta({
  title: 'JobPortal - Find Your Dream Job',
  description: 'Connect with top companies and discover opportunities that match your skills and aspirations.'
})
</script>