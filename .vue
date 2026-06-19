<script setup lang="ts">
import { ref } from 'vue'

const isVisible = ref(false)
</script>

<template>
  <div class="container">
    <button @click="isVisible = !isVisible">Toggle Elemen</button>

    <Transition name="slide-fade">
      <div v-if="isVisible" class="box">
        Pesan ini muncul ke atas dari transparan!
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.box {
  margin-top: 20px;
  padding: 20px;
  background-color: #0091ff;
  color: white;
  border-radius: 8px;
}

/* --- KODE ANIMASI VUE --- */
/* Keadaan awal sebelum elemen muncul */
.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(30px); /* Geser ke bawah 30px */
}

/* Durasi dan tipe transisi */
.slide-fade-enter-active {
  transition: all 0.5s ease-out;
}

/* Keadaan akhir setelah elemen muncul sempurna */
.slide-fade-enter-to {
  opacity: 1;
  transform: translateY(0);
}
</style>