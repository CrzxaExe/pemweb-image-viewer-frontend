<script setup lang="ts">
</script>

<template>
  <div class="landing-container">
    
    <div class="hero-left">
      <div class="dot-grid"></div>
      
      <div class="vertical-badge">
        <span class="badge-text">WHAT A THING</span>
      </div>

      <div class="hero-content">
        <div class="icon-placeholder-box"></div>
        
        <h1 class="main-title">
          Image Everywhere <br />
          for <span class="text-neon-blue">Everyone</span>
        </h1>
        
        <p class="sub-title">
          Share your image to everyone without them need to worry about need downloaded first.
        </p>

        <div class="bg-watermark">
          <h2>INSERT TEXT</h2>
          <h2>INSERT TEXT</h2>
        </div>
      </div>
    </div>

    <div class="hero-right">
      <div class="clip-bg"></div>
      <div class="stacked-gallery">
        
        <div class="main-image-wrapper">
          <div class="image-placeholder main-pic overflow-hidden">
            <img src="https://zxfile.vercel.app/q/Jg8hsObEiiXOXmKwnM" alt="Example" class="object-cover w-full h-full">
          </div>
        </div>

        <div class="thumbnail-row">
          <div class="image-placeholder thumb-pic"><span>THUMB 1</span></div>
          <div class="image-placeholder thumb-pic"><span>THUMB 2</span></div>
          <div class="image-placeholder thumb-pic"><span>THUMB 3</span></div>
        </div>

      </div>
    </div>

  </div>
</template>

<style scoped>
.landing-container {
  display: flex;
  min-height: 100vh;
  background-color: #000000;
  color: #ffffff;
  font-family: system-ui, -apple-system, sans-serif;
  overflow: hidden;
  position: relative;
}

/* --- KIRI: SENSOR TEKS --- */
.hero-left {
  flex: 1.2;
  position: relative;
  display: flex;
  align-items: center;
  padding-left: 8%;
  z-index: 2;
}
.dot-grid {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 20px 20px;
  opacity: 0.5;
  z-index: -1;
}
.vertical-badge {
  position: absolute;
  left: 3%;
  top: 40%;
  transform: rotate(-90deg);
  transform-origin: left top;
}
.badge-text {
  font-size: 0.65rem;
  letter-spacing: 4px;
  color: #0091ff;
  border-left: 1px solid #0091ff;
  padding-left: 8px;
}
.hero-content {
  position: relative;
  max-width: 540px;
}
.icon-placeholder-box {
  width: 32px;
  height: 32px;
  border: 3px solid #ffffff;
  border-radius: 6px;
  margin-bottom: 24px;
}
.main-title {
  font-size: 3rem;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 20px;
  letter-spacing: -0.5px;
}
.text-neon-blue {
  color: #0091ff;
  text-shadow: 0 0 20px rgba(0, 145, 255, 0.3);
}
.sub-title {
  color: #94a3b8;
  font-size: 1rem;
  line-height: 1.6;
  max-width: 420px;
}
.bg-watermark {
  position: absolute;
  bottom: -160px;
  left: 0;
  opacity: 0.05;
  user-select: none;
  pointer-events: none;
}
.bg-watermark h2 {
  font-size: 4.5rem;
  font-weight: 900;
  margin: 0;
  line-height: 1;
  -webkit-text-stroke: 1px #ffffff;
  color: transparent;
}

/* --- KANAN: SENSOR VISUAL (CLIP-PATH MIRING) --- */
.hero-right {
  flex: 1;
  background-color: #0d0d0d;
  clip-path: polygon(15% 0%, 100% 0%, 100% 100%, 0% 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
  padding-left: 5%;
}
.stacked-gallery {
  width: 80%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* --- PLACEHOLDER GAMBAR --- */
.image-placeholder {
  background: linear-gradient(135deg, #1a1a1a 0%, #262626 100%);
  border: 1px solid #333333;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #444444;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 1px;
}
.main-image-wrapper {
  width: 100%;
}
.main-pic {
  height: 320px;
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
}
.thumbnail-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}
.thumb-pic {
  flex: 1;
  height: 90px;
  border-radius: 10px;
}
</style>