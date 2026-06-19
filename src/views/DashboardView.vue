<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isLoaded = ref(false)

// Data dummy daftar gambar yang sudah diupload (nanti ditarik dari API Bun)
const uploadedImages = ref([
  { id: 1, name: 'Project Banner.png', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500', size: '1.2 MB', date: '18 Jun 2026' },
  { id: 2, name: 'Cyberpunk Aesthetic.jpg', url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500', size: '845 KB', date: '15 Jun 2026' },
  { id: 3, name: 'Abstract Vector.svg', url: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=500', size: '45 KB', date: '10 Jun 2026' },
  { id: 4, name: 'Minimalist Setup.png', url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500', size: '2.1 MB', date: '05 Jun 2026' },
])

onMounted(() => {
  isLoaded.value = true
})

const deleteImage = (id: number) => {
  alert(`Hapus gambar dengan ID: ${id}`)
}

const copyLink = (url: string) => {
  navigator.clipboard.writeText(url)
  alert('Link gambar berhasil disalin!')
}
</script>

<template>
  <div class="dashboard-container">
    <Transition name="fade-slide">
      <div v-if="isLoaded" class="dashboard-content">
        
        <header class="dash-header">
          <div>
            <h1>Your Gallery</h1>
            <p class="text-muted">Manajemen seluruh berkas gambar yang telah kamu unggah ke server.</p>
          </div>
          <div class="header-stats">Total: {{ uploadedImages.length }} Images</div>
        </header>

        <div class="image-grid">
          <div v-for="img in uploadedImages" :key="img.id" class="image-card">
            
            <div class="card-preview">
              <img :src="img.url" :alt="img.name" loading="lazy" />
              <div class="card-overlay">
                <button class="btn-overlay" @click="copyLink(img.url)">🔗 Copy Link</button>
              </div>
            </div>

            <div class="card-info">
              <p class="img-name" :title="img.name">{{ img.name }}</p>
              <div class="img-meta">
                <span>{{ img.size }}</span>
                <span>•</span>
                <span>{{ img.date }}</span>
              </div>
              <button class="btn-delete" @click="deleteImage(img.id)">Hapus Berkas</button>
            </div>

          </div>
        </div>

      </div>
    </Transition>
  </div>
</template>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  background-color: #000000;
  color: #ffffff;
  font-family: system-ui, -apple-system, sans-serif;
  padding: 120px 40px 40px 40px;
}

.dashboard-content {
  max-width: 1200px;
  margin: 0 auto;
}

/* --- HEADER --- */
.dash-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  border-bottom: 1px solid #111111;
  padding-bottom: 20px;
}
.dash-header h1 {
  font-size: 2.2rem;
  font-weight: 800;
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
}
.text-muted {
  color: #94a3b8;
  margin: 0;
  font-size: 0.95rem;
}
.header-stats {
  background-color: rgba(0, 145, 255, 0.1);
  color: #0091ff;
  border: 1px solid rgba(0, 145, 255, 0.2);
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

/* --- VISUAL IMAGE GRID --- */
.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 24px;
}

.image-card {
  background-color: #070707;
  border: 1px solid #161616;
  border-radius: 14px;
  overflow: hidden;
  transition: transform 0.2s, border-color 0.2s;
}

.image-card:hover {
  transform: translateY(-4px);
  border-color: #333333;
}

/* --- PREVIEW & OVERLAY --- */
.card-preview {
  position: relative;
  width: 100%;
  height: 180px;
  background-color: #111111;
  overflow: hidden;
}

.card-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.image-card:hover .card-preview img {
  transform: scale(1.05);
}

.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.2s;
}

.card-preview:hover .card-overlay {
  opacity: 1;
}

.btn-overlay {
  background-color: #ffffff;
  color: #000000;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.1s;
}
.btn-overlay:hover {
  transform: scale(1.05);
}

/* --- INFO & AKSI --- */
.card-info {
  padding: 16px;
}

.img-name {
  font-weight: 600;
  font-size: 0.95rem;
  margin: 0 0 6px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis; /* Potong teks panjang jadi titik-titik (...) */
}

.img-meta {
  display: flex;
  gap: 6px;
  font-size: 0.75rem;
  color: #64748b;
  margin-bottom: 16px;
}

.btn-delete {
  width: 100%;
  background-color: transparent;
  color: #ff4a4a;
  border: 1px solid rgba(255, 74, 74, 0.2);
  padding: 8px 0;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.8rem;
  transition: all 0.2s;
}

.btn-delete:hover {
  background-color: rgba(255, 74, 74, 0.08);
  border-color: #ff4a4a;
}

/* --- TRANSISI HALAMAN --- */
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(30px);
}
.fade-slide-enter-active {
  transition: opacity 0.5s ease-out, transform 0.5s ease-out;
}
.fade-slide-enter-to {
  opacity: 1;
  transform: translateY(0);
}
</style>