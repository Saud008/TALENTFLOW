import { create } from 'zustand'
import { authService } from '../services/auth'

// #auth store using zustand
export const useAuthStore = create((set, get) => ({
  isAuthenticated: false,
  user: null,
  isLoading: false,

  login: async (email, password) => {
    set({ isLoading: true })
    
    const result = await authService.login(email, password)
    
    if (result.success) {
      set({ 
        isAuthenticated: true, 
        user: { email },
        isLoading: false 
      })
    } else {
      set({ isLoading: false })
    }
    
    return result
  },

  logout: () => {
    authService.logout()
    set({ 
      isAuthenticated: false, 
      user: null 
    })
  },

  checkAuth: () => {
    const isAuthenticated = authService.isAuthenticated()
    set({ isAuthenticated })
  }
}))
