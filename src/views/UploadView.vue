<script setup lang="ts">
import { ref } from 'vue'

const title = ref('')
const file = ref<File | null>(null)

function handleFile(e:any) {
  file.value = e.target.files[0]
}

async function uploadImage() {

  if (!title.value || !file.value) {
    alert("Lengkapi data terlebih dahulu")
    return
  }

  const formData = new FormData()

  formData.append('title', title.value)
  formData.append('image', file.value)

  try {

    await fetch(
      'https://zxfile-backend-express.vercel.app/api/upload',
      {
        method: 'POST',
        credentials: 'include',
        body: formData
      }
    )

    alert("Upload berhasil")

    title.value = ''
    file.value = null

  } catch (err) {

    console.error(err)

    alert("Upload gagal")
  }
}
</script>

<template>

<div class="container">

<h1>Upload Image</h1>

<input
v-model="title"
placeholder="Title"
/>

<input
type="file"
accept="image/*"
@change="handleFile"
/>

<button @click="uploadImage">
Upload
</button>

</div>

</template>
