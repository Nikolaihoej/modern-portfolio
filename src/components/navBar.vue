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
            </nav>
        </header>
    </div>
</template>
<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons'
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
    color: white;
    gap: 4px;
}

nav a {
    text-decoration: none;
    background: none;
    border: none;
    color: #bdbdbd;
    font-size: 1.2rem;
}
nav a:hover {
    color: #fff;
    transition: all 0.2s ease-in-out;
}

.logo a{
    text-decoration: none;
    background: none;
    border: none;
    color: #fff;

}
.logo:hover a {
    color: #bdbdbd;
    transition: all 0.2s ease-in-out;
}

.logo {
  font-size: 32px;
  font-weight: 700;
}
</style>