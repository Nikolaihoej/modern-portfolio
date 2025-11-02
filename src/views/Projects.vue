<template>
    <div>
        <ParticleBackground />
        <div class="container custom-container">
            <h2 class="section-title mb-4 mt-5">Projects</h2>
            <div class="row justify-content-center">
                <div v-for="project in projects" :key="project.id">
                    <div class="project-card">
                    
                        <div class="img-wrapper" :style="project.id === hoveredId ? { backgroundColor: project.hoverColor } : {}" @mouseenter="hoveredId = project.id" @mouseleave="hoveredId = null">
                            <safariMock class="mockup" :src="project.image" :url="project.url" :alt="project.title" />
                        </div>
                    </div>
                    <div class="card-details mb-5">
                        <h3 class="card-title">{{ project.title }}</h3>
                        <p class="card-text">{{ project.description }}</p>
                        <div class="card-actions">
                            <projectBtn v-if="project.source" :href="project.source" target="_blank">
                                <FontAwesomeIcon :icon="faGithub" class="me-1" /> Source
                            </projectBtn>

                            <projectBtn v-if="project.link" :href="project.link" target="_blank">
                                <FontAwesomeIcon :icon="faGlobe" class="me-1" /> Visit
                            </projectBtn>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { projects } from '../data/projects.js'
import ParticleBackground from '../components/particleBackground.vue'
import safariMock from '../components/safariMock.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { faGlobe } from '@fortawesome/free-solid-svg-icons'
import projectBtn from '../components/projectBtn.vue'

const hoveredId = ref(null)
</script>

<style scoped>
.custom-container {
    max-width: 800px;
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