<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

onMounted(() => {
  auth.fetchSession()
})
</script>

<template>
  <Navbar />
  <RouterView />
</template>

<style>
/* CSS Global Reset */
html, body {
  margin: 0;
  padding: 0;
  background-color: #000000;
  box-sizing: border-box;
}
</style>
