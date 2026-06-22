<script setup lang="ts">
import { ref, onMounted } from 'vue'

const API_BASE = 'https://zxfile-backend-express.vercel.app'

type ExploreImage = {
  imageId: string
  title: string
  createAt: string
  author: string
  mimetype: string
}

const images = ref<ExploreImage[]>([])
const isLoading = ref(true)
const error = ref('')

const imageUrl = (id: string) => `${API_BASE}/q/${id}`

onMounted(async () => {
  try {
    const res = await fetch(`${API_BASE}/image/explore`)
    if (!res.ok) throw new Error('Gagal mengambil data')
    const json = await res.json()
    images.value = Array.isArray(json) ? json : []
  } catch (e: any) {
    error.value = e.message ?? 'Gagal memuat galeri'
  } finally {
    isLoading.value = false
  }
})

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
</script>

<template>
  <div class="explore-page">

    <!-- Hero section -->
    <div class="hero">
      <div class="hero-glow"></div>
      <h1 class="hero-title">Explore <span class="text-blue">Gallery</span></h1>
      <p class="hero-sub">Temukan gambar terbaru yang dibagikan oleh komunitas.</p>
    </div>

    <div class="content">

      <!-- Loading skeleton -->
      <div v-if="isLoading" class="skeleton-grid">
        <div v-for="n in 12" :key="n" class="skeleton-card">
          <div class="skeleton-img"></div>
          <div class="skeleton-line"></div>
          <div class="skeleton-line short"></div>
        </div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="status-box error">
        ⚠ {{ error }}
      </div>

      <!-- Empty -->
      <div v-else-if="images.length === 0" class="status-box empty">
        <div class="empty-icon">🖼️</div>
        <p>Belum ada gambar yang dipublikasikan.</p>
      </div>

      <!-- Grid -->
      <div v-else class="image-grid">
        <div
          v-for="img in images"
          :key="img.imageId"
          class="image-card"
        >
          <!-- Image preview -->
          <div class="card-thumb">
            <img
              :src="imageUrl(img.imageId)"
              :alt="img.title"
              loading="lazy"
              class="thumb-img"
            />
          </div>

          <!-- Info -->
          <div class="card-info">
            <p class="card-title">{{ img.title }}</p>
            <div class="card-meta">
              <span class="meta-author">@{{ img.author }}</span>
              <span class="meta-dot">·</span>
              <span class="meta-date">{{ formatDate(img.createAt) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Count -->
      <p v-if="!isLoading && images.length > 0" class="count-label">
        Menampilkan {{ images.length }} gambar terbaru
      </p>

    </div>
  </div>
</template>

<style scoped>
.explore-page {
  min-height: 100vh;
  background: #000;
  color: #fff;
  font-family: system-ui, -apple-system, sans-serif;
}

/* Hero */
.hero {
  position: relative;
  padding: 130px 40px 60px;
  text-align: center;
  overflow: hidden;
}
.hero-glow {
  position: absolute;
  top: 0; left: 50%;
  transform: translateX(-50%);
  width: 600px; height: 300px;
  background: radial-gradient(ellipse at top, rgba(0,145,255,0.12) 0%, transparent 70%);
  pointer-events: none;
}
.hero-title {
  font-size: 2.8rem;
  font-weight: 800;
  margin: 0 0 12px;
  letter-spacing: -1px;
  position: relative;
}
.text-blue {
  color: #0091ff;
  text-shadow: 0 0 30px rgba(0,145,255,0.4);
}
.hero-sub {
  color: #64748b;
  font-size: 1rem;
  margin: 0;
  position: relative;
}

/* Content area */
.content {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 32px 80px;
}

/* Skeleton */
.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
}
.skeleton-card {
  background: #080808;
  border: 1px solid #111;
  border-radius: 14px;
  overflow: hidden;
}
.skeleton-img {
  width: 100%; height: 180px;
  background: linear-gradient(90deg, #111 25%, #1a1a1a 50%, #111 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
.skeleton-line {
  height: 12px;
  background: #111;
  border-radius: 6px;
  margin: 14px 14px 8px;
  animation: shimmer 1.5s infinite;
}
.skeleton-line.short { width: 60%; margin-top: 0; }
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Status boxes */
.status-box {
  text-align: center;
  padding: 80px 20px;
  border-radius: 16px;
}
.status-box.error {
  color: #ff4a4a;
  background: rgba(255,74,74,0.05);
  border: 1px solid rgba(255,74,74,0.15);
}
.status-box.empty { color: #334155; }
.empty-icon { font-size: 3rem; margin-bottom: 12px; }

/* Image grid */
.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
}

.image-card {
  background: #070707;
  border: 1px solid #161616;
  border-radius: 14px;
  overflow: hidden;
  transition: transform 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease;
  cursor: default;
}
.image-card:hover {
  transform: translateY(-5px);
  border-color: #252525;
  box-shadow: 0 16px 40px rgba(0,0,0,0.5);
}

.card-thumb {
  width: 100%;
  height: 185px;
  background: #0d0d0d;
  overflow: hidden;
}
.thumb-img {
  width: 100%; height: 100%;
  object-fit: cover;
  transition: transform 0.35s ease;
}
.image-card:hover .thumb-img { transform: scale(1.06); }

.card-info {
  padding: 13px 14px 14px;
}
.card-title {
  font-weight: 600;
  font-size: 0.88rem;
  margin: 0 0 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #e2e8f0;
}
.card-meta {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.72rem;
  color: #475569;
}
.meta-author { color: #0091ff; }
.meta-dot { opacity: 0.4; }

.count-label {
  text-align: center;
  color: #1e293b;
  font-size: 0.78rem;
  margin-top: 40px;
}

@media (max-width: 600px) {
  .hero { padding: 110px 20px 40px; }
  .hero-title { font-size: 2rem; }
  .content { padding: 0 16px 60px; }
}
</style>