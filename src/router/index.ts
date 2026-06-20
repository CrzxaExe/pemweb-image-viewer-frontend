import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

// Import Views
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import HomeView from "../views/HomeView.vue";
import ExploreView from "../views/ExploreView.vue";
import UploadView from "../views/UploadView.vue";
import DashboardView from "../views/DashboardView.vue";
import ProfileSettingsView from "../views/ProfileSettingsView.vue";
import SettingsView from "../views/SettingsView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "login",
      component: LoginView,
    },
    {
      path: "/register",
      name: "register",
      component: RegisterView,
    },
    {
      path: "/home",
      name: "home",
      component: HomeView,
    },
    {
      path: "/explore",
      name: "explore",
      component: ExploreView,
    },
    {
      path: "/upload",
      name: "upload",
      component: UploadView,
      meta: { requiresAuth: true }, // Proteksi halaman
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: DashboardView,
      meta: { requiresAuth: true }, // Proteksi halaman
    },
    {
      path: "/profile-settings",
      name: "profile-settings",
      component: ProfileSettingsView,
      meta: { requiresAuth: true }, // Proteksi halaman
    },
    {
      path: "/settings",
      name: "settings",
      component: SettingsView,
      meta: { requiresAuth: true }, // Proteksi halaman
    },
    {
      // fallback ganti tautan /login manual ke /
      path: "/login",
      redirect: "/",
    },
  ],
});

// --- NAVIGATION GUARD (PROTEKSI RUTE) ---
router.beforeEach((to, from, next) => {
  const auth = useAuthStore();

  // Jika rute membutuhkan login tapi user belum login
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    next({ name: "login" });
  }
  // Jika user sudah login tapi mencoba kembali ke halaman Login/Register
  else if ((to.name === "login" || to.name === "register") && auth.isLoggedIn) {
    next({ name: "home" });
  }
  // Izinkan akses
  else {
    next();
  }
});

export default router;
