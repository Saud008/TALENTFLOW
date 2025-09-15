import api from './api'

// #auth service for backend authentication
export const authService = {
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password })
      const { token } = response.data
      
      localStorage.setItem('authToken', token)
      return { success: true, token }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      }
    }
  },

  async logout() {
    localStorage.removeItem('authToken')
  },

  getToken() {
    return localStorage.getItem('authToken')
  },

  isAuthenticated() {
    return !!this.getToken()
  }
}
