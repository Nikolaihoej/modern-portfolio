<template>
  <section ref="root" class="container custom-container usps mb-5" aria-label="Key numbers">
    <div class="row g-2">
      <div v-for="(usp, i) in usps" :key="usp.label" class="col-md-4 d-flex" v-reveal="i">
        <div class="usp-card flex-fill">
          <p class="usp-number">
            <!-- the counting number is only for the eye – screen readers get the final number -->
            <span aria-hidden="true">{{ shown[i] }}<small v-if="usp.unit">{{ usp.unit }}</small></span>
            <span class="visually-hidden">{{ usp.value }} {{ usp.unit }}</span>
          </p>
          <p class="usp-label">{{ usp.label }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
/*
  Usps – three numbers that count up when they scroll into view.
  The numbers come from the site's own data, so they stay true by themselves:
  add a project to data/projects.js and the first number goes up.
*/
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { projects } from '../data/projects.js'
import { educationTimeline } from '../data/education.js'

const START_YEAR = 2021 // started Multimedia Design at UCL

const usps = [
  { value: projects.length, unit: '', label: 'Websites designed for real clients' },
  { value: new Date().getFullYear() - START_YEAR, unit: 'years', label: 'Working with web development & multimedia design' },
  { value: educationTimeline.length, unit: '', label: 'Degrees in multimedia design & web development' },
]

const root = ref(null)
const shown = ref(usps.map(() => 0)) // the numbers on screen while counting
let observer = null
let rafId = 0

// count from 0 up to the real numbers
function countUp() {
  const duration = 1200
  const start = performance.now()

  function step(now) {
    const t = Math.min((now - start) / duration, 1)
    const eased = 1 - Math.pow(1 - t, 3) // fast start, soft stop
    shown.value = usps.map((usp) => Math.round(usp.value * eased))
    if (t < 1) rafId = requestAnimationFrame(step)
  }
  rafId = requestAnimationFrame(step)
}

onMounted(() => {
  // no animation for people who have turned it off
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    shown.value = usps.map((usp) => usp.value)
    return
  }

  // start counting when the numbers scroll into view
  observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return
    countUp()
    observer.disconnect()
  }, { threshold: 0.4 })
  observer.observe(root.value)
})

onBeforeUnmount(() => {
  observer && observer.disconnect()
  cancelAnimationFrame(rafId)
})
</script>

<style scoped>
.custom-container {
  max-width: var(--container-max);
  margin-left: auto;
  margin-right: auto;
}

/* same look as the cards in techTree.vue */
.usp-card {
  padding: 28px 24px;
  border-radius: 8px;
  background: var(--content-bg-dark);
  border: 1px solid var(--border-dark);
}
.light .usp-card {
  background: var(--content-bg-light);
  border-color: var(--border-light);
}

/* a display number – bigger than an h2, but in the same font */
.usp-number {
  margin: 0;
  color: var(--text-dark);
  font-family: var(--font-heading);
  font-size: clamp(40px, 4.4vw, 56px);
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
}
.light .usp-number {
  color: var(--text-light);
}
.usp-number small {
  margin-left: 4px;
  font-size: 0.45em;
  font-weight: 500;
  letter-spacing: 0;
  color: var(--text-dark-secondary);
}
.light .usp-number small {
  color: var(--text-light-secondary);
}

.usp-label {
  margin: 10px 0 0;
  color: var(--text-dark-secondary);
}
.light .usp-label {
  color: var(--text-light-secondary);
}

/* phones: number and text side by side, one card per row */
@media (max-width: 767.98px) {
  .usp-card {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 20px;
  }
  .usp-number {
    min-width: 3.2ch;
  }
  .usp-label {
    margin: 0;
  }
}
</style>
