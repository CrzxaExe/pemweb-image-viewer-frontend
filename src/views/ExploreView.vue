<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Buat interface agar TypeScript tidak bingung membaca properti objek
interface ImageItem {
  id: string | number
  image_url: string // Sesuaikan dengan key JSON backend kamu (misal: url / image_url)
  title: string
}

const images = ref<ImageItem[]>([])

onMounted(async () => {
  try {
    const response = await fetch('http://localhost:3000/api/explore')
    images.value = await response.json()
    console.log("Data dari backend:", images.value) // Cek isi data di console F12
  } catch (error) {
    console.error("Gagal fetch data explore:", error)
  }
})
</script>

<template>
  <div class="explore-container">
    <div class="container">
      <h1 class="page-title">Explore Gallery</h1>

      <div class="gallery">
        <div class="card" v-for="img in images" :key="img.id">
          <div class="img-wrapper">
            <img :src="img.image_url" :alt="img.title" loading="lazy">
          </div>
          <p class="img-title">{{ img.title }}</p>
        </div>
      </div>

      <div v-if="images.length === 0" class="empty-state">
        <p>Memuat gambar atau database publik kosong...</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.explore-container {
  min-height: 100vh;
  background-color: #000000;
  color: #ffffff;
  font-family: system-ui, -apple-system, sans-serif;
  padding: 120px 40px 40px 40px; /* Jaga jarak dari navbar atas */
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  font-size: 2.2rem;
  font-weight: 800;
  margin-bottom: 30px;
  letter-spacing: -0.5px;
}

/* --- TATA LETAK GRID --- */
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.card {
  background-color: #070707;
  border: 1px solid #161616;
  border-radius: 14px;
  overflow: hidden;
  transition: transform 0.2s, border-color 0.2s;
}

.card:hover {
  transform: translateY(-4px);
  border-color: #333333;
}

.img-wrapper {
  width: 100%;
  height: 200px;
  background-color: #111111;
  overflow: hidden;
}

.img-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Memotong gambar secara proporsional agar memenuhi kotak */
}

.img-title {
  padding: 16px;
  margin: 0;
  font-weight: 600;
  font-size: 0.95rem;
  color: #cbd5e1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis; /* Judul panjang otomatis terpotong titik-titik (...) */
}

.empty-state {
  text-align: center;
  padding: 40px 0;
  color: #555555;
}
</style>