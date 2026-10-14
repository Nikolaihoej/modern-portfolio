<template>
    <div>
        <ParticleBackground />
        <ProjectSlider :projects="projects" />
        <Footer />
    </div>
</template>

<script setup>
import { projects } from '../data/projects.js'
import ParticleBackground from '../components/particleBackground.vue'
import ProjectSlider from '../components/projectSlider.vue'
import Footer from '../components/footer.vue'

</script>
