<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'

const router = useRouter()

const handleLogout = () => {
  // Tambahkan logika hapus token/session backend di sini nanti
  alert('Kamu telah logout.')
  router.push('/') // Redirect kembali ke landing page setelah logout
}
</script>

<template>
  <nav class="navbar">
    <div class="nav-container">
      <!-- Logo -->
      <div class="brand">
        <RouterLink to="/">
          <div class="logo-placeholder">
            <span class="logo-icon"><img src="../assets/logo.svg" alt="Logo"/></span>
            <span class="logo-text">Image Viewer</span>
          </div>
        </RouterLink>
      </div>

      <!-- Menu Navigasi Tengah -->
      <div class="nav-links">
        <RouterLink to="/" active-class="active">UPLOAD</RouterLink>
        <RouterLink to="/dashboard" active-class="active">DASHBOARD</RouterLink>
        <RouterLink to="/profile-settings" active-class="active">PROFILE SETTING</RouterLink>
        <RouterLink to="/settings" active-class="active">SETTING</RouterLink>
      </div>

      <!-- Tombol Aksi Kanan -->
      <div class="nav-actions">
        <button @click="handleLogout" class="btn-logout">LOGOUT</button>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  background-color: #000000;
  padding: 1.5rem 0;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 10;
  border-bottom: 1px solid #1a1a1a;
}
.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 40px;
}
.brand a {
  text-decoration: none;
}
.logo-placeholder {
  display: flex;
  align-items: center;
  gap: 12px; /* Jarak antara logo dan teks diperlebar sedikit */
  color: #ffffff;
}
.logo-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;  /* Batasi lebar kontainer logo */
  height: 32px; /* Batasi tinggi kontainer logo */
}
.logo-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain; /* Memastikan rasio SVG tidak rusak/distorsi */
}
.logo-text {
  font-weight: 700;
  letter-spacing: 1px;
  font-size: 1.1rem;
}
.nav-links {
  display: flex;
  gap: 28px;
}
.nav-links a {
  color: #94a3b8;
  text-decoration: none;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 1px;
  transition: all 0.2s;
}
.nav-links a:hover {
  color: #ffffff;
}
.active {
  color: #0091ff !important;
  text-shadow: 0 0 10px rgba(0, 145, 255, 0.5);
}
.nav-actions {
  display: flex;
  align-items: center;
}
.btn-logout {
  background: transparent;
  color: #ff4a4a;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 1px;
  padding: 8px 20px;
  border: 1px solid #ff4a4a;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-logout:hover {
  background-color: rgba(255, 74, 74, 0.1);
  box-shadow: 0 0 12px rgba(255, 74, 74, 0.2);
}
</style>