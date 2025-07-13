export default defineNuxtRouteMiddleware((to, from) => {
  const { user, checkAuth } = useAuth()
  
  // Check if user is authenticated
  if (!user.value) {
    checkAuth()
  }
  
  if (!user.value) {
    return navigateTo('/auth/login')
  }
})