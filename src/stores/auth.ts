import { defineStore } from 'pinia'
import { ref } from "vue";

interface LoginPayload {
  username: string
  password: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: false,
    loading: false,
    error: '',
  }),

  actions: {
    async login(data: LoginPayload) {
      this.loading = true
      this.error = ''

      try {
        if (data.username && data.password) {
          this.isLoggedIn = true
          return true
        }

        this.error = 'Username atau password salah'
        return false
      } catch {
        this.error = 'Login gagal'
        return false
      } finally {
        this.loading = false
      }
    },

    async logout() {
      this.isLoggedIn = false
    }
  }
})
