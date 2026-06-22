<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { api, apiPost } from '@/api'

const auth = useAuthStore()

// --- Types ---
type Image = {
  imageId: string
  title: string
  createAt: string
  imageDriveId: string
  optimizedImageDriveId: string
  context: { author: string; mimetype: string }
}

// --- State ---
const isLoaded = ref(false)
const images = ref<Image[]>([])
const fetchError = ref('')

// Edit modal
const editModalOpen = ref(false)
const editTarget = ref<Image | null>(null)
const editTitle = ref('')
const isSavingEdit = ref(false)
const editError = ref('')

// Delete confirm modal
const deleteModalOpen = ref(false)
const deleteTarget = ref<Image | null>(null)
const isDeletingId = ref<string | null>(null)

// Copy feedback
const copiedId = ref<string | null>(null)

const API_BASE = 'https://zxfile-backend-express.vercel.app'

// --- Fetch ---
const fetchImages = async () => {
  fetchError.value = ''
  try {
    const res = await api(`/image/user/${auth.username}`)
    if (!res.ok) {
      const json = await res.json()
      fetchError.value = json.error ?? 'Gagal mengambil data'
      return
    }
    const json = await res.json()
    images.value = Array.isArray(json) ? json : []
  } catch (e) {
    fetchError.value = 'Tidak dapat terhubung ke server'
  }
}

onMounted(async () => {
  isLoaded.value = true
  await fetchImages()
})

// --- Image URL ---
const imageUrl = (img: Image) => `${API_BASE}/q/${img.imageId}`

// --- Copy link ---
const copyLink = (img: Image) => {
  navigator.clipboard.writeText(imageUrl(img))
  copiedId.value = img.imageId
  setTimeout(() => { copiedId.value = null }, 2000)
}

// --- Edit ---
const openEdit = (img: Image) => {
  editTarget.value = img
  editTitle.value = img.title
  editError.value = ''
  editModalOpen.value = true
}

const closeEdit = () => {
  editModalOpen.value = false
  editTarget.value = null
  editError.value = ''
}

const saveEdit = async () => {
  if (!editTarget.value || !editTitle.value.trim()) return
  isSavingEdit.value = true
  editError.value = ''

  try {
    const res = await api(`/image/update/${editTarget.value.imageId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: editTitle.value.trim() }),
    })

    const json = await res.json()

    if (!res.ok) {
      editError.value = json.error ?? 'Gagal menyimpan'
      return
    }

    // Update locally
    const idx = images.value.findIndex(i => i.imageId === editTarget.value!.imageId)
    if (idx !== -1) images.value[idx]!.title = editTitle.value.trim()

    closeEdit()
  } catch {
    editError.value = 'Terjadi kesalahan jaringan'
  } finally {
    isSavingEdit.value = false
  }
}

// --- Delete ---
const openDelete = (img: Image) => {
  deleteTarget.value = img
  deleteModalOpen.value = true
}

const closeDelete = () => {
  deleteModalOpen.value = false
  deleteTarget.value = null
}

const confirmDelete = async () => {
  if (!deleteTarget.value) return
  isDeletingId.value = deleteTarget.value.imageId

  try {
    const res = await api(`/image/delete/${deleteTarget.value.imageId}`, {
      method: 'DELETE',
    })

    if (res.ok) {
      images.value = images.value.filter(i => i.imageId !== deleteTarget.value!.imageId)
    }
  } catch {
    // silently fail — image stays in list
  } finally {
    isDeletingId.value = null
    closeDelete()
  }
}
</script>

<template>
  <div class="dashboard-container">
    <Transition name="fade-slide">
      <div v-if="isLoaded" class="dashboard-content">

        <!-- Header -->
        <header class="dash-header">
          <div>
            <h1>Your Gallery</h1>
            <p class="text-muted">Kelola seluruh gambar yang telah kamu unggah.</p>
          </div>
          <div class="header-stats">Total: {{ images.length }} Images</div>
        </header>

        <!-- Error -->
        <div v-if="fetchError" class="fetch-error">
          ⚠ {{ fetchError }}
        </div>

        <!-- Empty -->
        <div v-else-if="images.length === 0" class="empty-state">
          <div class="empty-icon">🖼️</div>
          <p>Belum ada gambar. <a href="/upload" class="link-blue">Upload sekarang</a></p>
        </div>

        <!-- Grid -->
        <div v-else class="image-grid">
          <div v-for="img in images" :key="img.imageId" class="image-card">

            <!-- Preview -->
            <div class="card-preview">
              <img :src="imageUrl(img)" :alt="img.title" loading="lazy" />
              <div class="card-overlay">
                <button class="btn-overlay" @click="copyLink(img)">
                  {{ copiedId === img.imageId ? '✓ Disalin!' : '🔗 Copy Link' }}
                </button>
              </div>
            </div>

            <!-- Info -->
            <div class="card-info">
              <p class="img-name" :title="img.title">{{ img.title }}</p>
              <div class="img-meta">
                <span>{{ new Date(img.createAt).toLocaleDateString('id-ID') }}</span>
                <span class="meta-sep">·</span>
                <span>{{ img.context?.mimetype?.split('/')[1]?.toUpperCase() ?? 'IMG' }}</span>
              </div>

              <!-- Actions -->
              <div class="card-actions">
                <button class="btn-edit" @click="openEdit(img)">✏ Edit</button>
                <button
                  class="btn-delete"
                  @click="openDelete(img)"
                  :disabled="isDeletingId === img.imageId"
                >
                  {{ isDeletingId === img.imageId ? '...' : '🗑 Hapus' }}
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </Transition>

    <!-- ===== EDIT MODAL ===== -->
    <Transition name="modal">
      <div v-if="editModalOpen" class="modal-backdrop" @click.self="closeEdit">
        <div class="modal-box">
          <div class="modal-header">
            <h2 class="modal-title">Edit Gambar</h2>
            <button class="modal-close" @click="closeEdit">✕</button>
          </div>

          <!-- Preview mini -->
          <img
            v-if="editTarget"
            :src="imageUrl(editTarget)"
            class="modal-preview"
            :alt="editTarget.title"
          />

          <div class="modal-body">
            <label class="field-label">Judul</label>
            <input
              v-model="editTitle"
              class="field-input"
              type="text"
              placeholder="Judul gambar..."
              maxlength="100"
              @keyup.enter="saveEdit"
            />
            <p v-if="editError" class="modal-error">{{ editError }}</p>
          </div>

          <div class="modal-footer">
            <button class="btn-cancel" @click="closeEdit">Batal</button>
            <button
              class="btn-save"
              :disabled="isSavingEdit || !editTitle.trim()"
              @click="saveEdit"
            >
              <span v-if="isSavingEdit" class="btn-spinner"></span>
              <span v-else>Simpan</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ===== DELETE CONFIRM MODAL ===== -->
    <Transition name="modal">
      <div v-if="deleteModalOpen" class="modal-backdrop" @click.self="closeDelete">
        <div class="modal-box modal-box--danger">
          <div class="modal-header">
            <h2 class="modal-title">Hapus Gambar?</h2>
            <button class="modal-close" @click="closeDelete">✕</button>
          </div>

          <div class="modal-body">
            <p class="delete-msg">
              Gambar <strong>{{ deleteTarget?.title }}</strong> akan dihapus secara permanen dari
              galeri. Tindakan ini tidak bisa dibatalkan.
            </p>
          </div>

          <div class="modal-footer">
            <button class="btn-cancel" @click="closeDelete">Batal</button>
            <button class="btn-danger-confirm" @click="confirmDelete">Ya, Hapus</button>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  background-color: #000;
  color: #fff;
  font-family: system-ui, -apple-system, sans-serif;
  padding: 110px 40px 60px;
  box-sizing: border-box;
}

.dashboard-content { max-width: 1200px; margin: 0 auto; }

/* Header */
.dash-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 36px;
  padding-bottom: 20px;
  border-bottom: 1px solid #111;
}
.dash-header h1 {
  font-size: 2rem;
  font-weight: 800;
  margin: 0 0 6px;
  letter-spacing: -0.5px;
}
.text-muted { color: #64748b; margin: 0; font-size: 0.9rem; }
.header-stats {
  background: rgba(0,145,255,0.08);
  color: #0091ff;
  border: 1px solid rgba(0,145,255,0.2);
  padding: 8px 18px;
  border-radius: 99px;
  font-size: 0.8rem;
  font-weight: 600;
}

/* Empty / error */
.fetch-error {
  color: #ff4a4a;
  background: rgba(255,74,74,0.07);
  border: 1px solid rgba(255,74,74,0.2);
  border-radius: 10px;
  padding: 16px 20px;
  font-size: 0.88rem;
}
.empty-state {
  text-align: center;
  padding: 80px 0;
  color: #334155;
}
.empty-icon { font-size: 3rem; margin-bottom: 12px; }
.link-blue { color: #0091ff; text-decoration: none; }
.link-blue:hover { text-decoration: underline; }

/* Grid */
.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 22px;
}

.image-card {
  background: #070707;
  border: 1px solid #161616;
  border-radius: 14px;
  overflow: hidden;
  transition: transform 0.2s, border-color 0.2s;
}
.image-card:hover {
  transform: translateY(-4px);
  border-color: #2a2a2a;
}

/* Preview */
.card-preview {
  position: relative;
  width: 100%;
  height: 175px;
  background: #0d0d0d;
  overflow: hidden;
}
.card-preview img {
  width: 100%; height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}
.image-card:hover .card-preview img { transform: scale(1.05); }

.card-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
}
.card-preview:hover .card-overlay { opacity: 1; }

.btn-overlay {
  background: #fff;
  color: #000;
  border: none;
  padding: 7px 14px;
  border-radius: 8px;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.1s;
}
.btn-overlay:hover { transform: scale(1.05); }

/* Card info */
.card-info { padding: 14px; }
.img-name {
  font-weight: 600;
  font-size: 0.9rem;
  margin: 0 0 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.img-meta {
  display: flex;
  gap: 6px;
  font-size: 0.72rem;
  color: #475569;
  margin-bottom: 12px;
}
.meta-sep { opacity: 0.4; }

.card-actions {
  display: flex;
  gap: 8px;
}
.btn-edit {
  flex: 1;
  background: transparent;
  border: 1px solid #1e3a5f;
  color: #0091ff;
  padding: 7px 0;
  border-radius: 8px;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
}
.btn-edit:hover {
  background: rgba(0,145,255,0.08);
  border-color: #0091ff;
}
.btn-delete {
  flex: 1;
  background: transparent;
  border: 1px solid rgba(255,74,74,0.2);
  color: #ff4a4a;
  padding: 7px 0;
  border-radius: 8px;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
}
.btn-delete:hover:not(:disabled) {
  background: rgba(255,74,74,0.08);
  border-color: #ff4a4a;
}
.btn-delete:disabled { opacity: 0.5; cursor: not-allowed; }

/* ===== MODALS ===== */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 20px;
  backdrop-filter: blur(4px);
}

.modal-box {
  background: #0d0d0d;
  border: 1px solid #222;
  border-radius: 16px;
  width: 100%;
  max-width: 440px;
  overflow: hidden;
  box-shadow: 0 24px 60px rgba(0,0,0,0.8);
}
.modal-box--danger { border-color: rgba(255,74,74,0.25); }

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px 16px;
  border-bottom: 1px solid #1a1a1a;
}
.modal-title {
  font-size: 1rem;
  font-weight: 700;
  margin: 0;
}
.modal-close {
  background: none;
  border: none;
  color: #555;
  font-size: 1rem;
  cursor: pointer;
  padding: 4px;
  line-height: 1;
  transition: color 0.2s;
}
.modal-close:hover { color: #fff; }

.modal-preview {
  width: 100%;
  height: 160px;
  object-fit: cover;
  display: block;
  border-bottom: 1px solid #111;
}

.modal-body {
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.field-label {
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}
.field-input {
  background: #111;
  border: 1px solid #222;
  border-radius: 8px;
  color: #fff;
  font-size: 0.9rem;
  padding: 10px 14px;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
  width: 100%;
}
.field-input:focus { border-color: #0091ff; }
.modal-error {
  font-size: 0.78rem;
  color: #ff4a4a;
  margin: 0;
}

.delete-msg {
  color: #94a3b8;
  font-size: 0.88rem;
  line-height: 1.6;
  margin: 0;
}
.delete-msg strong { color: #fff; }

.modal-footer {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  padding: 16px 24px;
  border-top: 1px solid #1a1a1a;
}
.btn-cancel {
  background: transparent;
  border: 1px solid #222;
  color: #64748b;
  border-radius: 8px;
  padding: 9px 18px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s;
}
.btn-cancel:hover { border-color: #444; color: #fff; }

.btn-save {
  background: #0091ff;
  border: none;
  border-radius: 8px;
  color: #fff;
  font-size: 0.85rem;
  font-weight: 700;
  padding: 9px 20px;
  cursor: pointer;
  transition: opacity 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
}
.btn-save:hover:not(:disabled) { opacity: 0.85; }
.btn-save:disabled { opacity: 0.4; cursor: not-allowed; }

.btn-danger-confirm {
  background: #ff4a4a;
  border: none;
  border-radius: 8px;
  color: #fff;
  font-size: 0.85rem;
  font-weight: 700;
  padding: 9px 20px;
  cursor: pointer;
  transition: opacity 0.2s;
}
.btn-danger-confirm:hover { opacity: 0.85; }

.btn-spinner {
  width: 13px; height: 13px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Modal transition */
.modal-enter-from, .modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

/* Page transition */
.fade-slide-enter-from { opacity: 0; transform: translateY(24px); }
.fade-slide-enter-active { transition: opacity 0.5s ease, transform 0.5s ease; }
.fade-slide-enter-to { opacity: 1; transform: translateY(0); }

@media (max-width: 600px) {
  .dashboard-container { padding: 100px 16px 40px; }
  .dash-header { flex-direction: column; align-items: flex-start; gap: 12px; }
}
</style>