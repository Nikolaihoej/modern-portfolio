<template>
    <div class="container custom-container mb-5">
        <h2 class="section-title">Recent projects</h2>

        <div class="row justify-content-center">
            <div v-for="project in recentProjects" :key="project.id" class="col-md-6 mb-4">
                <router-link :to="`/projects`" class="project-link">
                    <div class="project-card">
                        <div class="img-wrapper">
                            <img :src="project.image" :alt="project.title">
                        </div>
                        <div class="card-details">
                            <p class="meta">Webdesign</p>
                            <h3 class="card-title">{{ project.name }}</h3>
                        </div>
                    </div>
                </router-link>
            </div>
        </div>

        <router-link to="/projects" class="more-projects mb-4">More projects →</router-link>
    </div>
</template>

<script setup>
import { projects } from '../data/projects.js'

// the two newest projects – "Webdesign - " is shown as a small label instead
const recentProjects = projects.slice(0, 2).map((project) => ({
    ...project,
    name: project.title.replace(/^Webdesign\s*-\s*/i, ''),
}))

</script>

<style scoped>
.custom-container {
    max-width: var(--container-max);
    margin-left: auto;
    margin-right: auto;
}

.project-card {
    background: var(--content-bg-dark);
    border: 1px solid var(--border-dark);
    border-radius: 8px;
    overflow: hidden;
    transition: all 0.3s ease;
    height: 100%;
}
.light .project-card {
    background: var(--content-bg-light);
    border: 1px solid var(--border-light);
}

.project-card:hover {
    transform: translateY(-4px);
    border-color: var(--border-dark-hover);
    box-shadow: 
        0 0 30px rgba(255, 255, 255, 0.1),
        0 0 60px rgba(255, 255, 255, 0.05),
        0 10px 30px rgba(0, 0, 0, 0.5);
}
.light .project-card:hover {
    border-color: var(--border-light-hover);
}

.project-link {
    text-decoration: none;
    color: inherit;
}

.img-wrapper {
    padding: 20px 20px 0 20px;
    overflow: hidden;
}

.img-wrapper img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 8px;
    display: block;
    border: 1px solid var(--border-dark);
}
.light .img-wrapper img {
    border: 1px solid var(--border-light);
}

.card-details {
    padding: 24px;
}

.card-details .meta {
    margin: 0 0 8px;
}

.card-title {
    color: var(--text-dark);
    margin: 0;
}
.light .card-title {
    color: var(--text-light);
}

.more-projects {
    color: var(--text-dark);
    font-family: var(--font-heading);
    font-size: var(--fs-label);
    font-weight: 500;
    text-decoration: none;
    display: inline-block;
    transition: all 0.3s ease;
}
.light .more-projects {
    color: var(--text-light);
}
.more-projects:hover {
    color: var(--text-dark-secondary);
    transform: translateX(4px);
}
.light .more-projects:hover {
    color: var(--text-light-secondary);
}
</style>