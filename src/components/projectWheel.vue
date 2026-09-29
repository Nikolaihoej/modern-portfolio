<template>
  <section
    ref="root"
    class="project-wheel"
    :class="{ 'is-dragging': isDragging, 'is-spinning': isSpinning }"
    aria-labelledby="projectWheelTitle"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerEnd"
    @pointercancel="onPointerEnd"
    @click.capture="onClickCapture"
  >
    <nav class="pw-ring" aria-label="Projects">
      <a
        v-for="(p, i) in items"
        :key="p.id"
        :ref="(el) => (cardEls[i] = el)"
        class="pw-card"
        :href="p.href"
        target="_blank"
        rel="noopener"
        draggable="false"
        :aria-label="`Visit ${p.name} (opens in a new tab)`"
      >
        <div class="pw-frame">
          <div class="pw-screen">
            <img :src="p.image" alt="" loading="lazy" draggable="false" />
          </div>
          <span class="pw-visit" aria-hidden="true">
            {{ p.isSource ? 'View source' : 'Visit site' }}
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <path d="M3.5 8.5l5-5M4.5 3.5h4v4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </span>
        </div>
      </a>
    </nav>

    <div ref="content" class="pw-content">
      <p class="pw-eyebrow">Selected work</p>
      <div class="pw-title">
        <h2 id="projectWheelTitle">Projects</h2>
        <div class="pw-avatar" aria-hidden="true">
          <canvas ref="duckCanvas" width="256" height="256"></canvas>
        </div>
      </div>
      <p class="pw-lead">
        Websites I’ve designed for real clients - <strong><h2>The projects are designed at my workplace næmt.nu</h2></strong> Click a project to visit the live site, or drag to spin the wheel.
      </p>
    </div>
  </section>
</template>

<script setup>
/*
  ProjectWheel – et drejeligt hjul af projekter.
  - Træk (mus eller finger) for at dreje. Hurtigt træk = anden kommer frem og drejer med.
  - Klik på et kort åbner projektets link (eller GitHub, hvis der ikke er et link).
  - Props: projects = samme array som data/projects.js (title, image, link, source).
*/
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import duckSprite from '../assets/images/duck-spin.webp'
import { wind } from '../particleWind.js'

const props = defineProps({
  projects: { type: Array, required: true },
})

const items = computed(() =>
  props.projects
    .filter((p) => p.image && (p.link || p.source))
    .map((p) => ({
      id: p.id,
      image: p.image,
      href: p.link || p.source,
      isSource: !p.link,
      name: String(p.title).replace(/^Webdesign\s*-\s*/i, ''),
    })),
)

// --- refs ---
const root = ref(null)
const content = ref(null)
const duckCanvas = ref(null)
const cardEls = []
const isDragging = ref(false)
const isSpinning = ref(false)

// --- indstillinger ---
const SPRITE_FRAMES = 20
const SPRITE_SIZE = 256
const DRIFT = 0.022 // px/ms langs toppen af hjulet
const SHOW_AT = 1.15 // px/ms – anden dukker op
const HIDE_AT = 0.45 // px/ms – anden forsvinder
const SPIN_PER_PX = 0.0007 // sprite-cyklusser pr. px
const MAX_SPRITE_STEP = 0.9 / SPRITE_FRAMES / 16.67 // max ~0,9 frame pr. skærmbillede
const DRAG_START = 6 // px før et tryk bliver til et træk

const clamp = (v, a, b) => Math.min(b, Math.max(a, v))

// --- state (ikke-reaktiv, opdateres hver frame) ---
let reduce = false
let R = 576
let STEP = 0.4
let LOOP = Math.PI * 2
let angle = 0
let vel = 0
let dir = 1
let dragging = false
let pointerId = null
let lastX = 0
let samples = []
let moved = 0
let hideTimer = 0
let phase = 0
let prevT = 0
let visible = true
let running = false
let rafId = 0
let layoutRaf = 0
let lastW = 0
let lastVH = 0
let opac = []
let ro = null
let io = null

// --- anden (sprite) ---
let sprite = null
let dctx = null
let lastFrame = -1
function drawDuck() {
  if (!sprite || !sprite.complete || !dctx) return
  const f = ((Math.floor(phase * SPRITE_FRAMES) % SPRITE_FRAMES) + SPRITE_FRAMES) % SPRITE_FRAMES
  if (f === lastFrame) return
  lastFrame = f
  dctx.clearRect(0, 0, SPRITE_SIZE, SPRITE_SIZE)
  dctx.drawImage(sprite, f * SPRITE_SIZE, 0, SPRITE_SIZE, SPRITE_SIZE, 0, 0, SPRITE_SIZE, SPRITE_SIZE)
}

// --- layout ---
function layout() {
  const el = root.value
  if (!el) return
  const W = el.clientWidth
  const vh = Math.max(600, window.innerHeight)
  // hjulets yderste kort skal flugte med sidens container (--container-max i main.css)
  const containerMax = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--container-max')) || Infinity
  const inner = Math.min(W, containerMax) - 24 // minus containerens padding
  const rDesk = Math.min(W * 0.42, inner / 2.26, (vh - 90) / 1.16, 720)
  const desktop = W >= 1024 && rDesk >= 480
  let cw
  if (desktop) {
    R = rDesk
    cw = clamp(R * 0.42, 200, 300)
  } else {
    cw = clamp(W * 0.46, 170, 250)
    R = clamp(W * 0.55, 400, 560)
  }
  const ch = cw * 0.62 // tæt på jeres screenshots (ca. 16:9)
  const N = items.value.length || 1
  STEP = Math.max((Math.PI * 2) / N, (cw * 1.1) / (R - ch / 2))
  LOOP = STEP * N
  el.style.setProperty('--cw', cw + 'px')
  el.style.setProperty('--ch', ch + 'px')
  el.style.setProperty('--av', clamp(W * 0.062, 80, 104) + 'px')

  // 1) regn ud hvor meget plads hjulet + teksten skal bruge
  const top0 = 48
  let cy = top0 + ch / 2 + R
  const h = content.value.offsetHeight
  let top, H
  if (desktop) {
    top = Math.max(cy - 28 - h, top0 + ch + 32)
    H = Math.max(cy + 24, top + h + 40)
  } else {
    top = cy - R + ch + 48
    H = Math.max(cy + 24, top + h + 64)
  }

  // 2) fyld skærmen under navbaren – er der plads til overs, centreres det hele lodret
  const navH = el.getBoundingClientRect().top + window.scrollY
  const avail = window.innerHeight - navH
  if (avail > H) {
    const extra = (avail - H) / 2
    cy += extra
    top += extra
    H = avail
  }

  el.style.setProperty('--cy', cy + 'px')
  el.style.setProperty('--ct', top + 'px')
  el.style.setProperty('--h', H + 'px')
}
function scheduleLayout(force) {
  const el = root.value
  if (!el) return
  if (!force && el.clientWidth === lastW && window.innerHeight === lastVH) return
  lastW = el.clientWidth
  lastVH = window.innerHeight
  cancelAnimationFrame(layoutRaf)
  layoutRaf = requestAnimationFrame(layout)
}
const onResize = () => scheduleLayout(false)

// --- pointer ---
function onPointerDown(e) {
  if (e.button !== 0) return
  dragging = true
  moved = 0
  pointerId = e.pointerId
  lastX = e.clientX
  samples = [{ x: e.clientX, t: e.timeStamp }]
  if (e.pointerType === 'mouse') e.preventDefault() // ingen tekstmarkering / link-drag
}
function onPointerMove(e) {
  if (!dragging || e.pointerId !== pointerId) return
  const dx = e.clientX - lastX
  lastX = e.clientX
  moved += Math.abs(dx)
  if (moved > DRAG_START && !isDragging.value) {
    isDragging.value = true
    try { root.value.setPointerCapture(e.pointerId) } catch (_) { /* ok */ }
  }
  angle += dx / R
  samples.push({ x: e.clientX, t: e.timeStamp })
  while (samples.length > 2 && e.timeStamp - samples[0].t > 90) samples.shift()
  const a = samples[0]
  const b = samples[samples.length - 1]
  if (b.t > a.t) vel = (b.x - a.x) / (b.t - a.t) / R
}
function onPointerEnd(e) {
  if (!dragging) return
  dragging = false
  pointerId = null
  if (e && samples.length && e.timeStamp - samples[samples.length - 1].t > 60) vel = 0
  if (Math.abs(vel) > 1e-6) dir = Math.sign(vel)
  // nulstil efter klik-eventet, så et træk ikke åbner linket
  setTimeout(() => { isDragging.value = false; moved = 0 }, 0)
}
function onClickCapture(e) {
  if (moved > DRAG_START) {
    e.preventDefault()
    e.stopPropagation()
  }
}
function onWheel(e) {
  if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return
  e.preventDefault()
  vel += (-e.deltaX / R) * 0.06
  dir = Math.sign(vel) || dir
}

function setSpinning(on) {
  if (on !== isSpinning.value) isSpinning.value = on
}

// --- animation ---
function tick(t) {
  const dt = Math.min(48, t - prevT)
  prevT = t
  const drift = reduce ? 0 : DRIFT
  if (!dragging) {
    const target = (dir * drift) / R
    vel = target + (vel - target) * Math.pow(0.955, dt / 16.67)
    angle += vel * dt
  } else {
    const last = samples[samples.length - 1]
    if (last && performance.now() - last.t > 70) vel *= Math.pow(0.8, dt / 16.67)
  }
  phase += clamp(vel * R * SPIN_PER_PX, -MAX_SPRITE_STEP, MAX_SPRITE_STEP) * dt

  for (let i = 0; i < cardEls.length; i++) {
    const card = cardEls[i]
    if (!card) continue
    let a = (((i * STEP + angle) % LOOP) + LOOP) % LOOP
    if (a > LOOP / 2) a -= LOOP
    const d = Math.abs(a)
    // kortene fader ud på vej ned mod bunden, så de aldrig bliver skåret over
    const o = d < 1.2 ? 1 : d > 1.75 ? 0 : 1 - (d - 1.2) / 0.55
    const q = Math.round(o * 20) / 20
    if (q !== opac[i]) {
      opac[i] = q
      card.style.opacity = q
      card.style.visibility = q ? '' : 'hidden'
    }
    if (q) card.style.transform = `rotate(${a}rad) translateY(${-R}px)`
  }

  const speed = Math.abs(vel) * R
  // partiklerne i baggrunden suser med, når hjulet drejer
  wind.x = reduce ? 0 : vel * R * 0.35
  if (speed > SHOW_AT) {
    clearTimeout(hideTimer)
    hideTimer = 0
    setSpinning(true)
  } else if (isSpinning.value && speed < HIDE_AT && !hideTimer) {
    hideTimer = setTimeout(() => { hideTimer = 0; setSpinning(false) }, 350)
  }
  if (isSpinning.value) drawDuck()

  if (visible) rafId = requestAnimationFrame(tick)
  else running = false
}
function start() {
  if (running) return
  running = true
  prevT = performance.now()
  rafId = requestAnimationFrame(tick)
}

onMounted(() => {
  reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  dctx = duckCanvas.value.getContext('2d')
  sprite = new Image()
  sprite.onload = () => drawDuck()
  sprite.src = duckSprite
  opac = new Array(items.value.length).fill(-1)
  vel = (reduce ? 0 : DRIFT) / R

  layout()
  lastW = root.value.clientWidth
  lastVH = window.innerHeight
  // Layout ændrer sektionens højde – vi reagerer kun på breddeændringer og
  // venter til næste frame (undgår "ResizeObserver loop completed…")
  ro = new ResizeObserver(() => scheduleLayout(false))
  ro.observe(root.value)
  window.addEventListener('resize', onResize)
  if (document.fonts) document.fonts.ready.then(() => scheduleLayout(true))
  root.value.addEventListener('wheel', onWheel, { passive: false })

  io = new IntersectionObserver(([en]) => {
    visible = en.isIntersecting
    if (visible) start()
  })
  io.observe(root.value)
  start()
})

onBeforeUnmount(() => {
  cancelAnimationFrame(rafId)
  cancelAnimationFrame(layoutRaf)
  clearTimeout(hideTimer)
  visible = false
  ro && ro.disconnect()
  io && io.disconnect()
  window.removeEventListener('resize', onResize)
  root.value && root.value.removeEventListener('wheel', onWheel)
  wind.x = 0
})
</script>

<style scoped>
/* Bruger portfolioens egne tokens fra main.css (mørk som standard, .light på #app skifter) */
.project-wheel {
  --pw-surface: var(--content-bg-dark);
  --pw-border: var(--border-dark);
  --pw-border-hover: var(--border-dark-hover);
  --pw-text: var(--text-dark);
  --pw-text-2: var(--text-dark-secondary);
  --pw-chip-bg: var(--text-dark);
  --pw-chip-fg: var(--bg-dark);

  position: relative;
  overflow: hidden;
  height: var(--h, 760px);
  color: var(--pw-text);
  touch-action: pan-y; /* lodret scroll virker stadig på mobil */
  cursor: grab;
  user-select: none;
  -webkit-user-select: none;
}
.light .project-wheel {
  --pw-surface: var(--content-bg-light);
  --pw-border: var(--border-light);
  --pw-border-hover: var(--border-light-hover);
  --pw-text: var(--text-light);
  --pw-text-2: var(--text-light-secondary);
  --pw-chip-bg: var(--text-light);
  --pw-chip-fg: var(--bg-light);
}
.project-wheel.is-dragging,
.project-wheel.is-dragging .pw-card {
  cursor: grabbing;
}

.pw-ring {
  position: absolute;
  left: 50%;
  top: var(--cy, 700px);
  width: 0;
  height: 0;
}

.pw-card {
  position: absolute;
  display: block;
  width: var(--cw, 220px);
  height: var(--ch, 136px);
  left: calc(var(--cw, 220px) / -2);
  top: calc(var(--ch, 136px) / -2);
  color: inherit;
  text-decoration: none;
  cursor: pointer;
  outline: none;
  will-change: transform, opacity;
  transition: opacity 0.25s linear;
  -webkit-user-drag: none;
  -webkit-tap-highlight-color: transparent;
}
.pw-card:hover,
.pw-card:focus-visible {
  z-index: 3;
}

.pw-frame {
  position: relative;
  width: 100%;
  height: 100%;
  padding: calc(var(--cw, 220px) * 0.028);
  border-radius: 8px;
  background: var(--pw-surface);
  border: 1px solid var(--pw-border);
  box-shadow: 0 20px 40px -20px rgba(0, 0, 0, 0.7);
  transition: transform 0.35s cubic-bezier(0.2, 0.9, 0.3, 1.2), border-color 0.3s, box-shadow 0.3s;
}
.project-wheel:not(.is-dragging) .pw-card:hover .pw-frame,
.pw-card:focus-visible .pw-frame {
  transform: scale(1.08);
  border-color: var(--pw-border-hover);
  box-shadow: 0 0 30px rgba(255, 255, 255, 0.08), 0 24px 44px -18px rgba(0, 0, 0, 0.8);
}
.pw-card:focus-visible .pw-frame {
  outline: 2px solid var(--pw-text);
  outline-offset: 3px;
}

.pw-screen {
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 5px;
  background: var(--pw-border);
}
.pw-screen img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
  display: block;
}

.pw-visit {
  position: absolute;
  right: calc(var(--cw, 220px) * 0.06);
  bottom: calc(var(--cw, 220px) * 0.06);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--pw-chip-bg);
  color: var(--pw-chip-fg);
  font-size: 13px;
  font-weight: 500;
  line-height: 1;
  padding: 8px 11px;
  border-radius: 6px;
  box-shadow: 0 6px 16px -6px rgba(0, 0, 0, 0.6);
  opacity: 0;
  transform: translateY(4px);
  transition: opacity 0.25s, transform 0.25s;
  pointer-events: none;
}
.project-wheel:not(.is-dragging) .pw-card:hover .pw-visit,
.pw-card:focus-visible .pw-visit {
  opacity: 1;
  transform: none;
}

.pw-content {
  position: absolute;
  left: 50%;
  top: var(--ct, 380px);
  transform: translateX(-50%);
  width: min(100% - 32px, 460px);
  text-align: center;
  z-index: 2;
}
/* samme pille som .section-title i resten af portfolioen */
.pw-eyebrow {
  display: inline-block;
  background: var(--pw-border);
  color: var(--pw-text);
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  margin: 0 0 22px;
  transition: opacity 0.2s;
}
/* titelboksen er mindst lige så høj som anden (+ luft) */
.pw-title {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(var(--av, 96px) + 16px);
}
.pw-title h2 {
  margin: 0;
  color: var(--pw-text);
  font-size: clamp(32px, 3.3vw, 50px);
  line-height: 1.08;
  letter-spacing: -0.03em;
  font-weight: 600;
  text-wrap: balance;
  transition: opacity 0.22s ease, transform 0.32s cubic-bezier(0.3, 1.4, 0.5, 1), filter 0.22s ease;
}
.pw-lead {
  margin: 34px auto 0;
  max-width: 38ch;
  color: var(--pw-text-2);
  font-size: clamp(16px, 1.2vw, 18px);
  line-height: 1.6;
}

.pw-avatar {
  position: absolute;
  left: 50%;
  top: 50%;
  width: var(--av, 96px);
  height: var(--av, 96px);
  margin: calc(var(--av, 96px) / -2) 0 0 calc(var(--av, 96px) / -2);
  border-radius: 50%;
  overflow: hidden;
  background: #b9ff5a;
  box-shadow: 0 0 0 3px var(--pw-surface), 0 0 0 4px var(--pw-border-hover), 0 12px 24px -10px rgba(0, 0, 0, 0.6);
  opacity: 0;
  transform: scale(0.4) rotate(-20deg);
  transition: opacity 0.18s ease, transform 0.45s cubic-bezier(0.25, 1.6, 0.45, 1);
  pointer-events: none;
}
.pw-avatar canvas {
  display: block;
  width: 84%;
  height: 84%;
  margin: 8% 0 0 8%;
  filter: drop-shadow(0 3px 4px rgba(0, 0, 0, 0.25));
}
.is-spinning .pw-avatar {
  opacity: 1;
  transform: scale(1) rotate(0);
  animation: pw-neon 1.8s linear infinite;
}
.is-spinning .pw-title h2 {
  opacity: 0;
  transform: scale(0.85);
  filter: blur(4px);
}
.is-spinning .pw-eyebrow {
  opacity: 0;
}
/* lyse neonfarver, der glider over i hinanden */
@keyframes pw-neon {
  0%   { background: #b9ff5a; }
  20%  { background: #5cf6ff; }
  40%  { background: #ff8cf0; }
  60%  { background: #fff45c; }
  80%  { background: #a89bff; }
  100% { background: #b9ff5a; }
}

@media (prefers-reduced-motion: reduce) {
  .pw-title h2,
  .pw-avatar {
    transition: opacity 0.2s linear;
  }
  .is-spinning .pw-title h2 {
    transform: none;
    filter: none;
  }
  .pw-avatar,
  .is-spinning .pw-avatar {
    transform: none;
  }
  .is-spinning .pw-avatar {
    animation-duration: 6s;
  }
}
</style>
