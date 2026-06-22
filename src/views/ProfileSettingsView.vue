<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { api } from '@/api'

const auth = useAuthStore()

// --- State ---
const isLoaded = ref(false)
type TabKey = 'profile' | 'security'
const activeTab = ref<TabKey>('profile')

// Profile fields (yang didukung backend: displayName, avatarUrl)
const displayName = ref('')
const avatarUrl = ref('')

// Security (password update)
const newPassword = ref('')
const confirmPassword = ref('')
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

// Status
const isSaving = ref(false)
const saveMsg = ref<{ type: 'success' | 'error'; text: string } | null>(null)

// Fetch current user data on mount
const fetchProfile = async () => {
  if (!auth.username) return
  try {
    const res = await api(`/user/${auth.username}`)
    if (res.ok) {
      const json = await res.json()
      // API returns array (regex search); find exact match
      const user = Array.isArray(json)
        ? json.find((u: any) => u.username === auth.username) ?? json[0]
        : json

      if (user) {
        displayName.value = user.displayName ?? ''
        avatarUrl.value = user.avatarUrl ?? ''
      }
    }
  } catch {
    // tidak tampilkan error — field kosong saja
  }
}

onMounted(async () => {
  await fetchProfile()
  isLoaded.value = true
})

const setTab = (tab: TabKey) => {
  activeTab.value = tab
  saveMsg.value = null
}

// --- Save profile (displayName + avatarUrl) ---
const saveProfile = async () => {
  if (!auth.userId) {
    saveMsg.value = { type: 'error', text: 'User ID tidak ditemukan. Coba login ulang.' }
    return
  }

  isSaving.value = true
  saveMsg.value = null

  try {
    const res = await api(`/user/${auth.userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        displayName: displayName.value.trim() || undefined,
        avatarUrl: avatarUrl.value.trim() || undefined,
      }),
    })

    const json = await res.json()

    if (!res.ok) {
      saveMsg.value = { type: 'error', text: json.error ?? 'Gagal menyimpan profil' }
    } else {
      saveMsg.value = { type: 'success', text: 'Profil berhasil diperbarui.' }
    }
  } catch {
    saveMsg.value = { type: 'error', text: 'Gagal terhubung ke server.' }
  } finally {
    isSaving.value = false
  }
}

// --- Save password ---
const savePassword = async () => {
  if (!newPassword.value) {
    saveMsg.value = { type: 'error', text: 'Password baru tidak boleh kosong.' }
    return
  }
  if (newPassword.value.length < 8) {
    saveMsg.value = { type: 'error', text: 'Password minimal 8 karakter.' }
    return
  }
  if (newPassword.value !== confirmPassword.value) {
    saveMsg.value = { type: 'error', text: 'Konfirmasi password tidak cocok.' }
    return
  }
  if (!auth.userId) {
    saveMsg.value = { type: 'error', text: 'User ID tidak ditemukan. Coba login ulang.' }
    return
  }

  isSaving.value = true
  saveMsg.value = null

  try {
    const res = await api(`/user/${auth.userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: newPassword.value }),
    })

    const json = await res.json()

    if (!res.ok) {
      saveMsg.value = { type: 'error', text: json.error ?? 'Gagal memperbarui password' }
    } else {
      saveMsg.value = { type: 'success', text: 'Password berhasil diperbarui.' }
      newPassword.value = ''
      confirmPassword.value = ''
    }
  } catch {
    saveMsg.value = { type: 'error', text: 'Gagal terhubung ke server.' }
  } finally {
    isSaving.value = false
  }
}

const handleSave = () => {
  saveMsg.value = null
  if (activeTab.value === 'profile') saveProfile()
  else savePassword()
}
</script>

<template>
  <div class="settings-container">
    <div class="dot-grid"></div>
    <div class="vertical-badge"><span class="badge-text">ACCOUNT SETTINGS</span></div>

    <Transition name="slide-up">
      <div v-if="isLoaded" class="settings-shell">

        <!-- Header -->
        <div class="settings-header">
          <div class="icon-box"></div>
          <div>
            <h1 class="main-title">Account <span class="text-blue">Settings</span></h1>
            <p class="sub-title">Kelola profil dan keamanan akun kamu.</p>
          </div>
        </div>

        <!-- User pill -->
        <div class="user-pill">
          <div class="user-avatar">{{ auth.username?.[0]?.toUpperCase() ?? '?' }}</div>
          <div>
            <p class="user-name">{{ displayName || auth.username }}</p>
            <p class="user-sub">@{{ auth.username }}</p>
          </div>
        </div>

        <div class="settings-body">

          <!-- Sidebar nav -->
          <aside class="settings-nav">
            <button
              class="nav-item"
              :class="{ active: activeTab === 'profile' }"
              @click="setTab('profile')"
            >👤 Profil</button>
            <button
              class="nav-item"
              :class="{ active: activeTab === 'security' }"
              @click="setTab('security')"
            >🔒 Keamanan</button>
          </aside>

          <!-- Panel -->
          <section class="settings-panel">

            <!-- PROFILE TAB -->
            <div v-if="activeTab === 'profile'" class="panel-content">
              <div class="panel-section-title">Informasi Profil</div>

              <!-- Avatar preview -->
              <div class="avatar-row">
                <div class="avatar-circle">
                  <img
                    v-if="avatarUrl"
                    :src="avatarUrl"
                    class="avatar-img"
                    alt="avatar"
                    @error="avatarUrl = ''"
                  />
                  <span v-else class="avatar-initial">{{ auth.username?.[0]?.toUpperCase() ?? '?' }}</span>
                </div>
                <div class="avatar-info">
                  <p class="avatar-hint">Masukkan URL gambar untuk foto profil</p>
                  <p class="avatar-sub">Format: JPEG, PNG, WebP</p>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label" for="avatarUrl">Avatar URL</label>
                <input
                  id="avatarUrl"
                  v-model="avatarUrl"
                  type="url"
                  class="form-input"
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>

              <div class="form-group">
                <label class="form-label" for="displayName">Display Name</label>
                <input
                  id="displayName"
                  v-model="displayName"
                  type="text"
                  class="form-input"
                  placeholder="Nama tampilan kamu..."
                  maxlength="50"
                />
                <p class="field-hint">Nama yang ditampilkan ke pengguna lain.</p>
              </div>

              <!-- Read-only fields -->
              <div class="readonly-group">
                <div class="form-group">
                  <label class="form-label">Username</label>
                  <div class="form-readonly">{{ auth.username }}</div>
                  <p class="field-hint">Username tidak dapat diubah.</p>
                </div>
              </div>
            </div>

            <!-- SECURITY TAB -->
            <div v-else class="panel-content">
              <div class="panel-section-title">Ganti Password</div>

              <div class="form-group">
                <label class="form-label" for="new-password">Password Baru</label>
                <div class="input-wrapper">
                  <input
                    id="new-password"
                    v-model="newPassword"
                    :type="showNewPassword ? 'text' : 'password'"
                    class="form-input"
                    placeholder="Minimal 8 karakter"
                    autocomplete="new-password"
                  />
                  <button class="eye-btn" type="button" @click="showNewPassword = !showNewPassword">
                    {{ showNewPassword ? '🙈' : '👁️' }}
                  </button>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label" for="confirm-password">Konfirmasi Password Baru</label>
                <div class="input-wrapper">
                  <input
                    id="confirm-password"
                    v-model="confirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    class="form-input"
                    placeholder="Ulangi password baru"
                    autocomplete="new-password"
                  />
                  <button class="eye-btn" type="button" @click="showConfirmPassword = !showConfirmPassword">
                    {{ showConfirmPassword ? '🙈' : '👁️' }}
                  </button>
                </div>
              </div>

              <!-- Password match indicator -->
              <div
                v-if="newPassword && confirmPassword"
                class="password-match"
                :class="newPassword === confirmPassword ? 'match' : 'no-match'"
              >
                {{ newPassword === confirmPassword ? '✓ Password cocok' : '✗ Password tidak cocok' }}
              </div>

              <div class="security-note">
                <span class="note-icon">ℹ</span>
                Password baru minimal 8 karakter. Kamu tidak perlu memasukkan password lama.
              </div>
            </div>

            <!-- Footer -->
            <div class="panel-footer">
              <Transition name="msg-fade">
                <p
                  v-if="saveMsg"
                  class="save-message"
                  :class="saveMsg.type"
                >{{ saveMsg.text }}</p>
              </Transition>
              <button
                class="submit-btn"
                :disabled="isSaving"
                @click="handleSave"
              >
                <span v-if="isSaving" class="btn-spinner"></span>
                <span v-else>Simpan Perubahan</span>
              </button>
            </div>

          </section>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.settings-container {
  min-height: 100vh;
  background: #000;
  color: #fff;
  font-family: system-ui, -apple-system, sans-serif;
  position: relative;
  padding: 80px 8% 60px;
  box-sizing: border-box;
}

.dot-grid {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px);
  background-size: 22px 22px;
  pointer-events: none;
  z-index: 0;
}

.vertical-badge {
  position: absolute;
  left: 2.5%;
  top: 42%;
  transform: rotate(-90deg);
  transform-origin: left top;
  z-index: 1;
}
.badge-text {
  font-size: 0.6rem;
  letter-spacing: 4px;
  color: #0091ff;
  border-left: 1px solid #0091ff;
  padding-left: 8px;
}

.settings-shell {
  position: relative;
  z-index: 2;
  max-width: 900px;
  margin: 0 auto;
}

/* Header */
.settings-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 24px;
}
.icon-box {
  width: 30px; height: 30px;
  border: 3px solid #fff;
  border-radius: 6px;
  flex-shrink: 0;
}
.main-title {
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.5px;
  margin: 0 0 4px;
}
.text-blue {
  color: #0091ff;
  text-shadow: 0 0 20px rgba(0,145,255,0.3);
}
.sub-title { color: #64748b; margin: 0; font-size: 0.88rem; }

/* User pill */
.user-pill {
  display: flex;
  align-items: center;
  gap: 14px;
  background: #0a0a0a;
  border: 1px solid #1a1a1a;
  border-radius: 12px;
  padding: 14px 18px;
  margin-bottom: 28px;
}
.user-avatar {
  width: 40px; height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0091ff, #7c3aed);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1rem;
  flex-shrink: 0;
}
.user-name { font-weight: 600; font-size: 0.9rem; margin: 0; }
.user-sub { color: #475569; font-size: 0.78rem; margin: 0; }

/* Layout */
.settings-body { display: flex; gap: 24px; }

/* Nav */
.settings-nav {
  flex: 0 0 180px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.nav-item {
  text-align: left;
  background: transparent;
  border: 1px solid transparent;
  color: #64748b;
  font-size: 0.88rem;
  padding: 11px 14px;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, border-color 0.2s;
}
.nav-item:hover { background: #111; color: #fff; }
.nav-item.active {
  background: #111;
  color: #fff;
  border-color: rgba(0,145,255,0.35);
}

/* Panel */
.settings-panel {
  flex: 1;
  background: linear-gradient(135deg, #0d0d0d 0%, #141414 100%);
  border: 1px solid #1f1f1f;
  border-radius: 16px;
  padding: 28px;
  min-width: 0;
}

.panel-content { display: flex; flex-direction: column; gap: 20px; }
.panel-section-title {
  font-size: 0.78rem;
  color: #0091ff;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding-bottom: 12px;
  border-bottom: 1px solid #1a1a1a;
}

/* Avatar row */
.avatar-row {
  display: flex;
  align-items: center;
  gap: 16px;
}
.avatar-circle {
  width: 64px; height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1a2a3a, #0d1a2a);
  border: 2px solid #1f1f1f;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
}
.avatar-img { width: 100%; height: 100%; object-fit: cover; }
.avatar-initial { font-size: 1.4rem; font-weight: 700; color: #0091ff; }
.avatar-info {}
.avatar-hint { font-size: 0.82rem; color: #fff; margin: 0 0 3px; }
.avatar-sub { font-size: 0.72rem; color: #475569; margin: 0; }

/* Forms */
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-label {
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}
.form-input {
  width: 100%;
  background: #0a0a0a;
  border: 1px solid #1f1f1f;
  border-radius: 8px;
  padding: 11px 14px;
  color: #fff;
  font-size: 0.9rem;
  box-sizing: border-box;
  outline: none;
  font-family: inherit;
  transition: border-color 0.2s;
}
.form-input:focus { border-color: #0091ff; }
.form-input::placeholder { color: #2a2a2a; }
.field-hint { font-size: 0.72rem; color: #334155; margin: 0; }
.form-readonly {
  background: #070707;
  border: 1px solid #141414;
  border-radius: 8px;
  padding: 11px 14px;
  color: #475569;
  font-size: 0.88rem;
  font-family: monospace;
}

.readonly-group { opacity: 0.7; }

.input-wrapper { position: relative; }
.eye-btn {
  position: absolute;
  right: 12px; top: 50%;
  transform: translateY(-50%);
  background: none; border: none;
  cursor: pointer; font-size: 0.9rem; line-height: 1;
}

.password-match {
  font-size: 0.78rem;
  padding: 6px 12px;
  border-radius: 6px;
}
.password-match.match { color: #22c55e; background: rgba(34,197,94,0.08); }
.password-match.no-match { color: #ff4a4a; background: rgba(255,74,74,0.08); }

.security-note {
  display: flex;
  gap: 8px;
  background: rgba(0,145,255,0.05);
  border: 1px solid rgba(0,145,255,0.12);
  border-radius: 8px;
  padding: 12px 14px;
  font-size: 0.8rem;
  color: #64748b;
  line-height: 1.5;
}
.note-icon { color: #0091ff; flex-shrink: 0; }

/* Footer */
.panel-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 14px;
  margin-top: 28px;
  padding-top: 20px;
  border-top: 1px solid #1a1a1a;
}
.save-message {
  font-size: 0.82rem;
  margin: 0;
}
.save-message.success { color: #22c55e; }
.save-message.error { color: #ff4a4a; }

.submit-btn {
  background: #0091ff;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 11px 26px;
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.1s;
  display: flex;
  align-items: center;
  gap: 8px;
}
.submit-btn:hover:not(:disabled) { opacity: 0.85; transform: translateY(-1px); }
.submit-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

.btn-spinner {
  width: 14px; height: 14px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Transitions */
.slide-up-enter-from { opacity: 0; transform: translateY(36px); }
.slide-up-enter-active { transition: opacity 0.7s ease, transform 0.7s ease; }
.slide-up-enter-to { opacity: 1; transform: translateY(0); }

.msg-fade-enter-from, .msg-fade-leave-to { opacity: 0; transform: translateY(4px); }
.msg-fade-enter-active, .msg-fade-leave-active { transition: opacity 0.25s, transform 0.25s; }

/* Responsive */
@media (max-width: 768px) {
  .settings-container { padding: 80px 5% 40px; }
  .vertical-badge { display: none; }
  .settings-body { flex-direction: column; }
  .settings-nav { flex-direction: row; flex: none; gap: 6px; }
}
</style>
