# Zxfile — Frontend

> **Image Everywhere for Everyone**

Frontend aplikasi berbagi gambar **Zxfile**, dibangun dengan Vue 3, TypeScript, dan Vite. Terhubung ke backend REST API yang di-deploy di Vercel.

---

## 🛠️ Tech Stack

| Teknologi                                     | Versi | Keterangan                         |
| --------------------------------------------- | ----- | ---------------------------------- |
| [Vue 3](https://vuejs.org/)                   | ^3.5  | Framework utama (Composition API)  |
| [TypeScript](https://www.typescriptlang.org/) | ~5.9  | Type-safe development              |
| [Vite](https://vite.dev/)                     | ^7.3  | Build tool & dev server            |
| [Vue Router](https://router.vuejs.org/)       | ^4.6  | Client-side routing (Hash History) |
| [Pinia](https://pinia.vuejs.org/)             | ^3.0  | State management                   |
| [Tailwind CSS](https://tailwindcss.com/)      | ^4.1  | Utility-first CSS framework        |
| [VueUse](https://vueuse.org/)                 | ^14.3 | Composable utilities               |
| [Axios](https://axios-http.com/)              | ^1.18 | HTTP client                        |

---

## 📁 Struktur Proyek

```
frontend/
├── src/
│   ├── api/
│   │   └── index.ts          # Centralized API helper (fetch wrapper + JWT cookie)
│   ├── components/
│   │   ├── Navbar.vue         # Navigasi utama
│   │   ├── ImageGallery.vue   # Komponen galeri gambar
│   │   ├── ImageUpload.vue    # Komponen upload gambar
│   │   └── icons/             # Icon SVG components
│   ├── router/
│   │   └── index.ts           # Route definitions + navigation guard
│   ├── stores/
│   │   ├── auth.ts            # Auth state (login/logout, localStorage)
│   │   └── imageStore.ts      # Image data state
│   ├── views/
│   │   ├── HomeView.vue        # Halaman utama / landing
│   │   ├── ExploreView.vue     # Jelajahi semua gambar publik
│   │   ├── UploadView.vue      # Upload gambar (protected)
│   │   ├── DashboardView.vue   # Dashboard pengguna (protected)
│   │   ├── ProfileSettingsView.vue  # Pengaturan profil (protected)
│   │   ├── SettingsView.vue    # Pengaturan umum (protected)
│   │   ├── LoginView.vue       # Halaman login
│   │   └── RegisterView.vue    # Halaman registrasi
│   ├── App.vue                 # Root component
│   └── main.ts                 # Entry point aplikasi
├── public/                     # Static assets
├── index.html                  # HTML template
├── vite.config.ts              # Konfigurasi Vite
└── package.json
```

---

## 🔐 Autentikasi & Route Guard

Autentikasi dikelola melalui **Pinia store** (`auth.ts`) dengan state yang dipersistensikan ke `localStorage`. Navigation guard pada router memastikan:

- Halaman **protected** (`/upload`, `/dashboard`, `/profile-settings`, `/settings`) hanya dapat diakses oleh pengguna yang sudah login.
- Pengguna yang sudah login akan di-redirect ke `/` jika mencoba mengakses `/login` atau `/register`.

---

## 🌐 API

Semua request ke API menggunakan helper terpusat di `src/api/index.ts`:

- `api(path, options)` — Generic fetch wrapper dengan credentials (JWT cookie)
- `apiPost(path, body)` — POST JSON
- `apiUpload(path, formData)` — POST multipart/form-data untuk upload file

---

## 🚀 Menjalankan Proyek

### Prasyarat

- Node.js `^20.19.0` atau `>=22.12.0`
- [Bun](https://bun.sh/) _(direkomendasikan)_ atau npm

### Install Dependencies

```sh
# Menggunakan Bun (direkomendasikan)
bun install

# Atau menggunakan npm
npm install
```

### Development Server

```sh
# Bun
bun dev

# npm
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173` (atau port lain yang tersedia).

### Build Production

```sh
# Bun
bun run build

# npm
npm run build
```

### Preview Build

```sh
bun run preview
# atau
npm run preview
```

### Type Check

```sh
npm run type-check
```

---

## 🔧 Konfigurasi IDE

- **Editor**: [VS Code](https://code.visualstudio.com/)
- **Extension**: [Vue (Official / Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) — nonaktifkan Vetur jika terpasang
- **DevTools**:
  - Chrome/Edge: [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - Firefox: [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
