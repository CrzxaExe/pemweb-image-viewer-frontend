<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useImageStore } from '@/stores/imageStore'

const selectedFile = ref(null)
const imageStore = useImageStore()

const onFileChange = (e) => {
  const target = e.target
  if (target.files && target.files.length > 0) {
    selectedFile.value = target.files[0]
  }
}

const handleUpload = async () => {
  if (!selectedFile.value) return
  
  const formData = new FormData()
  formData.append('image', selectedFile.value)

  try {
    await axios.post('https://zxfile.vercel.app/drive/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    selectedFile.value = null
    imageStore.fetchImages() // Otomatis refresh list galeri setelah sukses
    alert('Gambar berhasil diunggah!')
  } catch (error) {
    console.error('Upload gagal:', error)
    alert('Gagal mengunggah gambar.')
  }
}
</script>

<template>
  <div class="upload-box">
    <input type="file" @change="onFileChange" accept="image/*" />
    <button @click="handleUpload" :disabled="!selectedFile">Upload Picture</button>
  </div>
</template>

<style scoped>
.upload-box {
  margin: 20px 0;
  display: flex;
  gap: 10px;
}
</style>