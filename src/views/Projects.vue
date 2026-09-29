<template>
    <div>
        <ParticleBackground />
        <ProjectWheel :projects="projects" />
        <Footer />
    </div>
</template>

<script setup>
import { projects } from '../data/projects.js'
import ParticleBackground from '../components/particleBackground.vue'
import ProjectWheel from '../components/projectWheel.vue'
import Footer from '../components/Footer.vue'

</script>

<style scoped>
.custom-container {
    max-width: var(--container-max);
}

.project-card {
    position: relative;
    background: var(--content-bg-dark);
    border-radius: 8px;
    overflow: hidden;
    transition: box-shadow 0.3s;
}
.light .project-card {
    background: var(--content-bg-light);
}

.img-wrapper {
    background: linear-gradient(360deg, var(--bg-dark) 29%, rgba(0, 0, 0, 0) 100%);
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
}
.light .img-wrapper {
    background: linear-gradient(360deg, var(--bg-light) 29%, rgba(255,255,255,0) 100%);
}
.img-wrapper::after {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(360deg, var(--bg-dark) 12%, rgba(0, 0, 0, 0.1) 80%);
    z-index: 2;
    pointer-events: none;
}
.light .img-wrapper::after {
    background: linear-gradient(360deg, var(--bg-light) 12%, rgba(255,255,255,0.1) 80%);
}

.img-wrapper:hover {
    text-align: center;
}

.mockup {
    width: 94%;
    transform: translateY(24px);
    z-index: 1;   
    transition: transform 0.3s ease-in-out;
}
.mockup:hover {
    transform: translateY(12px);
}

.card-details {
    position: relative;
    z-index: 2;
}

.card-title {
    color: var(--text-dark);
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 12px;
}
.light .card-title {
    color: var(--text-light);
}

.card-text {
    color: var(--text-dark-secondary);
    font-size: 1.1rem;
    margin-bottom: 24px;
}
.light .card-text {
    color: var(--text-light-secondary);
}

.card-actions {
    display: flex;
    gap: 8px;
}
</style>