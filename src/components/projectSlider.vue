<template>
  <section class="project-slider" aria-labelledby="projectSliderTitle">
    <div class="container custom-container">
      <p class="section-title">Selected work</p>
      <h1 id="projectSliderTitle" class="ps-title">Projects</h1>
      <p class="ps-lead lead-text">
        Websites I’ve designed for real clients - <strong>The projects are designed at my workplace næmt.nu.</strong> Click a project to visit the live site, or drag to browse.
      </p>

      <!-- the WebGL canvas with the cards is put in here -->
      <div
        ref="stage"
        class="ps-stage"
        :class="{ 'is-dragging': isDragging, 'over-active': overActive }"
        tabindex="0"
        aria-label="Project slider. Use the arrow keys to browse and Enter to open a project."
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
        @pointercancel="onPointerUp"
        @pointerleave="overActive = false"
        @keydown="onKeyDown"
      ></div>

      <div class="ps-info">
        <div class="ps-info-text">
          <div class="ps-counter meta">
            <b>{{ pad(activeIndex + 1) }}</b> / {{ pad(items.length) }} · Webdesign
          </div>
          <Transition name="ps-swap" mode="out-in">
            <h3 :key="active.name" class="ps-name">{{ active.name }}</h3>
          </Transition>
        </div>

        <div class="ps-actions">
          <button class="ps-arrow" aria-label="Previous project" @click="goTo(target - 1)">←</button>
          <button class="ps-arrow" aria-label="Next project" @click="goTo(target + 1)">→</button>
          <a class="ps-visit" :href="active.href" target="_blank" rel="noopener">
            {{ active.isSource ? 'View source' : 'Visit site' }}
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M3.5 8.5l5-5M4.5 3.5h4v4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
/*
  ProjectSlider – a row of project cards you can drag through.
  - Drag, swipe, sideways trackpad scroll, arrow keys or the buttons move it.
  - When it moves fast, the cards bend like rubber (done in the vertex shader below).
  - Click the middle card to open the site. Click a side card to jump to it.
  - Props: projects = the same array as data/projects.js (title, image, link, source).
*/
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import {
  WebGLRenderer, Scene, OrthographicCamera, PlaneGeometry, ShaderMaterial,
  Mesh, TextureLoader, Vector2, Vector3, LinearFilter,
} from 'three'
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

const stage = ref(null)
const activeIndex = ref(0)
const isDragging = ref(false)
const overActive = ref(false)
const active = computed(() => items.value[activeIndex.value] || {})

const pad = (n) => String(n).padStart(2, '0')
const clamp = (v, min, max) => Math.min(max, Math.max(min, v))

// background colours the side cards fade towards (same as --bg-dark / --bg-light)
const BG_DARK = new Vector3(0.039, 0.039, 0.039) // #0a0a0a
const BG_LIGHT = new Vector3(0.98, 0.98, 0.98)   // #FAFAFA

/* ------------------------------------------------------------------
   Shaders – this is where the "rubber" effect lives
   ------------------------------------------------------------------ */

// Moves the corners of every little square in the card.
// When the slider stands still (uVelocity = 0) the card is flat.
const vertexShader = `
  uniform float uVelocity;   // how fast we move, and which way (about -1 .. 1)
  uniform vec2  uHalf;       // half the width / height of the canvas, in px
  uniform vec2  uCard;       // card size in px
  varying vec2  vUv;

  void main() {
    vUv = uv;
    vec4 world = modelMatrix * vec4(position, 1.0);

    float speed = abs(uVelocity);
    float nx = world.x / uHalf.x;     // -1 = left edge of the canvas, 1 = right edge
    float ny = position.y * 2.0;      // -1 = bottom of the card, 1 = top

    // 1. cards get taller the further out to the sides they are
    world.y *= 1.0 + speed * nx * nx * 0.45;

    // 2. top and bottom of the card drag behind, so the card bends like rubber
    world.x -= uVelocity * ny * ny * uCard.x * 0.12;

    // 3. everything shrinks a tiny bit while it moves
    world.xy *= 1.0 - speed * 0.05;

    gl_Position = projectionMatrix * viewMatrix * world;
  }
`

// Paints the picture, rounds the corners and dims the side cards.
const fragmentShader = `
  uniform sampler2D uTexture;
  uniform vec2  uCard;          // card size in px
  uniform float uImageAspect;   // width / height of the picture
  uniform float uRadius;        // corner radius in px
  uniform float uDim;           // 0 = full colour, 1 = same colour as the background
  uniform vec3  uBg;            // background colour
  varying vec2  vUv;

  void main() {
    // "object-fit: cover" + "object-position: top" – crop the picture so it fills the card
    float cardAspect = uCard.x / uCard.y;
    vec2 uv = vUv;
    if (uImageAspect > cardAspect) {
      uv.x = (uv.x - 0.5) * cardAspect / uImageAspect + 0.5;
    } else {
      uv.y = 1.0 - (1.0 - uv.y) * uImageAspect / cardAspect;
    }
    vec3 color = texture2D(uTexture, uv).rgb;

    // dim the cards that are not in the middle
    color = mix(color, uBg, uDim);

    // rounded corners
    vec2 p = (vUv - 0.5) * uCard;
    vec2 q = abs(p) - uCard * 0.5 + uRadius;
    float d = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - uRadius;
    float alpha = 1.0 - smoothstep(-1.0, 0.5, d);

    gl_FragColor = vec4(color, alpha);
  }
`

/* ------------------------------------------------------------------
   State (not reactive – it changes every frame)
   ------------------------------------------------------------------ */

let renderer, scene, camera, geometry
let cards = []

let width = 0       // canvas width in px
let cardW = 0
let cardH = 0
let spacing = 0     // distance from one card to the next

let current = 0     // where the slider is right now (1 = one card)
let target = 0      // where it is heading
let velocity = 0    // smoothed speed, used by the shader
let reduce = false  // prefers-reduced-motion

let rafId = 0
let lastTime = 0
let visible = false
let resizeObserver = null
let visibleObserver = null
let themeObserver = null

// pointer
const DRAG_START = 6 // px before a press turns into a drag
let pointerDown = false
let startX = 0
let lastX = 0
let lastMoveTime = 0
let dragSpeed = 0
let movedPx = 0

// keeps a number between 0 and count-1, also for negative numbers
function wrapIndex(i) {
  const n = items.value.length
  return ((i % n) + n) % n
}

function goTo(index) {
  target = Math.round(index)
}

function openActive() {
  const project = items.value[activeIndex.value]
  if (project) window.open(project.href, '_blank', 'noopener')
}

/* ------------------------------------------------------------------
   Setup
   ------------------------------------------------------------------ */

function createScene() {
  renderer = new WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  stage.value.appendChild(renderer.domElement)

  scene = new Scene()
  camera = new OrthographicCamera(-1, 1, 1, -1, -10, 10) // sized in resize()

  // one plane with many small squares, so it can bend smoothly
  geometry = new PlaneGeometry(1, 1, 40, 20)
  const loader = new TextureLoader()

  cards = items.value.map((project) => {
    const material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      uniforms: {
        uTexture: { value: null },
        uVelocity: { value: 0 },
        uHalf: { value: new Vector2(1, 1) },
        uCard: { value: new Vector2(1, 1) },
        uImageAspect: { value: 1.9 },
        uRadius: { value: 12 },
        uDim: { value: 0 },
        uBg: { value: BG_DARK },
      },
    })

    loader.load(project.image, (texture) => {
      texture.minFilter = LinearFilter
      texture.generateMipmaps = false
      material.uniforms.uTexture.value = texture
      material.uniforms.uImageAspect.value = texture.image.width / texture.image.height
    })

    const mesh = new Mesh(geometry, material)
    scene.add(mesh)
    return mesh
  })
}

function resize() {
  const newWidth = stage.value.clientWidth
  if (!newWidth || newWidth === width) return
  width = newWidth
  const isMobile = width < 700

  cardW = width * (isMobile ? 0.8 : 0.58)
  cardH = cardW / 1.9 // close to the screenshots
  spacing = cardW + (isMobile ? 16 : 32)
  const height = Math.round(cardH * 1.3) // room for the cards to grow while bending

  renderer.setSize(width, height)
  camera.left = -width / 2
  camera.right = width / 2
  camera.top = height / 2
  camera.bottom = -height / 2
  camera.updateProjectionMatrix()

  cards.forEach((mesh) => {
    mesh.scale.set(cardW, cardH, 1)
    mesh.material.uniforms.uHalf.value.set(width / 2, height / 2)
    mesh.material.uniforms.uCard.value.set(cardW, cardH)
    mesh.material.uniforms.uRadius.value = isMobile ? 8 : 12
  })

  if (!visible) renderer.render(scene, camera)
}

// follow the theme toggle in the navbar (it puts .light on <body>)
function setTheme() {
  const bg = document.body.classList.contains('light') ? BG_LIGHT : BG_DARK
  cards.forEach((mesh) => (mesh.material.uniforms.uBg.value = bg))
}

/* ------------------------------------------------------------------
   Animation
   ------------------------------------------------------------------ */

function tick(now) {
  const dt = Math.min((now - lastTime) / 16.67, 3) // 1 = one frame at 60 fps
  lastTime = now

  const before = current
  current += (target - current) * (1 - Math.pow(1 - 0.09, dt))

  // how far we moved this frame → smoothed, so the bend eases in and out
  const moved = (current - before) / dt
  velocity += (moved - velocity) * 0.15
  const bend = reduce ? 0 : clamp(velocity * 14, -1.4, 1.4)

  const n = cards.length
  cards.forEach((mesh, i) => {
    // distance from the middle, wrapped so the slider never ends
    let offset = i - current
    offset = ((offset % n) + n + n / 2) % n - n / 2

    mesh.position.x = offset * spacing
    mesh.material.uniforms.uVelocity.value = bend
    mesh.material.uniforms.uDim.value = Math.min(Math.abs(offset), 1) * 0.6
  })

  // the stars in the background rush along when the slider moves
  wind.x = reduce ? 0 : ((-velocity * spacing) / 16.67) * 0.35

  activeIndex.value = wrapIndex(Math.round(current))
  renderer.render(scene, camera)

  if (visible) rafId = requestAnimationFrame(tick)
  else wind.x = 0
}

/* ------------------------------------------------------------------
   Input
   ------------------------------------------------------------------ */

// x position of the pointer, measured from the middle of the canvas
function pointerOffset(e) {
  return e.clientX - stage.value.getBoundingClientRect().left - width / 2
}

function onPointerDown(e) {
  if (e.button !== 0) return
  pointerDown = true
  startX = lastX = e.clientX
  lastMoveTime = performance.now()
  dragSpeed = 0
  movedPx = 0
  stage.value.setPointerCapture(e.pointerId)
  if (e.pointerType === 'mouse') e.preventDefault() // no text selection
}

function onPointerMove(e) {
  if (!pointerDown) {
    // pointer cursor only over the card in the middle
    overActive.value = Math.abs(pointerOffset(e)) < cardW / 2
    return
  }

  const dx = e.clientX - lastX
  const time = performance.now()
  movedPx = Math.max(movedPx, Math.abs(e.clientX - startX))
  if (movedPx > DRAG_START) isDragging.value = true

  target -= dx / spacing
  dragSpeed = dx / Math.max(time - lastMoveTime, 1) // px per ms
  lastX = e.clientX
  lastMoveTime = time
}

function onPointerUp(e) {
  if (!pointerDown) return
  pointerDown = false
  isDragging.value = false

  // a press without movement = a click
  if (movedPx <= DRAG_START) {
    const x = pointerOffset(e)
    const clicked = Math.round(x / spacing)
    if (clicked === 0 && Math.abs(x) < cardW / 2) openActive()
    else goTo(Math.round(current) + clicked)
    return
  }

  // if the finger stopped before letting go, don't throw
  if (performance.now() - lastMoveTime > 60) dragSpeed = 0

  // a fast flick throws the slider a few cards further
  goTo(target + clamp(-dragSpeed * 1.5, -3, 3))
}

// sideways scroll on a trackpad
let wheelTimer = 0
function onWheel(e) {
  if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return // normal page scroll
  e.preventDefault()
  target += e.deltaX / spacing
  clearTimeout(wheelTimer)
  wheelTimer = setTimeout(() => goTo(target), 120)
}

// arrow keys only work when the slider has focus, so the page doesn't jump
function onKeyDown(e) {
  if (e.key === 'ArrowRight') { goTo(target + 1); e.preventDefault() }
  if (e.key === 'ArrowLeft') { goTo(target - 1); e.preventDefault() }
  if (e.key === 'Enter') openActive()
}

/* ------------------------------------------------------------------
   Mount / unmount
   ------------------------------------------------------------------ */

onMounted(() => {
  reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  createScene()
  resize()
  setTheme()

  resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(stage.value)

  themeObserver = new MutationObserver(setTheme)
  themeObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] })

  stage.value.addEventListener('wheel', onWheel, { passive: false })

  // only animate while the slider can be seen
  visibleObserver = new IntersectionObserver(([entry]) => {
    const wasVisible = visible
    visible = entry.isIntersecting
    if (visible && !wasVisible) {
      lastTime = performance.now()
      rafId = requestAnimationFrame(tick)
    }
  })
  visibleObserver.observe(stage.value)
})

onBeforeUnmount(() => {
  visible = false
  cancelAnimationFrame(rafId)
  clearTimeout(wheelTimer)
  resizeObserver && resizeObserver.disconnect()
  visibleObserver && visibleObserver.disconnect()
  themeObserver && themeObserver.disconnect()
  stage.value && stage.value.removeEventListener('wheel', onWheel)
  wind.x = 0

  // free the GPU memory
  cards.forEach((mesh) => {
    const texture = mesh.material.uniforms.uTexture.value
    if (texture) texture.dispose()
    mesh.material.dispose()
  })
  geometry && geometry.dispose()
  renderer && renderer.dispose()
})
</script>

<style scoped>
.project-slider {
  padding: 48px 0 64px;
  color: var(--text-dark);
}
.light .project-slider {
  color: var(--text-light);
}

.custom-container {
  max-width: var(--container-max);
  margin-left: auto;
  margin-right: auto;
}

/* ---------- heading ---------- */

/* the pill, h1 and lead text get their look from main.css */
.ps-title {
  margin: 0;
}

.ps-lead {
  margin: 16px 0 0;
  max-width: 60ch;
  color: var(--text-dark-secondary);
}
.light .ps-lead {
  color: var(--text-light-secondary);
}

/* ---------- the slider ---------- */

.ps-stage {
  margin-top: 32px;
  cursor: grab;
  outline: none;
  touch-action: pan-y; /* phones can still scroll the page up and down */
  user-select: none;
  -webkit-user-select: none;
  -webkit-tap-highlight-color: transparent;
  /* soft fade at the left and right edge, so the side cards don't get a hard cut */
  -webkit-mask-image: linear-gradient(90deg, transparent 0, #000 8%, #000 92%, transparent 100%);
          mask-image: linear-gradient(90deg, transparent 0, #000 8%, #000 92%, transparent 100%);
}
.ps-stage.over-active {
  cursor: pointer;
}
.ps-stage.is-dragging {
  cursor: grabbing;
}
.ps-stage :deep(canvas) {
  display: block;
}

/* ---------- info under the slider ---------- */

.ps-info {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-top: 16px;
}

.ps-info-text {
  min-width: 0;
}

.ps-counter {
  margin-bottom: 6px;
  font-variant-numeric: tabular-nums;
}
.ps-counter b {
  font-weight: 700;
  color: var(--text-dark);
}
.light .ps-counter b {
  color: var(--text-light);
}

.ps-name {
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* the project name slides in when it changes */
.ps-swap-enter-active,
.ps-swap-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.ps-swap-enter-from,
.ps-swap-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

.ps-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.ps-arrow {
  width: 44px;
  height: 44px;
  border-radius: 8px;
  border: 1px solid var(--border-dark);
  background: var(--content-bg-dark);
  color: var(--text-dark);
  font-size: 18px;
  cursor: pointer;
  transition: border-color 0.2s ease;
}
.ps-arrow:hover {
  border-color: var(--border-dark-hover);
}
.light .ps-arrow {
  border-color: var(--border-light);
  background: var(--content-bg-light);
  color: var(--text-light);
}
.light .ps-arrow:hover {
  border-color: var(--border-light-hover);
}

.ps-visit {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 44px;
  padding: 0 20px;
  border-radius: 8px;
  background: var(--text-dark);
  color: var(--bg-dark);
  font-family: var(--font-heading);
  font-size: var(--fs-label);
  font-weight: 500;
  text-decoration: none;
  transition: background 0.2s ease;
}
.ps-visit:hover {
  background: #d9d9d9;
  color: var(--bg-dark);
}
.light .ps-visit {
  background: var(--text-light);
  color: var(--bg-light);
}
.light .ps-visit:hover {
  background: #333333;
  color: var(--bg-light);
}

@media (max-width: 600px) {
  .ps-info {
    flex-direction: column;
    align-items: stretch;
  }
  .ps-actions {
    justify-content: space-between;
  }
  .ps-visit {
    flex: 1;
    justify-content: center;
  }
}

@media (prefers-reduced-motion: reduce) {
  .ps-swap-enter-active,
  .ps-swap-leave-active {
    transition: opacity 0.15s linear;
  }
  .ps-swap-enter-from,
  .ps-swap-leave-to {
    transform: none;
  }
}
</style>
