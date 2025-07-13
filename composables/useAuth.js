export const useAuth = () => {
  const user = useState('auth.user', () => null)
  const token = useState('auth.token', () => null)

  const login = async (email, password) => {
    try {
      // Mock API call - replace with actual API
      const response = await $fetch('/api/auth/login', {
        method: 'POST',
        body: { email, password }
      })

      if (response.success) {
        user.value = response.user
        token.value = response.token
        
        // Store in localStorage for persistence
        if (process.client) {
          localStorage.setItem('auth.token', response.token)
          localStorage.setItem('auth.user', JSON.stringify(response.user))
        }
      }

      return response
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const register = async (userData) => {
    try {
      // Mock API call - replace with actual API
      const response = await $fetch('/api/auth/register', {
        method: 'POST',
        body: userData
      })

      if (response.success) {
        user.value = response.user
        token.value = response.token
        
        // Store in localStorage for persistence
        if (process.client) {
          localStorage.setItem('auth.token', response.token)
          localStorage.setItem('auth.user', JSON.stringify(response.user))
        }
      }

      return response
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const logout = async () => {
    user.value = null
    token.value = null
    
    if (process.client) {
      localStorage.removeItem('auth.token')
      localStorage.removeItem('auth.user')
    }
    
    await navigateTo('/auth/login')
  }

  const checkAuth = () => {
    if (process.client) {
      const storedToken = localStorage.getItem('auth.token')
      const storedUser = localStorage.getItem('auth.user')
      
      if (storedToken && storedUser) {
        token.value = storedToken
        user.value = JSON.parse(storedUser)
        return true
      }
    }
    return false
  }

  return {
    user: readonly(user),
    token: readonly(token),
    login,
    register,
    logout,
    checkAuth,
    isAuthenticated: computed(() => !!user.value)
  }
}