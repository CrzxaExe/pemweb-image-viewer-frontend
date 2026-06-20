<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isLoaded = ref(false)

type TabKey = 'profile' | 'account' | 'notifications' | 'security'
const activeTab = ref<TabKey>('profile')

const fullName = ref('John Doe')
const username = ref('johndoe')
const email = ref('john@example.com')
const bio = ref('Photographer and visual storyteller.')

const currentPassword = ref('')
const newPassword = ref('')
const confirmNewPassword = ref('')

const emailNotifications = ref(true)
const pushNotifications = ref(false)
const weeklyDigest = ref(true)

const isSaving = ref(false)
const saveMessage = ref('')

onMounted(() => {
  isLoaded.value = true
})

function setTab(tab: TabKey) {
  activeTab.value = tab
  saveMessage.value = ''
}

async function handleSave() {
  isSaving.value = true
  saveMessage.value = ''
  try {
    // TODO: ganti dengan panggilan API update profile asli
    await new Promise((resolve) => setTimeout(resolve, 1000))
    saveMessage.value = 'Perubahan berhasil disimpan.'
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div class="settings-container">
    <div class="dot-grid"></div>

    <div class="vertical-badge">
      <span class="badge-text">WHAT A THING</span>
    </div>

    <Transition name="slide-up">
      <div v-if="isLoaded" class="settings-shell">

        <div class="settings-header">
          <div class="icon-placeholder-box"></div>
          <div>
            <h1 class="main-title">
              Account <span class="text-neon-blue">Settings</span>
            </h1>
            <p class="sub-title">Kelola profil, keamanan, dan preferensi notifikasi Anda.</p>
          </div>
        </div>

        <div class="settings-body">

          <!-- SIDEBAR NAV -->
          <aside class="settings-nav">
            <button
              class="nav-item"
              :class="{ active: activeTab === 'profile' }"
              @click="setTab('profile')"
            >
              Profile
            </button>
            <button
              class="nav-item"
              :class="{ active: activeTab === 'account' }"
              @click="setTab('account')"
            >
              Account
            </button>
            <button
              class="nav-item"
              :class="{ active: activeTab === 'notifications' }"
              @click="setTab('notifications')"
            >
              Notifications
            </button>
            <button
              class="nav-item"
              :class="{ active: activeTab === 'security' }"
              @click="setTab('security')"
            >
              Security
            </button>
          </aside>

          <!-- PANEL -->
          <section class="settings-panel">

            <!-- PROFILE TAB -->
            <div v-if="activeTab === 'profile'" class="panel-content">
              <div class="avatar-row">
                <div class="image-placeholder avatar-pic">
                  <span>AVATAR</span>
                </div>
                <div class="avatar-actions">
                  <button class="secondary-btn">Upload Photo</button>
                  <button class="text-btn">Remove</button>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label" for="fullname">Nama Lengkap</label>
                <input id="fullname" v-model="fullName" type="text" class="form-input" />
              </div>

              <div class="form-group">
                <label class="form-label" for="username">Username</label>
                <input id="username" v-model="username" type="text" class="form-input" />
              </div>

              <div class="form-group">
                <label class="form-label" for="bio">Bio</label>
                <textarea id="bio" v-model="bio" class="form-input form-textarea" rows="3"></textarea>
              </div>
            </div>

            <!-- ACCOUNT TAB -->
            <div v-else-if="activeTab === 'account'" class="panel-content">
              <div class="form-group">
                <label class="form-label" for="email">Email</label>
                <input id="email" v-model="email" type="email" class="form-input" />
              </div>

              <div class="form-group">
                <label class="form-label">Bahasa</label>
                <select class="form-input form-select">
                  <option>Bahasa Indonesia</option>
                  <option>English</option>
                </select>
              </div>

              <div class="danger-zone">
                <h3 class="danger-title">Danger Zone</h3>
                <p class="danger-text">Menghapus akun akan menghilangkan semua data secara permanen.</p>
                <button class="danger-btn">Delete Account</button>
              </div>
            </div>

            <!-- NOTIFICATIONS TAB -->
            <div v-else-if="activeTab === 'notifications'" class="panel-content">
              <label class="toggle-row">
                <div>
                  <p class="toggle-title">Email Notifications</p>
                  <p class="toggle-desc">Terima update penting lewat email.</p>
                </div>
                <input v-model="emailNotifications" type="checkbox" class="toggle-input" />
              </label>

              <label class="toggle-row">
                <div>
                  <p class="toggle-title">Push Notifications</p>
                  <p class="toggle-desc">Terima notifikasi langsung di perangkat Anda.</p>
                </div>
                <input v-model="pushNotifications" type="checkbox" class="toggle-input" />
              </label>

              <label class="toggle-row">
                <div>
                  <p class="toggle-title">Weekly Digest</p>
                  <p class="toggle-desc">Ringkasan aktivitas mingguan.</p>
                </div>
                <input v-model="weeklyDigest" type="checkbox" class="toggle-input" />
              </label>
            </div>

            <!-- SECURITY TAB -->
            <div v-else class="panel-content">
              <div class="form-group">
                <label class="form-label" for="current-password">Password Saat Ini</label>
                <input
                  id="current-password"
                  v-model="currentPassword"
                  type="password"
                  class="form-input"
                  placeholder="••••••••"
                />
              </div>

              <div class="form-group">
                <label class="form-label" for="new-password">Password Baru</label>
                <input
                  id="new-password"
                  v-model="newPassword"
                  type="password"
                  class="form-input"
                  placeholder="••••••••"
                />
              </div>

              <div class="form-group">
                <label class="form-label" for="confirm-new-password">Konfirmasi Password Baru</label>
                <input
                  id="confirm-new-password"
                  v-model="confirmNewPassword"
                  type="password"
                  class="form-input"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div class="panel-footer">
              <p v-if="saveMessage" class="save-message">{{ saveMessage }}</p>
              <button class="submit-btn" :disabled="isSaving" @click="handleSave">
                {{ isSaving ? 'Saving...' : 'Save Changes' }}
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
  background-color: #000000;
  color: #ffffff;
  font-family: system-ui, -apple-system, sans-serif;
  position: relative;
  padding: 64px 8%;
  box-sizing: border-box;
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
  z-index: 0;
}
.vertical-badge {
  position: absolute;
  left: 3%;
  top: 40%;
  transform: rotate(-90deg);
  transform-origin: left top;
  z-index: 1;
}
.badge-text {
  font-size: 0.65rem;
  letter-spacing: 4px;
  color: #0091ff;
  border-left: 1px solid #0091ff;
  padding-left: 8px;
}

.settings-shell {
  position: relative;
  z-index: 2;
  max-width: 980px;
  margin: 0 auto;
}

.settings-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 40px;
}
.icon-placeholder-box {
  width: 32px;
  height: 32px;
  border: 3px solid #ffffff;
  border-radius: 6px;
  flex-shrink: 0;
  margin-top: 6px;
}
.main-title {
  font-size: 2.25rem;
  font-weight: 800;
  line-height: 1.2;
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
}
.text-neon-blue {
  color: #0091ff;
  text-shadow: 0 0 20px rgba(0, 145, 255, 0.3);
}
.sub-title {
  color: #94a3b8;
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0;
  max-width: 480px;
}

.settings-body {
  display: flex;
  gap: 32px;
}

/* --- SIDEBAR NAV --- */
.settings-nav {
  flex: 0 0 200px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.nav-item {
  text-align: left;
  background: transparent;
  border: 1px solid transparent;
  color: #94a3b8;
  font-size: 0.9rem;
  padding: 12px 16px;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
}
.nav-item:hover {
  background: #1a1a1a;
  color: #ffffff;
}
.nav-item.active {
  background: #1a1a1a;
  color: #ffffff;
  border-color: #0091ff;
  box-shadow: 0 0 0 1px rgba(0, 145, 255, 0.15) inset;
}

/* --- PANEL --- */
.settings-panel {
  flex: 1;
  background: linear-gradient(135deg, #1a1a1a 0%, #262626 100%);
  border: 1px solid #333333;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
  min-width: 0;
}
.panel-content {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.avatar-row {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 8px;
}
.image-placeholder {
  background: #0d0d0d;
  border: 1px solid #333333;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #444444;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 1px;
}
.avatar-pic {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  flex-shrink: 0;
}
.avatar-actions {
  display: flex;
  gap: 10px;
}
.secondary-btn {
  background: #0d0d0d;
  border: 1px solid #333333;
  color: #ffffff;
  padding: 9px 16px;
  border-radius: 8px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: border-color 0.2s ease;
}
.secondary-btn:hover {
  border-color: #0091ff;
}
.text-btn {
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 0.8rem;
  cursor: pointer;
}
.text-btn:hover {
  color: #ff5c5c;
}

.form-group {
  display: flex;
  flex-direction: column;
}
.form-label {
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
  font-family: inherit;
  transition: border-color 0.2s ease;
}
.form-input:focus {
  border-color: #0091ff;
}
.form-textarea {
  resize: vertical;
}
.form-select {
  appearance: none;
}

.danger-zone {
  margin-top: 12px;
  border: 1px solid rgba(255, 92, 92, 0.3);
  border-radius: 10px;
  padding: 18px;
  background: rgba(255, 92, 92, 0.05);
}
.danger-title {
  color: #ff5c5c;
  font-size: 0.95rem;
  margin: 0 0 6px 0;
}
.danger-text {
  color: #94a3b8;
  font-size: 0.8rem;
  margin: 0 0 14px 0;
  line-height: 1.5;
}
.danger-btn {
  background: transparent;
  border: 1px solid #ff5c5c;
  color: #ff5c5c;
  padding: 9px 16px;
  border-radius: 8px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background 0.2s ease;
}
.danger-btn:hover {
  background: rgba(255, 92, 92, 0.1);
}

.toggle-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #333333;
  cursor: pointer;
}
.toggle-row:last-child {
  border-bottom: none;
}
.toggle-title {
  font-size: 0.9rem;
  margin: 0 0 4px 0;
  color: #ffffff;
}
.toggle-desc {
  font-size: 0.78rem;
  color: #94a3b8;
  margin: 0;
}
.toggle-input {
  width: 18px;
  height: 18px;
  accent-color: #0091ff;
  cursor: pointer;
}

.panel-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 28px;
  padding-top: 20px;
  border-top: 1px solid #333333;
}
.save-message {
  color: #0091ff;
  font-size: 0.8rem;
  margin: 0;
}
.submit-btn {
  background: #0091ff;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 12px 28px;
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

/* --- RESPONSIVE --- */
@media (max-width: 768px) {
  .settings-container {
    padding: 48px 5%;
  }
  .vertical-badge {
    display: none;
  }
  .settings-body {
    flex-direction: column;
  }
  .settings-nav {
    flex-direction: row;
    flex: none;
    overflow-x: auto;
  }
}
</style>
