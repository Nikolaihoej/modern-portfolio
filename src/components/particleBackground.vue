<template>
  <canvas id="particleCanvas" class="particle-canvas"></canvas>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { wind } from '../particleWind.js'

let canvas, ctx, animationId
let particlesArray = []

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
    this.y = Math.random() * canvas.height // start spredt ud over hele skærmen
  }
  reset() {
    this.x = Math.random() * canvas.width
    this.y = canvas.height + 5 // nye partikler starter under skærmen
    this.size = Math.random() * 1.3 + 0.3 // små stjerner
    this.speedX = Math.random() * 0.06 - 0.03
    this.speedY = -(Math.random() * 0.2 + 0.06) // svæver langsomt opad
    this.opacity = Math.random() * 0.6 + 0.2
    this.twinkle = Math.random() * Math.PI * 2 // hvor i "blinket" den starter
  }
  update() {
    // wind.x kommer fra projekthjulet – store stjerner flytter sig mest
    this.x += this.speedX + wind.x * this.size * 16
    this.y += this.speedY
    this.twinkle += 0.03

    // ud af siden → ind i den anden side
    if (this.x < -30) this.x = canvas.width + 30
    if (this.x > canvas.width + 30) this.x = -30
    // ud af toppen → start forfra i bunden
    if (this.y < -5) this.reset()
  }
  draw() {
    const alpha = this.opacity * (0.7 + 0.3 * Math.sin(this.twinkle))
    ctx.fillStyle = isLight.value
      ? `rgba(162,200,255,${alpha})`
      : `rgba(255,255,255,${alpha})`

    // når hjulet drejer hurtigt, trækkes stjernerne ud til streger
    const streak = Math.min(24, Math.abs(wind.x) * this.size * 16)
    if (streak > 1.5) {
      const startX = wind.x > 0 ? this.x - streak : this.x
      ctx.fillRect(startX, this.y - this.size / 2, streak, this.size)
    } else {
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
      ctx.fill()
    }
  }
}

function resizeCanvas() {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  // flere partikler på store skærme, færre på små
  const count = Math.round((canvas.width * canvas.height) / 9000)
  while (particlesArray.length < count) {
    particlesArray.push(new Particle())
  }
  particlesArray.length = count // fjern overskydende, hvis skærmen blev mindre
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
