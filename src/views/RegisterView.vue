<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const isLoaded = ref(false)
const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const agreeToTerms = ref(false)
const showPassword = ref(false)
const successMessage = ref('')

onMounted(() => {
  isLoaded.value = true
})

async function handleSubmit() {
  auth.error = null
  successMessage.value = ''

  if (!username.value || !email.value || !password.value || !confirmPassword.value) {
    auth.error = 'Semua field wajib diisi.'
    return
  }
  if (username.value.length < 6) {
    auth.error = 'Username minimal 6 karakter.'
    return
  }
  if (password.value.length < 8) {
    auth.error = 'Password minimal 8 karakter.'
    return
  }
  if (password.value !== confirmPassword.value) {
    auth.error = 'Password dan konfirmasi password tidak sama.'
    return
  }
  if (!agreeToTerms.value) {
    auth.error = 'Anda harus menyetujui syarat & ketentuan.'
    return
  }

  const success = await auth.register({
    username: username.value,
    email: email.value,
    password: password.value,
  })

  if (success) {
    // Backend tidak auto-login setelah register, jadi arahkan ke /login
    successMessage.value = 'Akun berhasil dibuat! Mengarahkan ke halaman login...'
    setTimeout(() => router.push('/login'), 1500)
  }
}
</script>

<template>
  <div class="landing-container">

    <div class="hero-left">
      <div class="dot-grid"></div>

      <div class="vertical-badge">
        <span class="badge-text">WHAT A THING</span>
      </div>

      <Transition name="slide-up">
        <div v-if="isLoaded" class="hero-content">
          <div class="icon-placeholder-box"></div>

          <h1 class="main-title">
            Join Image Everywhere <br />
            for <span class="text-neon-blue">Everyone</span>
          </h1>

          <p class="sub-title">
            Buat akun untuk mulai membagikan gambar ke siapa saja, tanpa ribet download.
          </p>

          <div class="bg-watermark">
            <h2>SIGN UP</h2>
            <h2>SIGN UP</h2>
          </div>
        </div>
      </Transition>
    </div>

    <div class="hero-right">
      <Transition name="slide-up-delayed">
        <div v-if="isLoaded" class="auth-card-wrapper">
          <form class="auth-card" @submit.prevent="handleSubmit">
            <h2 class="card-title">Create Account</h2>
            <p class="card-subtitle">Lengkapi data di bawah untuk mendaftar.</p>

            <div class="form-group">
              <label class="form-label" for="username">Username</label>
              <input
                id="username"
                v-model="username"
                type="text"
                class="form-input"
                placeholder="minimal 6 karakter"
                autocomplete="username"
              />
            </div>

            <div class="form-group">
              <label class="form-label" for="email">Email</label>
              <input
                id="email"
                v-model="email"
                type="email"
                class="form-input"
                placeholder="you@example.com"
                autocomplete="email"
              />
            </div>

            <div class="form-group">
              <label class="form-label" for="password">Password</label>
              <div class="input-wrapper">
                <input
                  id="password"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  class="form-input"
                  placeholder="minimal 8 karakter"
                  autocomplete="new-password"
                />
                <button class="eye-btn" type="button" @click="showPassword = !showPassword" :aria-label="showPassword ? 'Hide password' : 'Show password'">
                  {{ showPassword ? '🙈' : '👁️' }}
                </button>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="confirm-password">Konfirmasi Password</label>
              <input
                id="confirm-password"
                v-model="confirmPassword"
                :type="showPassword ? 'text' : 'password'"
                class="form-input"
                placeholder="ulangi password"
                autocomplete="new-password"
              />
            </div>

            <div class="form-meta">
              <label class="remember-me">
                <input v-model="agreeToTerms" type="checkbox" />
                <span>Saya menyetujui syarat &amp; ketentuan</span>
              </label>
            </div>

            <p v-if="auth.error" class="error-text">{{ auth.error }}</p>
            <p v-if="successMessage" class="success-text">{{ successMessage }}</p>

            <button type="submit" class="submit-btn" :disabled="auth.loading">
              {{ auth.loading ? 'Creating account...' : 'Sign Up' }}
            </button>

            <p class="switch-auth">
              Sudah punya akun?
              <router-link to="/login" class="switch-link">Masuk di sini</router-link>
            </p>
          </form>
        </div>
      </Transition>
    </div>

  </div>
</template>

<style scoped>
.landing-container {
  display: flex;
  min-height: 100vh;
  background-color: #000000;
  color: #ffffff;
  font-family: system-ui, -apple-system, sans-serif;
  overflow: hidden;
  position: relative;
}

/* --- KIRI: SENSOR TEKS --- */
.hero-left {
  flex: 1.2;
  position: relative;
  display: flex;
  align-items: center;
  padding-left: 8%;
  z-index: 2;
}
.dot-grid {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 20px 20px;
  opacity: 0.5;
  z-index: -1;
}
.vertical-badge {
  position: absolute;
  left: 3%;
  top: 40%;
  transform: rotate(-90deg);
  transform-origin: left top;
}
.badge-text {
  font-size: 0.65rem;
  letter-spacing: 4px;
  color: #0091ff;
  border-left: 1px solid #0091ff;
  padding-left: 8px;
}
.hero-content {
  position: relative;
  max-width: 540px;
}
.icon-placeholder-box {
  width: 32px;
  height: 32px;
  border: 3px solid #ffffff;
  border-radius: 6px;
  margin-bottom: 24px;
}
.main-title {
  font-size: 3rem;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 20px;
  letter-spacing: -0.5px;
}
.text-neon-blue {
  color: #0091ff;
  text-shadow: 0 0 20px rgba(0, 145, 255, 0.3);
}
.sub-title {
  color: #94a3b8;
  font-size: 1rem;
  line-height: 1.6;
  max-width: 420px;
}
.bg-watermark {
  position: absolute;
  bottom: -160px;
  left: 0;
  opacity: 0.05;
  user-select: none;
  pointer-events: none;
}
.bg-watermark h2 {
  font-size: 4.5rem;
  font-weight: 900;
  margin: 0;
  line-height: 1;
  -webkit-text-stroke: 1px #ffffff;
  color: transparent;
}

/* --- KANAN: SENSOR FORM (CLIP-PATH MIRING) --- */
.hero-right {
  flex: 1;
  background-color: #0d0d0d;
  clip-path: polygon(15% 0%, 100% 0%, 100% 100%, 0% 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
  padding-left: 5%;
}

/* --- AUTH CARD --- */
.auth-card-wrapper {
  width: 80%;
  max-width: 420px;
}
.auth-card {
  background: linear-gradient(135deg, #1a1a1a 0%, #262626 100%);
  border: 1px solid #333333;
  border-radius: 16px;
  padding: 40px 32px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
}
.card-title {
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0 0 6px 0;
}
.card-subtitle {
  color: #94a3b8;
  font-size: 0.85rem;
  margin: 0 0 28px 0;
}
.form-group {
  margin-bottom: 16px;
}
.form-label {
  display: block;
  font-size: 0.8rem;
  color: #94a3b8;
  margin-bottom: 6px;
  letter-spacing: 0.3px;
}
.input-wrapper {
  position: relative;
}
.form-input {
  width: 100%;
  background: #0d0d0d;
  border: 1px solid #333333;
  border-radius: 8px;
  padding: 12px 14px;
  color: #ffffff;
  font-size: 0.9rem;
  box-sizing: border-box;
  outline: none;
  transition: border-color 0.2s ease;
}
.form-input:focus {
  border-color: #0091ff;
}
.form-input::placeholder {
  color: #444444;
}
.eye-btn {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  line-height: 1;
}
.form-meta {
  margin-bottom: 20px;
  font-size: 0.8rem;
}
.remember-me {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  color: #94a3b8;
  cursor: pointer;
  line-height: 1.4;
}
.remember-me input {
  margin-top: 2px;
}
.switch-link {
  color: #0091ff;
  text-decoration: none;
}
.switch-link:hover {
  text-decoration: underline;
}
.error-text {
  color: #ff5c5c;
  font-size: 0.8rem;
  margin: -8px 0 16px 0;
}
.success-text {
  color: #22c55e;
  font-size: 0.8rem;
  margin: -8px 0 16px 0;
}
.submit-btn {
  width: 100%;
  background: #0091ff;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 13px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  letter-spacing: 0.3px;
  box-shadow: 0 0 20px rgba(0, 145, 255, 0.3);
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.submit-btn:hover {
  transform: translateY(-1px);
}
.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}
.switch-auth {
  text-align: center;
  font-size: 0.8rem;
  color: #94a3b8;
  margin: 20px 0 0 0;
}

/* --- KODE ANIMASI VUE (FADE IN SLIDE UP) --- */
.slide-up-enter-from {
  opacity: 0;
  transform: translateY(40px);
}
.slide-up-enter-active {
  transition: opacity 0.8s ease-out, transform 0.8s ease-out;
}
.slide-up-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.slide-up-delayed-enter-from {
  opacity: 0;
  transform: translateY(50px);
}
.slide-up-delayed-enter-active {
  transition: opacity 1s ease-out 0.3s, transform 1s ease-out 0.3s;
}
.slide-up-delayed-enter-to {
  opacity: 1;
  transform: translateY(0);
}

/* --- RESPONSIVE --- */
@media (max-width: 900px) {
  .landing-container {
    flex-direction: column;
  }
  .hero-right {
    clip-path: none;
    padding: 60px 5%;
  }
  .vertical-badge {
    display: none;
  }
}
</style>
