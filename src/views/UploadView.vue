<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { apiUpload, apiPost } from '@/api'

const router = useRouter()
const auth = useAuthStore()

// --- State ---
const title = ref('')
const selectedFile = ref<File | null>(null)
const previewUrl = ref<string | null>(null)

// Drive upload result
const driveImageId = ref<string | null>(null)
const driveOptimizedId = ref<string | null>(null)

// UI states
type UploadPhase = 'idle' | 'uploading-drive' | 'drive-ready' | 'submitting' | 'done' | 'error'
const phase = ref<UploadPhase>('idle')
const errorMsg = ref('')
const isDragging = ref(false)

// --- Computed ---
const canSubmit = computed(() =>
  phase.value === 'drive-ready' &&
  title.value.trim().length > 0 &&
  driveImageId.value !== null &&
  driveOptimizedId.value !== null
)

const statusText = computed(() => {
  switch (phase.value) {
    case 'idle': return 'Select or drag and drop an image to get started'
    case 'uploading-drive': return 'Uploading to image to server...'
    case 'drive-ready': return 'Image ready.'
    case 'submitting': return 'Saving Image...'
    case 'done': return 'Upload successful! 🎉'
    case 'error': return errorMsg.value || 'An error occurred'
    default: return ''
  }
})

// --- Handlers ---
function onDragOver(e: DragEvent) {
  e.preventDefault()
  isDragging.value = true
}
function onDragLeave() {
  isDragging.value = false
}
function onDrop(e: DragEvent) {
  e.preventDefault()
  isDragging.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) processFile(file)
}
function onFileInput(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) processFile(file)
}

function processFile(file: File) {
  if (!file.type.startsWith('image/')) {
    errorMsg.value = 'Only image files are allowed'
    phase.value = 'error'
    return
  }

  selectedFile.value = file

  // Show local preview immediately
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  previewUrl.value = URL.createObjectURL(file)

  // Reset drive IDs & start uploading immediately
  driveImageId.value = null
  driveOptimizedId.value = null
  uploadToDrive(file)
}

async function uploadToDrive(file: File) {
  phase.value = 'uploading-drive'
  errorMsg.value = ''

  try {
    const formData = new FormData()
    formData.append('files', file)  // backend expects field name "files"

    const res = await apiUpload('/drive/upload', formData)
    const json = await res.json()

    if (!res.ok) {
      throw new Error(json.error ?? 'Upload image to server error')
    }

    // Response: { files: [{ original: { id: "..." }, optimized: { id: "..." } }] }
    const uploaded = json.files?.[0]
    if (!uploaded?.original?.id || !uploaded?.optimized?.id) {
      throw new Error('Server response is invalid')
    }

    driveImageId.value = uploaded.original.id
    driveOptimizedId.value = uploaded.optimized.id
    phase.value = 'drive-ready'

  } catch (err: any) {
    errorMsg.value = err.message ?? 'Failed to upload to server'
    phase.value = 'error'
  }
}

async function submitMetadata() {
  if (!canSubmit.value) return

  phase.value = 'submitting'

  try {
    const payload = {
      title: title.value.trim(),
      imageId: driveImageId.value,
      optimizedImageId: driveOptimizedId.value,
      context: {
        author: auth.username,
        mimetype: selectedFile.value!.type,
      },
    }

    const res = await apiPost('/image/create', payload)
    const json = await res.json()

    if (!res.ok) {
      throw new Error(json.error ?? 'Failed to save image')
    }

    phase.value = 'done'

    // Redirect ke dashboard setelah 1.5 detik
    setTimeout(() => router.push('/dashboard'), 1500)

  } catch (err: any) {
    errorMsg.value = err.message ?? 'An error occurred'
    phase.value = 'error'
  }
}

function resetForm() {
  title.value = ''
  selectedFile.value = null
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  previewUrl.value = null
  driveImageId.value = null
  driveOptimizedId.value = null
  phase.value = 'idle'
  errorMsg.value = ''
}
</script>

<template>
  <div class="upload-page">
    <div class="upload-container">

      <!-- Header -->
      <div class="page-header">
        <h1>Upload Image</h1>
        <p class="subtitle">Enter a title, image, and then click Send.</p>
      </div>

      <div class="upload-layout">

        <!-- LEFT: Drop Zone + Preview -->
        <div class="drop-section">
          <div
            class="drop-zone"
            :class="{
              'dragging': isDragging,
              'has-file': !!selectedFile,
              'uploading': phase === 'uploading-drive',
              'ready': phase === 'drive-ready',
              'error-zone': phase === 'error'
            }"
            @dragover="onDragOver"
            @dragleave="onDragLeave"
            @drop="onDrop"
            @click="phase !== 'uploading-drive' && ($refs.fileInput as HTMLInputElement).click()"
          >
            <!-- Preview image -->
            <img v-if="previewUrl" :src="previewUrl" class="preview-img" alt="preview" />

            <!-- Overlay states -->
            <div class="drop-overlay" :class="{ 'show': !previewUrl || isDragging }">
              <template v-if="phase === 'idle' || (isDragging && phase !== 'uploading-drive')">
                <div class="drop-icon">🖼️</div>
                <p class="drop-text">Drop the image here</p>
                <p class="drop-sub">or click to select a file</p>
              </template>
            </div>

            <!-- Uploading spinner overlay -->
            <div v-if="phase === 'uploading-drive'" class="spinner-overlay">
              <div class="spinner"></div>
              <p>Upload to server...</p>
            </div>

            <!-- Ready badge -->
            <div v-if="phase === 'drive-ready'" class="ready-badge">
              ✓ Ready
            </div>
          </div>

          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            class="hidden-input"
            @change="onFileInput"
          />

          <!-- File info -->
          <div v-if="selectedFile" class="file-info">
            <span class="file-name">{{ selectedFile.name }}</span>
            <span class="file-size">{{ (selectedFile.size / 1024).toFixed(1) }} KB</span>
          </div>
        </div>

        <!-- RIGHT: Form -->
        <div class="form-section">

          <!-- Status bar -->
          <div class="status-bar" :class="phase">
            <span class="status-dot"></span>
            <span>{{ statusText }}</span>
          </div>

          <!-- Title input -->
          <div class="field-group">
            <label class="field-label">Image Title</label>
            <input
              v-model="title"
              class="field-input"
              type="text"
              placeholder="Insert image title..."
              :disabled="phase === 'submitting' || phase === 'done'"
              maxlength="100"
            />
            <span class="char-count">{{ title.length }}/100</span>
          </div>

          <!-- Context info (readonly) -->
          <div class="field-group">
            <label class="field-label">Author</label>
            <div class="field-readonly">{{ auth.username || '—' }}</div>
          </div>

          <div v-if="selectedFile" class="field-group">
            <label class="field-label">Format</label>
            <div class="field-readonly">{{ selectedFile.type }}</div>
          </div>

          <!-- Drive IDs (debug/info) -->
          <!-- <div v-if="phase === 'drive-ready'" class="drive-ids">
            <div class="id-row">
              <span class="id-label">Drive ID (original)</span>
              <span class="id-value">{{ driveImageId }}</span>
            </div>
            <div class="id-row">
              <span class="id-label">Drive ID (optimized)</span>
              <span class="id-value">{{ driveOptimizedId }}</span>
            </div>
          </div> -->

          <!-- Actions -->
          <div class="actions">
            <button
              class="btn-submit"
              :disabled="!canSubmit || phase === 'submitting' || phase === 'done'"
              @click="submitMetadata"
            >
              <span v-if="phase === 'submitting'" class="btn-spinner"></span>
              <span v-else-if="phase === 'done'">✓ Saved</span>
              <span v-else>Submit</span>
            </button>

            <button
              v-if="phase !== 'idle' && phase !== 'uploading-drive' && phase !== 'submitting'"
              class="btn-reset"
              @click="resetForm"
            >
              Other Uploads
            </button>
          </div>

          <!-- Error detail -->
          <p v-if="phase === 'error'" class="error-detail">{{ errorMsg }}</p>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.upload-page {
  min-height: 100vh;
  background-color: #000;
  color: #fff;
  font-family: system-ui, -apple-system, sans-serif;
  padding: 100px 24px 60px;
  box-sizing: border-box;
}

.upload-container {
  max-width: 860px;
  margin: 0 auto;
}

/* Header */
.page-header {
  margin-bottom: 36px;
}
.page-header h1 {
  font-size: 2rem;
  font-weight: 800;
  margin: 0 0 6px;
  letter-spacing: -0.5px;
}
.subtitle {
  color: #64748b;
  font-size: 0.9rem;
  margin: 0;
}

/* Layout */
.upload-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 28px;
  align-items: start;
}

@media (max-width: 640px) {
  .upload-layout { grid-template-columns: 1fr; }
}

/* Drop zone */
.drop-zone {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  border: 2px dashed #222;
  border-radius: 16px;
  background: #080808;
  cursor: pointer;
  overflow: hidden;
  transition: border-color 0.2s, background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.drop-zone.dragging {
  border-color: #0091ff;
  background: rgba(0, 145, 255, 0.05);
}
.drop-zone.has-file {
  border-style: solid;
  border-color: #1a1a1a;
}
.drop-zone.ready {
  border-color: rgba(34, 197, 94, 0.4);
}
.drop-zone.error-zone {
  border-color: rgba(255, 74, 74, 0.4);
}
.drop-zone:hover:not(.uploading) {
  border-color: #333;
}

.preview-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.drop-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: rgba(0,0,0,0.6);
  opacity: 0;
  transition: opacity 0.2s;
  z-index: 2;
}
.drop-overlay.show {
  opacity: 1;
  background: transparent;
}
.drop-zone:not(.has-file) .drop-overlay {
  opacity: 1;
}

.drop-icon { font-size: 2.5rem; }
.drop-text {
  font-size: 0.95rem;
  font-weight: 600;
  margin: 0;
  color: #ccc;
}
.drop-sub {
  font-size: 0.75rem;
  color: #555;
  margin: 0;
}

/* Spinner overlay (while uploading to Drive) */
.spinner-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  z-index: 3;
  font-size: 0.85rem;
  color: #94a3b8;
}
.spinner {
  width: 36px; height: 36px;
  border: 3px solid rgba(0,145,255,0.3);
  border-top-color: #0091ff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Ready badge */
.ready-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(34, 197, 94, 0.15);
  color: #22c55e;
  border: 1px solid rgba(34, 197, 94, 0.3);
  font-size: 0.72rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 99px;
  z-index: 4;
  letter-spacing: 0.5px;
}

.hidden-input { display: none; }

.file-info {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  font-size: 0.75rem;
  color: #555;
}
.file-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 70%;
}
.file-size { flex-shrink: 0; }

/* Form section */
.form-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Status bar */
.status-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 0.82rem;
  background: #0d0d0d;
  border: 1px solid #1a1a1a;
  color: #64748b;
  transition: all 0.2s;
}
.status-bar .status-dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: #334155;
  flex-shrink: 0;
}
.status-bar.uploading-drive {
  border-color: rgba(0,145,255,0.25);
  color: #0091ff;
}
.status-bar.uploading-drive .status-dot {
  background: #0091ff;
  animation: pulse 1s ease-in-out infinite;
}
.status-bar.drive-ready {
  border-color: rgba(34,197,94,0.25);
  color: #22c55e;
}
.status-bar.drive-ready .status-dot { background: #22c55e; }
.status-bar.submitting {
  border-color: rgba(251,191,36,0.25);
  color: #fbbf24;
}
.status-bar.submitting .status-dot {
  background: #fbbf24;
  animation: pulse 1s ease-in-out infinite;
}
.status-bar.done {
  border-color: rgba(34,197,94,0.4);
  color: #22c55e;
  background: rgba(34,197,94,0.05);
}
.status-bar.done .status-dot { background: #22c55e; }
.status-bar.error {
  border-color: rgba(255,74,74,0.3);
  color: #ff4a4a;
}
.status-bar.error .status-dot { background: #ff4a4a; }
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

/* Fields */
.field-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.field-label {
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 600;
  letter-spacing: 0.3px;
  text-transform: uppercase;
}
.field-input {
  background: #0d0d0d;
  border: 1px solid #1f1f1f;
  border-radius: 8px;
  color: #fff;
  font-size: 0.9rem;
  padding: 10px 14px;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}
.field-input:focus { border-color: #0091ff; }
.field-input:disabled { opacity: 0.5; cursor: not-allowed; }
.field-input::placeholder { color: #333; }
.char-count {
  font-size: 0.7rem;
  color: #333;
  text-align: right;
}
.field-readonly {
  background: #0a0a0a;
  border: 1px solid #141414;
  border-radius: 8px;
  color: #555;
  font-size: 0.85rem;
  padding: 10px 14px;
  font-family: monospace;
}

/* Drive IDs */
.drive-ids {
  background: #050505;
  border: 1px solid #111;
  border-radius: 10px;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.id-row {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.id-label {
  font-size: 0.68rem;
  color: #333;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.id-value {
  font-size: 0.72rem;
  font-family: monospace;
  color: #22c55e;
  word-break: break-all;
}

/* Buttons */
.actions {
  display: flex;
  gap: 10px;
  margin-top: 4px;
}
.btn-submit {
  flex: 1;
  background: #0091ff;
  border: none;
  border-radius: 10px;
  color: #fff;
  font-size: 0.9rem;
  font-weight: 700;
  padding: 13px;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.1s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
.btn-submit:hover:not(:disabled) { opacity: 0.85; }
.btn-submit:active:not(:disabled) { transform: scale(0.98); }
.btn-submit:disabled { opacity: 0.35; cursor: not-allowed; }
.btn-spinner {
  width: 14px; height: 14px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

.btn-reset {
  background: transparent;
  border: 1px solid #222;
  border-radius: 10px;
  color: #555;
  font-size: 0.85rem;
  padding: 13px 18px;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s;
}
.btn-reset:hover { border-color: #444; color: #999; }

.error-detail {
  font-size: 0.8rem;
  color: #ff4a4a;
  background: rgba(255,74,74,0.05);
  border: 1px solid rgba(255,74,74,0.15);
  border-radius: 8px;
  padding: 10px 14px;
  margin: 0;
}
</style>
