<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const handleLogout = async () => {
  await auth.logout()
  router.push('/')
}
</script>

<template>
  <nav class="navbar">
    <div class="nav-container">

      <!-- Logo -->
      <div class="brand">
        <RouterLink to="/home">
          <div class="logo-placeholder">
            <span class="logo-icon">
              <img src="../assets/logo.svg" alt="Logo">
            </span>

            <span class="logo-text">
              PixNest
            </span>
          </div>
        </RouterLink>
      </div>

      <!-- Menu Tengah -->
      <div class="nav-links">

        <!-- BELUM LOGIN -->
        <template v-if="!auth.isLoggedIn">

          <RouterLink to="/home" active-class="active">
            HOME
          </RouterLink>

          <RouterLink to="/explore" active-class="active">
            EXPLORE
          </RouterLink>

        </template>

        <!-- SUDAH LOGIN -->
        <template v-else>

          <RouterLink to="/upload" active-class="active">
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
  background:#000;
  padding:1.5rem 0;
  position:absolute;
  top:0;
  left:0;
  width:100%;
  border-bottom:1px solid #1a1a1a;
  z-index:10;
}

.nav-container{
  max-width:1200px;
  margin:auto;
  padding:0 40px;
  display:flex;
  justify-content:space-between;
  align-items:center;
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
}

.logo-icon img{
  width:100%;
  height:100%;
  object-fit:contain;
}

.logo-text{
  font-weight:700;
  font-size:1.1rem;
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
}

.active{
  color:#0091ff !important;
}

.nav-actions{
  display:flex;
  gap:12px;
}

.btn-login,
.btn-register,
.btn-logout{
  padding:8px 18px;
  border-radius:20px;
  font-size:.8rem;
  text-decoration:none;
  cursor:pointer;
}

.btn-login{
  border:1px solid #0091ff;
  color:#0091ff;
  background:transparent;
}

.btn-register{
  border:1px solid #333;
  color:white;
}

.btn-logout{
  border:1px solid #ff4a4a;
  color:#ff4a4a;
  background:transparent;
}
</style>
