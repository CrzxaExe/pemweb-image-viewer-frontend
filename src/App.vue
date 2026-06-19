<script setup lang="ts">
import { RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue'
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