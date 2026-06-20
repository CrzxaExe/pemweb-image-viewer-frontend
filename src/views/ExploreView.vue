<script setup lang="ts">
import { ref,onMounted } from 'vue'

const images = ref([])

onMounted(async()=>{
  const response = await fetch('http://localhost:3000/api/explore')
  images.value = await response.json()
})
</script>

<template>
<div class="container">
<h1>Explore</h1>

<div class="gallery">
<div class="card" v-for="img in images" :key="img.id">
<img :src="img.image_url">
<p>{{ img.title }}</p>
</div>
</div>

</div>
</template>
