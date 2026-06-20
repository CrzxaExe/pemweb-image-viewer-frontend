<script setup lang="ts">
import { ref } from 'vue'

const title = ref('')
const file = ref()

async function uploadImage(){

const formData = new FormData()

formData.append('title',title.value)
formData.append('image',file.value)

await fetch('http://localhost:3000/api/upload',{
method:'POST',
credentials:'include',
body:formData
})

alert("Upload berhasil")
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
@change="e=>file=e.target.files[0]"
>

<button @click="uploadImage">
Upload
</button>

</div>

</template>
