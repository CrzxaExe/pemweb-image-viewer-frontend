<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const handleLogout = async () => {
  await auth.logout()

  alert('Kamu telah logout.')

  router.push('/')
}
</script>

<template>
  <nav class="navbar">
    <div class="nav-container">

      <!-- Logo -->
      <div class="brand">
        <RouterLink to="/">
          <div class="logo-placeholder">
            <span class="logo-icon">
              <img src="../assets/logo.svg" alt="Logo">
            </span>

            <span class="logo-text">
              Image Viewer
            </span>
          </div>
        </RouterLink>
      </div>

      <!-- Menu Tengah -->
      <div class="nav-links">

        <!-- Belum login -->
        <template v-if="!auth.isLoggedIn">
          <RouterLink to="/" active-class="active">
            HOME
          </RouterLink>

          <RouterLink to="/explore" active-class="active">
            EXPLORE
          </RouterLink>
        </template>

        <!-- Sudah login -->
        <template v-else>

          <RouterLink to="/" active-class="active">
            UPLOAD
          </RouterLink>

          <RouterLink to="/dashboard" active-class="active">
            DASHBOARD
          </RouterLink>

          <RouterLink to="/profile-settings" active-class="active">
            PROFILE SETTING
          </RouterLink>

          <RouterLink to="/settings" active-class="active">
            SETTING
          </RouterLink>

        </template>

      </div>

      <!-- Tombol kanan -->
      <div class="nav-actions">

        <!-- Belum login -->
        <template v-if="!auth.isLoggedIn">

          <RouterLink
            to="/login"
            class="btn-login"
          >
            LOGIN
          </RouterLink>

          <RouterLink
            to="/register"
            class="btn-register"
          >
            REGISTER
          </RouterLink>

        </template>

        <!-- Sudah login -->
        <template v-else>

          <button
            @click="handleLogout"
            class="btn-logout"
          >
            LOGOUT
          </button>

        </template>

      </div>

    </div>
  </nav>
</template>

<style scoped>
.navbar{
  background-color:#000;
  padding:1.5rem 0;
  position:absolute;
  top:0;
  left:0;
  width:100%;
  z-index:10;
  border-bottom:1px solid #1a1a1a;
}

.nav-container{
  max-width:1200px;
  margin:0 auto;
  display:flex;
  justify-content:space-between;
  align-items:center;
  padding:0 40px;
}

.brand a{
  text-decoration:none;
}

.logo-placeholder{
  display:flex;
  align-items:center;
  gap:12px;
  color:white;
}

.logo-icon{
  width:32px;
  height:32px;
  display:flex;
  justify-content:center;
  align-items:center;
}

.logo-icon img{
  width:100%;
  height:100%;
  object-fit:contain;
}

.logo-text{
  font-size:1.1rem;
  font-weight:700;
  letter-spacing:1px;
}

.nav-links{
  display:flex;
  gap:28px;
}

.nav-links a{
  color:#94a3b8;
  text-decoration:none;
  font-size:.8rem;
  font-weight:600;
  letter-spacing:1px;
  transition:.2s;
}

.nav-links a:hover{
  color:white;
}

.active{
  color:#0091ff !important;
}

.nav-actions{
  display:flex;
  gap:12px;
  align-items:center;
}

.btn-login,
.btn-register,
.btn-logout{
  text-decoration:none;
  background:transparent;
  font-size:.8rem;
  font-weight:600;
  letter-spacing:1px;
  padding:8px 20px;
  border-radius:20px;
  cursor:pointer;
  transition:.2s;
}

.btn-login{
  color:#0091ff;
  border:1px solid #0091ff;
}

.btn-login:hover{
  background:rgba(0,145,255,.1);
}

.btn-register{
  color:white;
  border:1px solid #333;
}

.btn-register:hover{
  border-color:white;
}

.btn-logout{
  color:#ff4a4a;
  border:1px solid #ff4a4a;
}

.btn-logout:hover{
  background:rgba(255,74,74,.1);
}
</style>
