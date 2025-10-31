<template>
  <div class="container custom-container mb-5">
    <div class="row g-3 justify-content-center">
      <div v-for="tech in techStack" :key="tech.title" class="col-6 col-md-4 col-lg-3">
        <div class="stack-card h-100">
          <div class="stack-icon">
            <FontAwesomeIcon :icon="tech.icon" />
          </div>
          <h3 class="stack-title">{{ tech.title }}</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faVuejs, faHtml5, faCss3Alt, faJs, faNodeJs, faFigma } from '@fortawesome/free-brands-svg-icons'
import { faLeaf, faDatabase } from '@fortawesome/free-solid-svg-icons'

const techStack = [
  { icon: faVuejs, title: 'Vue.js' },
  { icon: faHtml5, title: 'HTML 5' },
  { icon: faCss3Alt, title: 'CSS' },
  { icon: faJs, title: 'JavaScript' },
  { icon: faFigma, title: 'Figma' },
  { icon: faLeaf, title: 'MongoDB' },
  { icon: faNodeJs, title: 'Node.js' },
  { icon: faDatabase, title: 'SQL' },
];
</script>

<style scoped>
.custom-container {
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
    cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='36' viewBox='0 0 24 24'><circle cx='12' cy='12' r='9' fill='%23FFF' stroke='%23FFF' stroke-width='0.25'/></svg>") 12 18, auto;
}

.stack-card {
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 12px;
  padding: 20px 10px;
  text-align: center;
  transition: all 0.3s ease;
  height: 100%;
}
.stack-card:hover {
  border-color: #3a3a3a;
  transform: translateY(-4px);
  background: #222;
}
.stack-icon {
  font-size: 48px;
  margin-bottom: 20px;
  color: #fff;
}
.stack-title {
  font-size: 18px;
  font-weight: 600;
  color: #ccc;
  margin: 0;
}
</style>