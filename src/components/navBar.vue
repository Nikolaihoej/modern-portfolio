<template>
    <div class="container custom-container justify-content-center">
        <header class="d-flex justify-content-between align-items-center">
            <div class="logo"><router-link to="/">NHJ</router-link></div>
            <nav class="d-flex align-items-center gap-3">
                <router-link to="/projects">Projects</router-link>
                <a href="https://github.com/Nikolaihoej" target="_blank" rel="noopener" aria-label="GitHub">
                    <FontAwesomeIcon :icon="faGithub" />
                </a>
                <a href="https://www.linkedin.com/in/nikolai-jensen-472577195/" target="_blank" rel="noopener" aria-label="LinkedIn">
                    <FontAwesomeIcon :icon="faLinkedin" />
                </a>
                <a href="mailto:nikolaihoj@gmail.com" target="_blank" rel="noopener" aria-label="Email">
                    <FontAwesomeIcon :icon="faEnvelope" />
                </a>
                <button class="p-0" @click="toggleTheme" aria-label="Toggle Theme">
                    <FontAwesomeIcon :icon="isDark ? faSun : faMoon" />
                </button>
            </nav>
        </header>
    </div>
</template>
<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faEnvelope, faMoon, faSun } from '@fortawesome/free-solid-svg-icons'
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons'
import { ref, nextTick } from 'vue'

const isDark = ref(true)

function toggleTheme(event) {
  const body = document.body
  const change = async () => {
    body.classList.add('theme-switching') // the glow skips its slow 3s fade, so it changes with the theme
    isDark.value = !isDark.value
    document.body.classList.toggle('light', !isDark.value)
    await nextTick() // let Vue swap the sun/moon icon before the new theme is shown
  }

  // the slow glow fade is turned back on when the theme change is done (it is still used by the hero)
  const done = () => body.classList.remove('theme-switching')

  // browsers without View Transitions, and people who have turned motion off, just switch
  if (!document.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    change().then(() => requestAnimationFrame(() => requestAnimationFrame(done)))
    return
  }

  // the new theme spreads out as a circle from the button
  const button = event.currentTarget.getBoundingClientRect()
  const x = button.left + button.width / 2
  const y = button.top + button.height / 2
  const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y)) // far enough to cover the screen

  const transition = document.startViewTransition(change)
  transition.finished.finally(done)
  transition.ready.then(() => {
    document.documentElement.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
      { duration: 550, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', pseudoElement: '::view-transition-new(root)' }
    )
  })
}
</script>


<style scoped>
.custom-container {
    max-width: var(--container-max);
    margin-left: auto;
    margin-right: auto;
}

header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: center;
    color: var(--text-dark);
    gap: 4px;
}
.light header {
    color: var(--text-light);
}

nav a, nav button {
    text-decoration: none;
    background: none;
    border: none;
    color: var(--text-dark-secondary);
    font-family: var(--font-heading);
    font-size: var(--fs-h4);
    font-weight: 500;
    transition: color 0.2s ease-in-out;
}
.light nav a, .light nav button {
    color: var(--text-light-secondary);
}
nav a:hover, nav button:hover {
    color: var(--text-dark);
}
.light nav a:hover, .light nav button:hover {
    color: var(--text-light);
}

.logo a {
    text-decoration: none;
    background: none;
    border: none;
    color: var(--text-dark);
    transition: color 0.2s ease-in-out;
}
.light .logo a {
    color: var(--text-light);
}
.logo:hover a {
    color: var(--text-dark-secondary);
}
.light .logo:hover a {
    color: var(--text-light-secondary);
}

.logo {
    font-family: var(--font-heading);
    font-size: 32px;
    font-weight: 700;
}
</style>