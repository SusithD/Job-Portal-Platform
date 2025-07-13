<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
      <p class="text-gray-600">Manage your professional profile and preferences</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Main Profile Form -->
      <div class="lg:col-span-2 space-y-8">
        <!-- Basic Information -->
        <div class="card p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
          <form @submit.prevent="saveBasicInfo">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input v-model="profile.firstName" type="text" class="input" required />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input v-model="profile.lastName" type="text" class="input" required />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input v-model="profile.email" type="email" class="input" required />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input v-model="profile.phone" type="tel" class="input" />
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input v-model="profile.location" type="text" class="input" placeholder="City, State" />
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">Professional Title</label>
                <input v-model="profile.title" type="text" class="input" placeholder="e.g., Senior Frontend Developer" />
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <textarea v-model="profile.bio" rows="4" class="input" placeholder="Tell us about yourself..."></textarea>
              </div>
            </div>
            <div class="mt-6">
              <button type="submit" class="btn btn-primary">Save Changes</button>
            </div>
          </form>
        </div>

        <!-- Work Experience -->
        <div class="card p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold text-gray-900">Work Experience</h2>
            <button @click="addExperience" class="btn btn-outline">
              <PlusIcon class="w-4 h-4 mr-2" />
              Add Experience
            </button>
          </div>
          
          <div class="space-y-6">
            <div
              v-for="(exp, index) in profile.experience"
              :key="index"
              class="border border-gray-200 rounded-lg p-4"
            >
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                  <input v-model="exp.title" type="text" class="input" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Company</label>
                  <input v-model="exp.company" type="text" class="input" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <input v-model="exp.startDate" type="month" class="input" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <input v-model="exp.endDate" type="month" class="input" :disabled="exp.current" />
                  <label class="flex items-center mt-2">
                    <input v-model="exp.current" type="checkbox" class="mr-2" />
                    <span class="text-sm text-gray-600">I currently work here</span>
                  </label>
                </div>
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea v-model="exp.description" rows="3" class="input"></textarea>
                </div>
              </div>
              <div class="mt-4 flex justify-end">
                <button @click="removeExperience(index)" class="text-red-600 hover:text-red-700 text-sm">
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Education -->
        <div class="card p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold text-gray-900">Education</h2>
            <button @click="addEducation" class="btn btn-outline">
              <PlusIcon class="w-4 h-4 mr-2" />
              Add Education
            </button>
          </div>
          
          <div class="space-y-6">
            <div
              v-for="(edu, index) in profile.education"
              :key="index"
              class="border border-gray-200 rounded-lg p-4"
            >
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Degree</label>
                  <input v-model="edu.degree" type="text" class="input" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">School</label>
                  <input v-model="edu.school" type="text" class="input" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Field of Study</label>
                  <input v-model="edu.field" type="text" class="input" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Graduation Year</label>
                  <input v-model="edu.year" type="number" class="input" />
                </div>
              </div>
              <div class="mt-4 flex justify-end">
                <button @click="removeEducation(index)" class="text-red-600 hover:text-red-700 text-sm">
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Skills -->
        <div class="card p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Skills</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Add Skills</label>
              <div class="flex space-x-2">
                <input
                  v-model="newSkill"
                  type="text"
                  class="input flex-1"
                  placeholder="Enter a skill"
                  @keyup.enter="addSkill"
                />
                <button @click="addSkill" class="btn btn-primary">Add</button>
              </div>
            </div>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="(skill, index) in profile.skills"
                :key="index"
                class="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full"
              >
                {{ skill }}
                <button @click="removeSkill(index)" class="ml-2 text-primary-500 hover:text-primary-700">
                  <XMarkIcon class="w-3 h-3" />
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Profile Photo -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Profile Photo</h3>
          <div class="text-center">
            <div class="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span class="text-2xl font-bold text-gray-600">
                {{ profile.firstName?.charAt(0) }}{{ profile.lastName?.charAt(0) }}
              </span>
            </div>
            <button class="btn btn-outline text-sm">Upload Photo</button>
          </div>
        </div>

        <!-- Resume -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Resume</h3>
          <div v-if="profile.resume" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-4">
            <div class="flex items-center">
              <DocumentTextIcon class="w-5 h-5 text-gray-400 mr-2" />
              <span class="text-sm text-gray-700">{{ profile.resume.name }}</span>
            </div>
            <button @click="removeResume" class="text-red-600 hover:text-red-700">
              <XMarkIcon class="w-4 h-4" />
            </button>
          </div>
          <button class="btn btn-outline w-full text-sm">
            <DocumentArrowUpIcon class="w-4 h-4 mr-2" />
            {{ profile.resume ? 'Replace Resume' : 'Upload Resume' }}
          </button>
        </div>

        <!-- Profile Completion -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Profile Completion</h3>
          <div class="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div
              class="bg-primary-600 h-2 rounded-full transition-all duration-300"
              :style="{ width: `${profileCompletion}%` }"
            ></div>
          </div>
          <p class="text-sm text-gray-600 mb-4">{{ profileCompletion }}% complete</p>
          <div class="space-y-2">
            <div v-for="item in completionItems" :key="item.title" class="flex items-center justify-between">
              <div class="flex items-center">
                <CheckCircleIcon
                  v-if="item.completed"
                  class="w-4 h-4 text-green-500 mr-2"
                />
                <XCircleIcon
                  v-else
                  class="w-4 h-4 text-gray-300 mr-2"
                />
                <span class="text-sm" :class="item.completed ? 'text-gray-900' : 'text-gray-500'">
                  {{ item.title }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Privacy Settings -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Privacy Settings</h3>
          <div class="space-y-3">
            <label class="flex items-center">
              <input v-model="profile.settings.profileVisible" type="checkbox" class="mr-2" />
              <span class="text-sm text-gray-700">Make profile visible to employers</span>
            </label>
            <label class="flex items-center">
              <input v-model="profile.settings.emailNotifications" type="checkbox" class="mr-2" />
              <span class="text-sm text-gray-700">Receive email notifications</span>
            </label>
            <label class="flex items-center">
              <input v-model="profile.settings.jobAlerts" type="checkbox" class="mr-2" />
              <span class="text-sm text-gray-700">Receive job alerts</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  PlusIcon,
  XMarkIcon,
  DocumentTextIcon,
  DocumentArrowUpIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

const newSkill = ref('')

const { data: profile, pending, error, refresh } = useFetch('/api/candidate/profile')

watch(profile, (newProfile) => {
  if (newProfile) {
    // Ensure experience and education are arrays
    if (!newProfile.experience) newProfile.experience = []
    if (!newProfile.education) newProfile.education = []
    if (!newProfile.skills) newProfile.skills = []
    if (!newProfile.settings) newProfile.settings = {}
  }
})

const completionItems = computed(() => [
  { title: 'Basic Information', completed: !!(profile.firstName && profile.lastName && profile.email) },
  { title: 'Professional Title', completed: !!profile.title },
  { title: 'Bio', completed: !!profile.bio },
  { title: 'Work Experience', completed: profile.experience.length > 0 },
  { title: 'Education', completed: profile.education.length > 0 },
  { title: 'Skills', completed: profile.skills.length > 0 },
  { title: 'Resume', completed: !!profile.resume }
])

const profileCompletion = computed(() => {
  const completedItems = completionItems.value.filter(item => item.completed).length
  return Math.round((completedItems / completionItems.value.length) * 100)
})

async function saveProfile() {
  try {
    await useFetch('/api/candidate/profile', {
      method: 'PUT',
      body: profile.value
    })
    // Optionally, show a success message
  } catch (error) {
    console.error('Failed to save profile:', error)
    // Optionally, show an error message
  }
}

// Watch for changes and save automatically
watch(profile, saveProfile, { deep: true })

function addExperience() {
  profile.experience.push({
    title: '',
    company: '',
    startDate: '',
    endDate: '',
    current: false,
    description: ''
  })
}

function removeExperience(index) {
  profile.experience.splice(index, 1)
}

function addEducation() {
  profile.education.push({
    degree: '',
    school: '',
    field: '',
    year: ''
  })
}

function removeEducation(index) {
  profile.education.splice(index, 1)
}

function addSkill() {
  if (newSkill.value.trim() && !profile.skills.includes(newSkill.value.trim())) {
    profile.skills.push(newSkill.value.trim())
    newSkill.value = ''
  }
}

function removeSkill(index) {
  profile.skills.splice(index, 1)
}

function removeResume() {
  profile.resume = null
}

useSeoMeta({
  title: 'My Profile - JobPortal',
  description: 'Manage your professional profile and preferences'
})
</script>