<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)
const error = ref('')
const showPassword = ref(false)

const steps = [
  { title: 'Create your account', desc: 'Takes less than a minute.' },
  { title: 'Upload your images', desc: 'Drag & drop or browse files.' },
  { title: 'Share instantly', desc: 'Copy a link, share anywhere.' },
]

async function handleRegister() {
  if (!name.value || !email.value || !password.value) {
    error.value = 'All fields are required.'
    return
  }
  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match.'
    return
  }
  if (password.value.length < 8) {
    error.value = 'Password must be at least 8 characters.'
    return
  }
  isLoading.value = true
  error.value = ''
  try {
    const res = await fetch('https://zxfile.vercel.app/user/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: "include",
      body: JSON.stringify({ username: name.value.trim(), email: email.value.trim(), password: password.value.trim() }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Registration failed.')
    router.push('/login?registered=1')
  } catch (err: any) {
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}

const passwordStrength = computed(() => {
  const p = password.value
  if (!p) return 0
  let s = 0
  if (p.length >= 8) s++
  if (/[A-Z]/.test(p)) s++
  if (/[0-9]/.test(p)) s++
  if (/[^A-Za-z0-9]/.test(p)) s++
  return s
})

const strengthLabel = computed(() => ['', 'Weak', 'Fair', 'Good', 'Strong'][passwordStrength.value])
const strengthColor = computed(() => ['', '#ff4d4f', '#faad14', '#52c41a', '#0091ff'][passwordStrength.value])
</script>

<template>
  <div class="auth-container">
    <div class="dot-grid"></div>

    <div class="auth-left">
      <div class="brand-block">
        <div class="logo-box"></div>
        <h1 class="brand-title">Join Zx<span class="text-neon-blue">file</span></h1>
        <p class="brand-sub">Start hosting your images in seconds.</p>
        <div class="step-list">
          <div class="step" v-for="(s, i) in steps" :key="i">
            <span class="step-num">0{{ i + 1 }}</span>
            <div>
              <div class="step-title">{{ s.title }}</div>
              <div class="step-desc">{{ s.desc }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="auth-right">
      <div class="clip-bg"></div>
      <div class="form-card">
        <div class="form-header">
          <span class="form-eyebrow">CREATE ACCOUNT</span>
          <h2 class="form-title">Get started</h2>
        </div>

        <div class="field-group">
          <label class="field-label">Username</label>
          <input v-model="name" type="text" class="field-input" placeholder="John Doe" autocomplete="name" />
        </div>
        
        <div class="field-group">
          <label class="field-label">Email</label>
          <input v-model="email" type="email" class="field-input" placeholder="you@example.com" autocomplete="email" />
        </div>
        
        <div class="field-group">
          <label class="field-label">Password</label>
          <div class="input-wrapper">
            <input v-model="password" :type="showPassword ? 'text' : 'password'" class="field-input" placeholder="Min. 8 characters" />
            <button class="eye-btn" type="button" @click="showPassword = !showPassword">{{ showPassword ? '🙈' : '👁️' }}</button>
          </div>
          <div v-if="password" class="strength-bar-wrap">
            <div class="strength-track">
              <div class="strength-fill" :style="{ width: (passwordStrength / 4 * 100) + '%', background: strengthColor }"></div>
            </div>
            <span class="strength-label" :style="{ color: strengthColor }">{{ strengthLabel }}</span>
          </div>
        </div>
        
        <div class="field-group">
          <label class="field-label">Confirm Password</label>
          <input v-model="confirmPassword" :type="showPassword ? 'text' : 'password'" class="field-input" placeholder="Repeat password" @keyup.enter="handleRegister" />
        </div>

        <p v-if="error" class="error-msg">{{ error }}</p>

        <button class="btn-primary" @click="handleRegister" :disabled="isLoading">
          <span v-if="isLoading" class="spinner"></span>
          <span v-else>Create Account</span>
        </button>

        <p class="register-link">
          Already have an account?
          <router-link to="/login" class="link-blue">Sign in</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-container {
  display: flex; min-height: 100vh; background: #000; color: #fff;
  font-family: system-ui, -apple-system, sans-serif; overflow: hidden; position: relative;
}
.dot-grid {
  position: absolute; inset: 0;
  background-image: radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px);
  background-size: 20px 20px; opacity: 0.5; pointer-events: none; z-index: 0;
}
.auth-left { flex: 1.1; display: flex; align-items: center; padding-left: 8%; z-index: 2; }
.brand-block { max-width: 400px; }
.logo-box { width: 32px; height: 32px; border: 3px solid #fff; border-radius: 6px; margin-bottom: 24px; }
.brand-title { font-size: 2.4rem; font-weight: 800; margin-bottom: 10px; }
.text-neon-blue { color: #0091ff; text-shadow: 0 0 20px rgba(0,145,255,0.3); }
.brand-sub { color: #94a3b8; font-size: 0.95rem; margin-bottom: 40px; line-height: 1.6; }
.step-list { display: flex; flex-direction: column; gap: 22px; }
.step { display: flex; gap: 16px; align-items: flex-start; }
.step-num { color: #0091ff; font-size: 0.7rem; font-weight: 700; letter-spacing: 1px; padding-top: 3px; min-width: 24px; }
.step-title { color: #fff; font-size: 0.9rem; font-weight: 600; margin-bottom: 2px; }
.step-desc { color: #555; font-size: 0.82rem; }

.auth-right { flex: 1; position: relative; display: flex; justify-content: center; align-items: center; z-index: 1; }
.clip-bg { position: absolute; inset: 0; background: #0d0d0d; clip-path: polygon(15% 0%, 100% 0%, 100% 100%, 0% 100%); }
.form-card { position: relative; z-index: 2; width: 100%; max-width: 360px; padding: 0 5%; }
.form-eyebrow { font-size: 0.65rem; letter-spacing: 4px; color: #0091ff; border-left: 2px solid #0091ff; padding-left: 8px; display: block; margin-bottom: 12px; }
.form-title { font-size: 1.4rem; font-weight: 700; margin-bottom: 24px; }

.field-group { margin-bottom: 14px; }
.field-label { display: block; font-size: 0.8rem; color: #94a3b8; margin-bottom: 6px; }
.input-wrapper { position: relative; }
.field-input {
  width: 100%; background: #111; border: 1px solid #2a2a2a; border-radius: 8px;
  color: #fff; font-size: 0.9rem; padding: 11px 14px; outline: none; box-sizing: border-box;
  transition: border-color 0.2s;
}
.field-input:focus { border-color: #0091ff; }
.field-input::placeholder { color: #444; }
.eye-btn { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; font-size: 0.9rem; color: #fff; }

.strength-bar-wrap { display: flex; align-items: center; gap: 8px; margin-top: 6px; }
.strength-track { flex: 1; height: 3px; background: #222; border-radius: 2px; overflow: hidden; }
.strength-fill { height: 100%; border-radius: 2px; transition: width 0.3s, background 0.3s; }
.strength-label { font-size: 0.75rem; min-width: 36px; }

.error-msg { color: #ff4d4f; font-size: 0.82rem; margin-bottom: 10px; }

.btn-primary {
  width: 100%; background: #0091ff; border: none; border-radius: 8px; color: #fff;
  font-size: 0.95rem; font-weight: 600; padding: 13px; cursor: pointer; margin-top: 4px;
  display: flex; align-items: center; justify-content: center;
  transition: opacity 0.2s, transform 0.1s;
}
.btn-primary:hover:not(:disabled) { opacity: 0.88; }
.btn-primary:active:not(:disabled) { transform: scale(0.98); }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
.spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.register-link { text-align: center; color: #555; font-size: 0.82rem; margin-top: 18px; }
.link-blue { color: #0091ff; text-decoration: none; margin-left: 4px; }
.link-blue:hover { text-decoration: underline; }
</style>