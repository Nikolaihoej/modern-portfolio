<template>
    <div class="container custom-container justify-content-center">
        <header class="d-flex justify-content-between align-items-center">
            <div class="logo"><router-link to="/">NHJ</router-link></div>
            <nav class="d-flex align-items-center gap-3">
                <router-link to="/projects">Projects</router-link>
                <a href="https://github.com/Nikolaihoej" target="_blank" rel="noopener">
                    <FontAwesomeIcon :icon="faGithub" />
                </a>
                <a href="https://www.linkedin.com/in/nikolai-jensen-472577195/" target="_blank" rel="noopener">
                    <FontAwesomeIcon :icon="faLinkedin" />
                </a>
                <a href="mailto:nikolaihoj@gmail.com" target="_blank" rel="noopener">
                    <FontAwesomeIcon :icon="faEnvelope" />
                </a>
                <button class="p-0" @click="toggleTheme">
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
import { ref, onMounted } from 'vue'

const isDark = ref(true)

function toggleTheme() {
  isDark.value = !isDark.value
  document.body.classList.toggle('light', !isDark.value)
  document.body.classList.toggle('dark', isDark.value)
}

onMounted(() => {
  document.body.classList.add('dark')
})
</script>


<style scoped>
.custom-container {
    max-width: 800px;
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
    font-size: 1.2rem;
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
    font-size: 32px;
    font-weight: 700;
}
</style>