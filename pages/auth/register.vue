<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <div class="flex justify-center">
          <div class="w-16 h-16 bg-primary-600 rounded-xl flex items-center justify-center">
            <span class="text-white font-bold text-2xl">JP</span>
          </div>
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Or
          <NuxtLink to="/auth/login" class="font-medium text-primary-600 hover:text-primary-500">
            sign in to existing account
          </NuxtLink>
        </p>
      </div>

      <!-- Account Type Selection -->
      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <h3 class="text-lg font-medium text-gray-900 mb-4">I want to:</h3>
        <div class="space-y-3">
          <label class="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              v-model="accountType"
              type="radio"
              value="candidate"
              class="h-4 w-4 text-primary-600 focus:ring-primary-500"
            />
            <div class="ml-3">
              <div class="font-medium text-gray-900">Find a job</div>
              <div class="text-sm text-gray-500">I'm looking for work opportunities</div>
            </div>
          </label>
          
          <label class="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              v-model="accountType"
              type="radio"
              value="company"
              class="h-4 w-4 text-primary-600 focus:ring-primary-500"
            />
            <div class="ml-3">
              <div class="font-medium text-gray-900">Hire talent</div>
              <div class="text-sm text-gray-500">I want to post jobs and find candidates</div>
            </div>
          </label>
        </div>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">
              {{ accountType === 'company' ? 'Company Name' : 'Full Name' }}
            </label>
            <input
              id="name"
              v-model="form.name"
              name="name"
              type="text"
              required
              class="input mt-1"
              :placeholder="accountType === 'company' ? 'Enter company name' : 'Enter your full name'"
            />
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              id="email"
              v-model="form.email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="input mt-1"
              placeholder="Enter your email"
            />
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              v-model="form.password"
              name="password"
              type="password"
              autocomplete="new-password"
              required
              class="input mt-1"
              placeholder="Create a password"
            />
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              name="confirmPassword"
              type="password"
              required
              class="input mt-1"
              placeholder="Confirm your password"
            />
          </div>
        </div>

        <div class="flex items-center">
          <input
            id="terms"
            v-model="form.acceptTerms"
            name="terms"
            type="checkbox"
            required
            class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label for="terms" class="ml-2 block text-sm text-gray-900">
            I agree to the
            <NuxtLink to="/terms" class="text-primary-600 hover:text-primary-500">
              Terms of Service
            </NuxtLink>
            and
            <NuxtLink to="/privacy" class="text-primary-600 hover:text-primary-500">
              Privacy Policy
            </NuxtLink>
          </label>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading || !accountType"
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span v-if="loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            </span>
            {{ loading ? 'Creating account...' : 'Create account' }}
          </button>
        </div>

        <div v-if="error" class="text-red-600 text-sm text-center">
          {{ error }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false
})

const { register } = useAuth()
const router = useRouter()
const route = useRoute()

const accountType = ref(route.query.type || 'candidate')

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false
})

const loading = ref(false)
const error = ref('')

async function handleRegister() {
  try {
    loading.value = true
    error.value = ''

    // Validate passwords match
    if (form.password !== form.confirmPassword) {
      error.value = 'Passwords do not match'
      return
    }

    // Validate password strength
    if (form.password.length < 8) {
      error.value = 'Password must be at least 8 characters long'
      return
    }

    const result = await register({
      name: form.name,
      email: form.email,
      password: form.password,
      role: accountType.value
    })
    
    if (result.success) {
      // Redirect to appropriate dashboard
      const redirectPath = accountType.value === 'company' 
        ? '/company/dashboard' 
        : '/candidate/dashboard'
      
      await router.push(redirectPath)
    } else {
      error.value = result.error || 'Registration failed'
    }
  } catch (err) {
    error.value = 'An error occurred. Please try again.'
  } finally {
    loading.value = false
  }
}

useSeoMeta({
  title: 'Create Account - JobPortal',
  description: 'Create your JobPortal account and start your journey'
})
</script>