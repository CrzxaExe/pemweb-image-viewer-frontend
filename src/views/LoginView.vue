<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isLoaded = ref(false)
const email = ref('')
const password = ref('')
const isLoading = ref(false)
const error = ref('')
const showPassword = ref(false)

onMounted(() => {
  isLoaded.value = true
})

async function handleLogin() {
  if (!email.value || !password.value) {
    error.value = 'Please fill in all fields.'
    return
  }
  isLoading.value = true
  error.value = ''
  try {
    const res = await fetch("https://zxfile-backend-express.vercel.app/auth/login", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json' // Tells the server what format you expect back
      },
      body: JSON.stringify({ email: email.value, password: password.value })
    });
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Login failed.')
    localStorage.setItem('token', data.token)
    router.push('/dashboard')
  } catch (err: any) {
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}

function handleGoogleLogin() {
  window.location.href = '/api/auth/google'
}
</script>

<template>
  <div class="auth-container">
    <div class="dot-grid"></div>

    <!-- Left branding panel -->
    <div class="auth-left">
      <Transition name="slide-up">
        <div v-if="isLoaded" class="brand-block">
          <div class="logo-box"></div>
          <h1 class="brand-title">
            Pix<span class="text-neon-blue">Nest</span>
          </h1>
          <p class="brand-sub">Your images. Everywhere. Always.</p>

          <ul class="feature-list">
            <li v-for="f in features" :key="f">
              <span class="check-icon">&#10003;</span>
              {{ f }}
            </li>
          </ul>
        </div>
      </Transition>
    </div>

    <!-- Right form panel -->
    <div class="auth-right">
      <div class="clip-bg"></div>
      <Transition name="slide-up-delayed">
        <div v-if="isLoaded" class="form-card">
          <div class="form-header">
            <span class="form-eyebrow">WELCOME BACK</span>
            <h2 class="form-title">Sign in to your account</h2>
          </div>

          <!-- Google OAuth -->
          <button class="btn-google" @click="handleGoogleLogin" type="button">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div class="divider"><span>or</span></div>

          <!-- Form -->
          <div class="field-group">
            <label class="field-label">Email</label>
            <input
              v-model="email"
              type="email"
              class="field-input"
              placeholder="you@example.com"
              autocomplete="email"
              @keyup.enter="handleLogin"
            />
          </div>

          <div class="field-group">
            <label class="field-label">
              Password
              <a href="#" class="forgot-link">Forgot password?</a>
            </label>
            <div class="input-wrapper">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                class="field-input"
                placeholder="••••••••"
                autocomplete="current-password"
                @keyup.enter="handleLogin"
              />
              <button class="eye-btn" type="button" @click="showPassword = !showPassword" :aria-label="showPassword ? 'Hide password' : 'Show password'">
                {{ showPassword ? '🙈' : '👁️' }}
              </button>
            </div>
          </div>

          <p v-if="error" class="error-msg">{{ error }}</p>

          <button class="btn-primary" @click="handleLogin" :disabled="isLoading">
            <span v-if="isLoading" class="spinner"></span>
            <span v-else>Sign In</span>
          </button>

          <p class="register-link">
            Don't have an account?
            <router-link to="/register" class="link-blue">Create one</router-link>
          </p>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script lang="ts">
const features = [
  'Store unlimited images in the cloud',
  'Share via direct link instantly',
  'Organize with albums & tags',
  'Backed by Google Drive storage',
]
</script>

<style scoped>
.auth-container {
  display: flex;
  min-height: 100vh;
  background-color: #000000;
  color: #ffffff;
  font-family: system-ui, -apple-system, sans-serif;
  overflow: hidden;
  position: relative;
}

.dot-grid {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px);
  background-size: 20px 20px;
  opacity: 0.5;
  pointer-events: none;
  z-index: 0;
}

/* --- LEFT BRAND --- */
.auth-left {
  flex: 1.1;
  display: flex;
  align-items: center;
  padding-left: 8%;
  z-index: 2;
}
.brand-block { max-width: 420px; }
.logo-box {
  width: 32px; height: 32px;
  border: 3px solid #fff;
  border-radius: 6px;
  margin-bottom: 24px;
}
.brand-title {
  font-size: 2.6rem;
  font-weight: 800;
  letter-spacing: -0.5px;
  margin-bottom: 8px;
}
.text-neon-blue {
  color: #0091ff;
  text-shadow: 0 0 20px rgba(0,145,255,0.3);
}
.brand-sub {
  color: #94a3b8;
  font-size: 1rem;
  margin-bottom: 40px;
}
.feature-list {
  list-style: none;
  padding: 0; margin: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.feature-list li {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #94a3b8;
  font-size: 0.9rem;
}
.check-icon {
  color: #0091ff;
  font-weight: 700;
  font-size: 0.85rem;
}

/* --- RIGHT FORM --- */
.auth-right {
  flex: 1;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
}
.clip-bg {
  position: absolute;
  inset: 0;
  background-color: #0d0d0d;
  clip-path: polygon(15% 0%, 100% 0%, 100% 100%, 0% 100%);
}
.form-card {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 360px;
  padding: 0 5%;
}
.form-eyebrow {
  font-size: 0.65rem;
  letter-spacing: 4px;
  color: #0091ff;
  border-left: 2px solid #0091ff;
  padding-left: 8px;
  display: block;
  margin-bottom: 12px;
}
.form-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 28px;
}

/* Google button */
.btn-google {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 8px;
  color: #fff;
  font-size: 0.9rem;
  font-weight: 500;
  padding: 12px 16px;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
}
.btn-google:hover { background: #222; border-color: #444; }

.divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 20px 0;
  color: #444;
  font-size: 0.8rem;
}
.divider::before, .divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #222;
}

/* Fields */
.field-group { margin-bottom: 16px; }
.field-label {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #94a3b8;
  margin-bottom: 6px;
}
.forgot-link {
  color: #0091ff;
  text-decoration: none;
  font-size: 0.78rem;
}
.forgot-link:hover { text-decoration: underline; }
.input-wrapper { position: relative; }
.field-input {
  width: 100%;
  background: #111;
  border: 1px solid #2a2a2a;
  border-radius: 8px;
  color: #fff;
  font-size: 0.9rem;
  padding: 11px 14px;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s;
}
.field-input:focus { border-color: #0091ff; }
.field-input::placeholder { color: #444; }
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

.error-msg {
  color: #ff4d4f;
  font-size: 0.82rem;
  margin-bottom: 12px;
}

.btn-primary {
  width: 100%;
  background: #0091ff;
  border: none;
  border-radius: 8px;
  color: #fff;
  font-size: 0.95rem;
  font-weight: 600;
  padding: 13px;
  cursor: pointer;
  margin-top: 4px;
  transition: opacity 0.2s, transform 0.1s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn-primary:hover:not(:disabled) { opacity: 0.88; }
.btn-primary:active:not(:disabled) { transform: scale(0.98); }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

.spinner {
  width: 16px; height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.register-link {
  text-align: center;
  color: #555;
  font-size: 0.82rem;
  margin-top: 20px;
}
.link-blue { color: #0091ff; text-decoration: none; margin-left: 4px; }
.link-blue:hover { text-decoration: underline; }

/* Animations */
.slide-up-enter-from { opacity: 0; transform: translateY(40px); }
.slide-up-enter-active { transition: opacity 0.8s ease-out, transform 0.8s ease-out; }
.slide-up-enter-to { opacity: 1; transform: translateY(0); }
.slide-up-delayed-enter-from { opacity: 0; transform: translateY(50px); }
.slide-up-delayed-enter-active { transition: opacity 1s ease-out 0.3s, transform 1s ease-out 0.3s; }
.slide-up-delayed-enter-to { opacity: 1; transform: translateY(0); }
</style>
