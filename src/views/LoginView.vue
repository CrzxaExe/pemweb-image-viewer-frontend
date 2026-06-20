<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isLoaded = ref(false)
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const isSubmitting = ref(false)
const errorMessage = ref('')

onMounted(() => {
  // Memicu animasi setelah komponen berhasil dimuat di browser
  isLoaded.value = true
})

function togglePassword() {
  showPassword.value = !showPassword.value
}

async function handleSubmit() {
  errorMessage.value = ''

  if (!email.value || !password.value) {
    errorMessage.value = 'Email dan password wajib diisi.'
    return
  }

  isSubmitting.value = true
  try {
    // TODO: ganti dengan panggilan API login asli
    await new Promise((resolve) => setTimeout(resolve, 1200))
    console.log('Login submitted:', { email: email.value })
  } catch (err) {
    errorMessage.value = 'Gagal masuk. Periksa kembali email dan password Anda.'
  } finally {
    isSubmitting.value = false
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
            Welcome Back <br />
            to <span class="text-neon-blue">Everyone</span>
          </h1>

          <p class="sub-title">
            Masuk untuk melanjutkan berbagi gambar Anda ke semua orang, kapan saja.
          </p>

          <div class="bg-watermark">
            <h2>SIGN IN</h2>
            <h2>SIGN IN</h2>
          </div>
        </div>
      </Transition>
    </div>

    <div class="hero-right">
      <Transition name="slide-up-delayed">
        <div v-if="isLoaded" class="auth-card-wrapper">
          <form class="auth-card" @submit.prevent="handleSubmit">
            <h2 class="card-title">Sign In</h2>
            <p class="card-subtitle">Masukkan detail akun Anda di bawah ini.</p>

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
              <div class="password-field">
                <input
                  id="password"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  class="form-input"
                  placeholder="••••••••"
                  autocomplete="current-password"
                />
                <button
                  type="button"
                  class="toggle-visibility"
                  @click="togglePassword"
                >
                  {{ showPassword ? 'Hide' : 'Show' }}
                </button>
              </div>
            </div>

            <div class="form-meta">
              <label class="remember-me">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <a href="#" class="forgot-link">Forgot password?</a>
            </div>

            <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>

            <button type="submit" class="submit-btn" :disabled="isSubmitting">
              {{ isSubmitting ? 'Signing in...' : 'Sign In' }}
            </button>

            <p class="switch-auth">
              Belum punya akun?
              <a href="#" class="switch-link">Daftar di sini</a>
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
  margin-bottom: 18px;
}
.form-label {
  display: block;
  font-size: 0.8rem;
  color: #94a3b8;
  margin-bottom: 6px;
  letter-spacing: 0.3px;
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
.password-field {
  position: relative;
  display: flex;
  align-items: center;
}
.toggle-visibility {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  color: #0091ff;
  font-size: 0.75rem;
  cursor: pointer;
  letter-spacing: 0.5px;
}
.form-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 22px;
  font-size: 0.8rem;
}
.remember-me {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #94a3b8;
  cursor: pointer;
}
.forgot-link,
.switch-link {
  color: #0091ff;
  text-decoration: none;
}
.forgot-link:hover,
.switch-link:hover {
  text-decoration: underline;
}
.error-text {
  color: #ff5c5c;
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
