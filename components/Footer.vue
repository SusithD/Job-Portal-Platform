<template>
  <footer class="bg-gray-900 text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Logo and Description -->
        <div class="md:col-span-2">
          <div class="flex items-center space-x-2 mb-4">
            <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-sm">JP</span>
            </div>
            <span class="text-xl font-bold">JobPortal</span>
          </div>
          <p class="text-gray-400 mb-4">
            Connect talented professionals with amazing opportunities. 
            Your next career move starts here.
          </p>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="font-semibold mb-4">For Job Seekers</h3>
          <ul class="space-y-2 text-gray-400">
            <li><NuxtLink to="/jobs" class="hover:text-white transition-colors">Browse Jobs</NuxtLink></li>
            <li><NuxtLink to="/auth/register?type=candidate" class="hover:text-white transition-colors">Create Profile</NuxtLink></li>
            <li><NuxtLink to="/career-advice" class="hover:text-white transition-colors">Career Advice</NuxtLink></li>
          </ul>
        </div>

        <!-- Company Links -->
        <div>
          <h3 class="font-semibold mb-4">For Employers</h3>
          <ul class="space-y-2 text-gray-400">
            <li><NuxtLink to="/auth/register?type=company" class="hover:text-white transition-colors">Post Jobs</NuxtLink></li>
            <li><NuxtLink to="/pricing" class="hover:text-white transition-colors">Pricing</NuxtLink></li>
            <li><NuxtLink to="/employer-resources" class="hover:text-white transition-colors">Resources</NuxtLink></li>
          </ul>
        </div>
      </div>

      <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
        <p>&copy; 2025 JobPortal. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>