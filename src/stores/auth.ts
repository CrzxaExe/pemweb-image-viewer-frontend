import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: localStorage.getItem('auth_logged_in') === 'true',
    username: localStorage.getItem('auth_username') ?? '',
    userId: localStorage.getItem('auth_user_id') ?? '',
    loading: false,
    error: '',
  }),

  actions: {
    setLoggedIn(username: string, userId: string) {
      this.isLoggedIn = true
      this.username = username
      this.userId = userId
      localStorage.setItem('auth_logged_in', 'true')
      localStorage.setItem('auth_username', username)
      localStorage.setItem('auth_user_id', userId)
    },

    logout() {
      this.isLoggedIn = false
      this.username = ''
      this.userId = ''
      localStorage.removeItem('auth_logged_in')
      localStorage.removeItem('auth_username')
      localStorage.removeItem('auth_user_id')
    }
  }
})
