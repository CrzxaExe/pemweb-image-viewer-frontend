import { createRouter, createWebHashHistory } from "vue-router";
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
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/register",
      name: "register",
      component: RegisterView,
    },
    {
      path: "/",
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
  ],
});

// --- NAVIGATION GUARD (PROTEKSI RUTE) ---
router.beforeEach((to, from, next) => {
  const auth = useAuthStore();
  const isLoggedIn = auth.isLoggedIn;

  // Jika rute membutuhkan login tapi user belum login
  if (to.meta.requiresAuth && !isLoggedIn) {
    next({ name: "login" });
  }
  // Jika user sudah login tapi mencoba kembali ke halaman Login/Register
  else if ((to.name === "login" || to.name === "register") && isLoggedIn) {
    next({ name: "home" });
  }
  // Izinkan akses
  else {
    next();
  }
});

export default router;
