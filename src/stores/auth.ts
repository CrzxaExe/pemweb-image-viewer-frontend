import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: localStorage.getItem('auth_logged_in') === 'true',
    username: localStorage.getItem('auth_username') ?? '',
    loading: false,
    error: '',
  }),

  actions: {
    // Dipanggil setelah backend berhasil login (cookie sudah di-set oleh server)
    setLoggedIn(username: string) {
      this.isLoggedIn = true
      this.username = username
      localStorage.setItem('auth_logged_in', 'true')
      localStorage.setItem('auth_username', username)
    },

    logout() {
      this.isLoggedIn = false
      this.username = ''
      localStorage.removeItem('auth_logged_in')
      localStorage.removeItem('auth_username')
    }
  }
})
