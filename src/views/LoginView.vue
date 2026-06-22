<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const showPassword = ref(false)

async function handleLogin() {
  if (!email.value || !password.value) {
    auth.error = 'Please fill in all fields.'
    return
  }

  auth.loading = true
  auth.error = ''

  try {
    const res = await fetch('https://zxfile.vercel.app/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email: email.value, password: password.value }),
    })

    const json = await res.json()

    if (json.success || res.ok) {
      auth.setLoggedIn(json.username ?? '', json.userId ?? '')   // simpan username + userId
      router.push('/dashboard')
    } else {
      auth.error = json.message || json.error || 'Email atau password salah'
    }
  } catch {
    auth.error = 'Gagal terhubung ke server. Coba lagi.'
  } finally {
    auth.loading = false
  }
}


const features = [
  'Store unlimited images in the cloud',
  'Share via direct link instantly',
  'Organize with albums & tags',
  'Backed by Google Drive storage',
]
</script>

<template>
  <div class="auth-container">
    <div class="dot-grid"></div>

    <div class="auth-left">
      <div class="brand-block">
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
    </div>

    <div class="auth-right">
      <div class="clip-bg"></div>
      <div class="form-card">
        <div class="form-header">
          <span class="form-eyebrow">WELCOME BACK</span>
          <h2 class="form-title">Sign in to your account</h2>
        </div>

        <div class="field-group">
          <label class="field-label">Username</label>
          <input
            v-model="email"
            type="email"
            class="field-input"
            placeholder="email kamu"
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

        <p v-if="auth.error" class="error-msg">{{ auth.error }}</p>

        <button class="btn-primary" @click="handleLogin" :disabled="auth.loading">
          <span v-if="auth.loading" class="spinner"></span>
          <span v-else>Sign In</span>
        </button>

        <p class="register-link">
          Don't have an account?
          <router-link to="/register" class="link-blue">Create one</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

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
</style>