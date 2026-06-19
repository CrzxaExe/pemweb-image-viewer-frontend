import { defineStore } from "pinia";
import axios from "axios";

// Definisikan interface untuk tipe data gambar dari backend
export interface ImageData {
  id: number;
  url: string;
  name: string;
}

export const useImageStore = defineStore("image", {
  state: () => ({
    images: [] as ImageData[],
    loading: false,
  }),
  actions: {
    async fetchImages() {
      this.loading = true;
      try {
        // Sesuaikan dengan URL API port localhost Laravel kamu (misal http://127.0.0.1:8000)
        const response = await axios.get<ImageData[]>(
          "http://127.0.0.1:8000/api/images",
        );
        this.images = response.data;
      } catch (error) {
        console.error("Gagal mengambil gambar:", error);
      } finally {
        this.loading = false;
      }
    },
  },
});
