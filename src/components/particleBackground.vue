<template>
  <canvas id="particleCanvas" class="particle-canvas"></canvas>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

let canvas, ctx, animationId
const particlesArray = []
const particleCount = 50

const isLight = ref(document.body.classList.contains('light'))

let observer
onMounted(() => {
  observer = new MutationObserver(() => {
    isLight.value = document.body.classList.contains('light')
  })
  observer.observe(document.body, { attributes: true, attributeFilter: ['class'] })

  canvas = document.getElementById('particleCanvas')
  ctx = canvas.getContext('2d')
  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)
  for (let i = 0; i < particleCount; i++) {
    particlesArray.push(new Particle())
  }
  animate()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeCanvas)
  cancelAnimationFrame(animationId)
  if (observer) observer.disconnect()
})

class Particle {
  constructor() {
    this.reset()
  }
  reset() {
    this.x = Math.random() * canvas.width
    this.y = Math.random() * canvas.height
    this.size = Math.random() * 3 + 1
    this.speedX = Math.random() * 0.1 - 0.05
    this.speedY = Math.random() * 0.1 - 0.05
    this.opacity = Math.random() * 0.5 + 0.1
  }
  update() {
    this.x += this.speedX
    this.y += this.speedY
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
      this.reset()
    }
  }
  draw() {
    const color = isLight.value
      ? `rgba(162,200,255,${this.opacity})`
      : `rgba(255,255,255,${this.opacity})`
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.closePath()
    ctx.fill()
  }
}

function resizeCanvas() {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}

function animate() {
  animationId = requestAnimationFrame(animate)
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update()
    particlesArray[i].draw()
  }
}
</script>

<style>
.particle-canvas {
  z-index: -1;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>