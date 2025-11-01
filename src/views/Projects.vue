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
                            <a v-if="project.source" :href="project.source" target="_blank" class="btn btn-source"> <FontAwesomeIcon :icon="faGithub" class="me-2" /> Source</a>
                            <a v-if="project.link" :href="project.link" target="_blank" class="btn btn-visit"> <FontAwesomeIcon :icon="faGlobe" class="me-2" /> Visit</a>
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

const hoveredId = ref(null)
</script>

<style scoped>

.custom-container {
    max-width: 800px;
}
.project-card {
    position: relative;
    background: #262626;
    border-radius: 16px;
    overflow: hidden;
    transition: box-shadow 0.3s;
}

.img-wrapper {
    background: linear-gradient(360deg,hsl(0 0% 4%) 29%, rgba(0, 0, 0, 0) 100%);
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
}
.img-wrapper::after {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%; /* covers the image area */
    background: linear-gradient(360deg,hsl(0 0% 4%) 12%, rgba(0, 0, 0, 0.1) 80%);
    z-index: 2;
    pointer-events: none;
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
    color: #fff;
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 12px;
}

.card-text {
    color: #bdbdbd;
    font-size: 1.1rem;
    margin-bottom: 24px;
}

.card-actions {
    display: flex;
    gap: 8px;
}

.btn {
    display: flex;
    align-items: center;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 500;
    text-decoration: none;
    border: none;
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
}

.btn-source {
    background: #1e1e1e;
    border: 1px solid #2a2a2a;
    color: #fff;
}
.btn-source:hover {
    background: #4a4a4a;
    color: #fff;
}

.btn-visit {
    background: #1e1e1e;
    border: 1px solid #2a2a2a;
    color: #fff;
}
.btn-visit:hover {
    background: #4a4a4a;
    color: #fff;
}
</style>