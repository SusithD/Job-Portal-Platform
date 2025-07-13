export default defineNuxtPlugin(() => {
  const { checkAuth } = useAuth()
  
  // Check authentication on app initialization
  checkAuth()
})