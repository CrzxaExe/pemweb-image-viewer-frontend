<script setup lang="ts">
import { onMounted } from 'vue'
import { useImageStore } from '@/stores/imageStore'

const imageStore = useImageStore()

onMounted(() => {
  imageStore.fetchImages()
})
</script>

<template>
  <div v-if="imageStore.loading" class="loading">Memuat galeri...</div>
  
  <div v-else class="grid">
    <div v-for="img in imageStore.images" :key="img.id" class="card">
      <img :src="img.url" :alt="img.name" />
      <p class="img-name">{{ img.name }}</p>
    </div>
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}
.card {
  border: 1px solid #eee;
  padding: 8px;
  border-radius: 8px;
  text-align: center;
}
.card img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 6px;
}
.img-name {
  margin-top: 8px;
  font-size: 14px;
  color: #333;
}
</style>