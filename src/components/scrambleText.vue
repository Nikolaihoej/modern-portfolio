<template>
  <span ref="root" class="scramble-text">
    <span class="visually-hidden">{{ text }}</span>
    <!-- the full text is invisible, but keeps the size, so the pill never jumps -->
    <span class="ghost" aria-hidden="true">{{ text }}</span>
    <span class="shown" aria-hidden="true">{{ done }}<span class="rest">{{ rest }}</span></span>
  </span>
</template>

<script setup>
/*
  ScrambleText – random signs that fall into place from left to right.
  Runs the first time the text scrolls into view, and again when the text
  changes (fx "Work" → "Education" in work.vue).

  Use it inside a label:  <h2 class="section-title"><ScrambleText text="Technology Stack" /></h2>
*/
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  text: { type: String, required: true },
})

const DURATION = 450 // ms until the whole word is in place
const SIGNS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#%*+=/?'

const root = ref(null)
const done = ref('') // letters that are in place
const rest = ref('') // letters that are still scrambling
let started = false
let timer = 0
let observer = null
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

const randomSign = () => SIGNS[Math.floor(Math.random() * SIGNS.length)]

function scramble() {
  clearInterval(timer)
  const text = props.text

  if (reduce) {
    done.value = text
    rest.value = ''
    return
  }

  const start = performance.now()
  timer = setInterval(() => {
    const progress = Math.min((performance.now() - start) / DURATION, 1)
    const count = Math.floor(progress * text.length)
    done.value = text.slice(0, count)
    rest.value = text.slice(count).replace(/\S/g, randomSign) // spaces stay spaces
    if (progress === 1) clearInterval(timer)
  }, 35)
}

// a new text (fx when you switch tab) scrambles in again
watch(() => props.text, () => {
  if (started) scramble()
})

onMounted(() => {
  // no animation for people who have turned it off – just show the text
  if (reduce) {
    started = true
    scramble()
    return
  }

  // start when the label scrolls into view
  observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return
    started = true
    scramble()
    observer.disconnect()
  }, { threshold: 0.5 })
  observer.observe(root.value)
})

onBeforeUnmount(() => {
  clearInterval(timer)
  observer && observer.disconnect()
})
</script>

<style scoped>
.scramble-text {
  position: relative;
  display: inline-block;
  white-space: nowrap;
}
.ghost {
  visibility: hidden;
}
.shown {
  position: absolute;
  left: 0;
  top: 0;
}
/* the letters that are still scrambling are in the accent colour */
.rest {
  color: var(--accent);
  opacity: 0.8;
}
</style>
