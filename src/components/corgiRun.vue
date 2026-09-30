<template>
  <div class="container custom-container game-wrap">
    <div
      ref="gameBox"
      class="game-card"
      tabindex="0"
      role="application"
      aria-label="Corgi Run – a small game. Press space or tap to jump, arrow down to duck."
      @keydown="onKeyDown"
      @keyup="onKeyUp"
      @pointerdown="onPointerDown"
      @pointerup="releaseJump"
    >
      <canvas ref="canvas"></canvas>

      <!-- score chip in the corner -->
      <div class="score-chip" aria-live="off">
        <span v-if="hiScore > 0" class="hi">HI {{ pad(hiScore) }}</span>
        <span :class="{ blink: flashing }">{{ pad(shownScore) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { corgiSprites } from '../data/corgiSprites.js'

/* ---------- colours (Chrome's offline game: day + night mode) ---------- */
const COLORS = {
  dark: { bg: '#1a1a1a', ink: '#acacac', cloud: '#3a3a3a' },  // night mode
  light: { bg: '#ffffff', ink: '#535353', cloud: '#dadada' }, // day mode
}

/* ---------- refs shown in the template ---------- */
const canvas = ref(null)
const gameBox = ref(null)
const hiScore = ref(0)
const shownScore = ref(0)
const flashing = ref(false)
const pad = (n) => String(n).padStart(5, '0')

/* ---------- game settings ---------- */
const H = 150 // game height in game-pixels (width depends on the screen)
const GROUND = 108 // where the corgi's feet are (above the fade)
const PX = 2 // one sprite pixel = 2 game pixels
const START_SPEED = 6
const MAX_SPEED = 13
const ACCEL = 0.0012
const GRAVITY = 0.6
const JUMP_VELOCITY = -10.5

let W = 600
let ctx, colors, images
let state = 'intro' // intro | running | over
let speed, distance, score, flash
let obstacles, clouds, pebbles, nextObstacle
let overAt = 0
let animationId
let visible = true
let observer, themeObserver

const dog = { y: 0, vy: 0, jumping: false, ducking: false, step: 0 }

/* ---------- sprites: turn '#' rows into small canvases ---------- */
function bake(rows, color) {
  const c = document.createElement('canvas')
  c.width = rows[0].length * PX
  c.height = rows.length * PX
  const g = c.getContext('2d')
  g.fillStyle = color
  rows.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      if (row[x] === '#') g.fillRect(x * PX, y * PX, PX, PX)
    }
  })
  return c
}

function bakeAll() {
  const s = corgiSprites
  const ink = colors.ink
  images = {
    run: [bake(s.corgi.a, ink), bake(s.corgi.b, ink)],
    jump: bake(s.corgi.jump, ink),
    dead: bake(s.corgi.dead, ink),
    duck: [bake(s.corgi.duck_a, ink), bake(s.corgi.duck_b, ink)],
    hydrant: bake(s.hydrant, ink),
    small: bake(s.smallHydrant, ink),
    bird: [bake(s.birdUp, ink), bake(s.birdDown, ink)],
    cloud: bake(s.cloud, colors.cloud),
  }
}

function setTheme() {
  colors = document.body.classList.contains('light') ? COLORS.light : COLORS.dark
  bakeAll()
}

/* ---------- size ---------- */
function resize() {
  const box = gameBox.value
  const dpr = Math.min(3, window.devicePixelRatio || 1)
  const scale = (box.clientHeight / H) * dpr
  W = Math.round(box.clientWidth / (box.clientHeight / H))
  canvas.value.width = Math.round(W * scale)
  canvas.value.height = Math.round(H * scale)
  ctx.setTransform(scale, 0, 0, scale, 0, 0)
  ctx.imageSmoothingEnabled = false
}

/* ---------- start / reset ---------- */
function reset() {
  speed = START_SPEED
  distance = 0
  score = 0
  flash = 0
  obstacles = []
  nextObstacle = 380
  clouds = [{ x: W * 0.2, y: 22 }, { x: W * 0.65, y: 44 }]
  pebbles = []
  for (let i = 0; i < Math.round(W / 25); i++) {
    pebbles.push({ x: Math.random() * W, y: GROUND + 3 + Math.floor(Math.random() * 10), w: 1 + Math.floor(Math.random() * 3) })
  }
  Object.assign(dog, { y: 0, vy: 0, jumping: false, ducking: false, step: 0 })
  shownScore.value = 0
}

/* ---------- controls ---------- */
function jump() {
  if (state === 'intro') state = 'running'
  if (state === 'over') {
    if (performance.now() - overAt > 500) {
      reset()
      state = 'running'
    }
    return
  }
  if (!dog.jumping && !dog.ducking) {
    dog.jumping = true
    dog.vy = JUMP_VELOCITY
  }
}

function releaseJump() {
  if (dog.jumping && dog.vy < -8) dog.vy = -8 // short tap = lower jump
}

function onKeyDown(e) {
  if (['Space', 'ArrowUp', 'KeyW'].includes(e.code)) {
    e.preventDefault() // don't scroll the page while playing
    if (!e.repeat) jump()
  }
  if (['ArrowDown', 'KeyS'].includes(e.code) && state === 'running') {
    e.preventDefault()
    if (dog.jumping) dog.vy += 3 // drop faster
    else dog.ducking = true
  }
}

function onKeyUp(e) {
  if (['Space', 'ArrowUp', 'KeyW'].includes(e.code)) releaseJump()
  if (['ArrowDown', 'KeyS'].includes(e.code)) dog.ducking = false
}

function onPointerDown(e) {
  e.preventDefault()
  gameBox.value.focus()
  jump()
}

/* ---------- obstacles ---------- */
function spawnObstacle() {
  if (score > 350 && Math.random() < 0.28) {
    const heights = [10, 26, 56] // above the ground: jump / duck / run under
    const lift = heights[Math.floor(Math.random() * heights.length)]
    const img = images.bird[0]
    obstacles.push({ type: 'bird', x: W, y: GROUND - lift - img.height, w: img.width, h: img.height, flap: 0 })
  } else {
    const big = Math.random() < 0.55
    const img = big ? images.hydrant : images.small
    const count = speed > 8 ? 1 + Math.floor(Math.random() * (big ? 2 : 3)) : 1
    for (let i = 0; i < count; i++) {
      obstacles.push({ type: big ? 'hydrant' : 'small', x: W + i * (img.width + 4), y: GROUND - img.height, w: img.width, h: img.height })
    }
  }
  nextObstacle = speed * 42 + 140 + Math.random() * 260
}

/* ---------- collision (a little forgiving) ---------- */
function dogBoxes() {
  const x = 40
  const top = GROUND - (dog.ducking ? images.duck[0].height : images.run[0].height) + dog.y
  if (dog.ducking) return [{ x: x + 4, y: top + 10, w: 52, h: 16 }]
  return [
    { x: x + 36, y: top + 6, w: 20, h: 18 }, // head
    { x: x + 4, y: top + 16, w: 36, h: 14 }, // body
    { x: x + 6, y: top + 26, w: 36, h: 8 }, // legs
  ]
}

function hits(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y
}

/* ---------- update ---------- */
function update(dt) {
  speed = Math.min(MAX_SPEED, speed + ACCEL * dt)
  distance += speed * dt
  const newScore = Math.floor(distance * 0.025)
  if (Math.floor(newScore / 100) > Math.floor(score / 100)) flash = 60 // blink every 100 points
  score = newScore
  if (flash > 0) flash -= dt

  if (dog.jumping) {
    dog.vy += GRAVITY * dt
    dog.y += dog.vy * dt
    if (dog.y >= 0) {
      dog.y = 0
      dog.vy = 0
      dog.jumping = false
    }
  }
  dog.step += dt

  for (const o of obstacles) {
    o.x -= speed * dt
    if (o.type === 'bird') o.flap += dt
  }
  obstacles = obstacles.filter((o) => o.x + o.w > -10)
  nextObstacle -= speed * dt
  if (nextObstacle <= 0) spawnObstacle()

  for (const c of clouds) c.x -= 0.25 * dt
  if (clouds[clouds.length - 1].x < W - 200 - Math.random() * 200) clouds.push({ x: W + 10, y: 14 + Math.random() * 45 })
  clouds = clouds.filter((c) => c.x > -80)

  for (const p of pebbles) {
    p.x -= speed * dt
    if (p.x < -4) {
      p.x = W + Math.random() * 40
      p.y = GROUND + 3 + Math.floor(Math.random() * 10)
    }
  }

  const boxes = dogBoxes()
  for (const o of obstacles) {
    const ob = { x: o.x + 3, y: o.y + 3, w: o.w - 6, h: o.h - 4 }
    if (boxes.some((b) => hits(b, ob))) {
      state = 'over'
      overAt = performance.now()
      hiScore.value = Math.max(hiScore.value, score)
      saveHiScore()
      dog.ducking = false
      break
    }
  }

  // update the score chip
  flashing.value = flash > 0
  shownScore.value = flash > 0 ? Math.floor(score / 100) * 100 : score
}

/* ---------- draw ---------- */
function drawText(text, x, y) {
  ctx.fillStyle = colors.ink
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  ctx.font = '8px "Press Start 2P", monospace'
  ctx.fillText(text, x, y)
}

function drawRestartIcon(cx, cy) {
  ctx.strokeStyle = colors.ink
  ctx.fillStyle = colors.ink
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.arc(cx, cy + 12, 10, -Math.PI * 0.35, Math.PI * 1.45)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(cx + 3, cy - 3)
  ctx.lineTo(cx + 12, cy + 3)
  ctx.lineTo(cx + 3, cy + 7)
  ctx.closePath()
  ctx.fill()
}

function draw() {
  ctx.fillStyle = colors.bg
  ctx.fillRect(0, 0, W, H)

  for (const c of clouds) ctx.drawImage(images.cloud, Math.round(c.x), Math.round(c.y))

  ctx.fillStyle = colors.ink
  ctx.fillRect(0, GROUND, W, 1)
  for (const p of pebbles) ctx.fillRect(Math.round(p.x), p.y, p.w, 1)

  for (const o of obstacles) {
    const img = o.type === 'bird' ? images.bird[Math.floor(o.flap / 12) % 2] : images[o.type]
    ctx.drawImage(img, Math.round(o.x), Math.round(o.y))
  }

  let img
  if (state === 'over') img = images.dead
  else if (state === 'intro') img = images.run[0]
  else if (dog.jumping) img = images.jump
  else if (dog.ducking) img = images.duck[Math.floor(dog.step / 5) % 2]
  else img = images.run[Math.floor(dog.step / 5) % 2]
  const standHeight = images.run[0].height
  const top = dog.ducking && !dog.jumping && state === 'running' ? GROUND - img.height : GROUND - standHeight + Math.round(dog.y)
  ctx.drawImage(img, 40, top)

  if (state === 'intro') drawText('PRESS SPACE OR TAP TO PLAY', W / 2, 52)
  if (state === 'over') {
    drawText('G A M E   O V E R', W / 2, 38)
    drawRestartIcon(W / 2, 58)
  }
}

/* ---------- loop ---------- */
let last = 0
function loop(now) {
  let dt = (now - last) / 16.667
  last = now
  if (dt > 3) dt = 1 // coming back from a hidden tab
  if (state === 'running') update(dt)
  draw()
  if (visible) animationId = requestAnimationFrame(loop)
}

function start() {
  cancelAnimationFrame(animationId)
  last = performance.now()
  animationId = requestAnimationFrame(loop)
}

/* ---------- hi score is remembered in this browser ---------- */
function loadHiScore() {
  try {
    hiScore.value = Number(localStorage.getItem('corgiRunHi')) || 0
  } catch (e) {
    hiScore.value = 0
  }
}
function saveHiScore() {
  try {
    localStorage.setItem('corgiRunHi', String(hiScore.value))
  } catch (e) {
    /* storage blocked – fine */
  }
}

onMounted(async () => {
  ctx = canvas.value.getContext('2d')
  setTheme()
  resize()
  reset()
  loadHiScore()

  window.addEventListener('resize', resize)

  // follow the theme toggle in the navbar (it puts .light on <body>)
  themeObserver = new MutationObserver(setTheme)
  themeObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] })

  // only animate while the game is on screen
  observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting
    if (visible) start()
  })
  observer.observe(gameBox.value)

  // wait for the pixel font so the text looks right
  if (document.fonts) {
    try {
      await document.fonts.load('10px "Press Start 2P"')
    } catch (e) {
      /* use the fallback font */
    }
  }
  start()
})

onBeforeUnmount(() => {
  cancelAnimationFrame(animationId)
  window.removeEventListener('resize', resize)
  if (observer) observer.disconnect()
  if (themeObserver) themeObserver.disconnect()
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
</style>

<style scoped>
.custom-container {
  max-width: var(--container-max);
}

/* pull the techtree up into the faded part of the game */
.game-wrap {
  margin-bottom: -12px;
}

.game-card {
  position: relative;
  height: clamp(170px, 20vw, 240px);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  outline: none; /* no border or ring when you click to play */
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

canvas {
  display: block;
  width: 100%;
  height: 100%;
  image-rendering: pixelated;
}

/* dark gradient ON TOP of the game (like the map in the reference).
   pointer-events: none lets clicks/taps go straight through to the game. */
.game-card::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background: linear-gradient(
    to bottom,
    rgba(10, 10, 10, 0) 60%,
    rgba(10, 10, 10, 0.7) 84%,
    var(--bg-dark) 100%
  );
}
.light .game-card::after {
  background: linear-gradient(
    to bottom,
    rgba(250, 250, 250, 0) 60%,
    rgba(250, 250, 250, 0.7) 84%,
    var(--bg-light) 100%
  );
}

.score-chip {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 2; /* above the gradient */
  display: flex;
  gap: 14px;
  padding: 8px 10px;
  border-radius: 6px;
  background: rgba(10, 10, 10, 0.75);
  border: 1px solid var(--border-dark);
  color: var(--text-dark-secondary);
  font-family: 'Press Start 2P', monospace;
  font-size: 10px;
  line-height: 1;
  pointer-events: none;
}
.light .score-chip {
  background: rgba(250, 250, 250, 0.85);
  border-color: var(--border-light);
  color: var(--text-light-secondary);
}
.score-chip .hi {
  opacity: 0.6;
}
.blink {
  animation: blink 0.25s steps(1) infinite;
}
@keyframes blink {
  50% {
    visibility: hidden;
  }
}
</style>
