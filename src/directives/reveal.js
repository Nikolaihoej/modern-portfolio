// v-reveal – makes an element glide in the first time it scrolls into view.
//
//   v-reveal        fade in + slide up (the styles are in main.css)
//   v-reveal="2"    the same, but waits 2 × 40 ms – for cards in a row
//   v-reveal:draw   only adds the class .is-visible – the component decides
//                   what happens (used by the timeline in work.vue)

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

// one shared observer for the whole site
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return
    entry.target.classList.add('is-visible')
    observer.unobserve(entry.target) // only the first time
  })
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' })

export const vReveal = {
  mounted(el, binding) {
    el.dataset.reveal = binding.arg === 'draw' ? 'draw' : 'fade'
    if (binding.value) el.style.setProperty('--i', binding.value)

    // no animation for people who have turned it off
    if (reduce) {
      el.classList.add('is-visible')
      return
    }
    observer.observe(el)
  },
  unmounted(el) {
    observer.unobserve(el)
  },
}
