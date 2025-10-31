<template>
    <div class="container custom-container mb-5">
        <h2 class="section-title">Recent projects</h2>
        <div class="row justify-content-center">
            <div v-for="project in recentProjects" :key="project.id" class="col-md-6 mb-4">
                <div class="project-card">
                    <div class="img-wrapper">
                        <img :src="project.image" :alt="project.title">
                    </div>
                    <div class="card-details">
                        <h3 class="card-title">{{ project.title }}</h3>
                        <p class="card-text">{{ project.description }}</p>
                    </div>
                </div>
            </div>
        </div>
        <router-link to="/projects" class="more-projects mb-4">More projects →</router-link>
    </div>
</template>

<script setup>
import { projects } from '../data/projects.js'

const recentProjects = projects.slice(0, 2)

</script>

<style scoped>
.custom-container {
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
}

.section-title {
    background: #2a2a2a;
    color: #fff;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 500;
    display: inline-block;
}

.project-card {
    background: #1a1a1a;
    border: 1px solid #2a2a2a;
    border-radius: 16px;
    overflow: hidden;
    transition: all 0.3s ease;
    height: 100%;
}

.project-card:hover {
    transform: translateY(-4px);
    border-color: #3a3a3a;
    box-shadow: 
        0 0 30px rgba(255, 255, 255, 0.1),
        0 0 60px rgba(255, 255, 255, 0.05),
        0 10px 30px rgba(0, 0, 0, 0.5);
}

.img-wrapper {
    padding: 20px 20px 0 20px;
    overflow: hidden;
}

.img-wrapper img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 12px;
    display: block;
    border: 1px solid #2a2a2a;
}

.card-details {
    padding: 24px;
}

.card-title {
    color: #fff;
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 12px;
}

.card-text {
    color: #aaa;
    font-size: 16px;
    line-height: 1.6;
    margin: 0;
    white-space: nowrap;         
    overflow: hidden;  
    text-overflow: ellipsis;
}

.more-projects {
    color: #fff;
    font-size: 18px;
    font-weight: 500;
    text-decoration: none;
    display: inline-block;
    transition: all 0.3s ease;
}

.more-projects:hover {
    color: #ddd;
    transform: translateX(4px);
}
</style>