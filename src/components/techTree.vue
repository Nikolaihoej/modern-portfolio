<template>
  <div class="container custom-container mb-5">
    <div class="row g-2 justify-content-center">
      <div v-for="tech in techStack" :key="tech.title" class="col-3 d-flex">
        <div class="stack-card flex-fill">
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
  { icon: faJs, title: 'JavaScript' },
  { icon: faCss3Alt, title: 'CSS' },
  { icon: faHtml5, title: 'HTML 5' },
  { icon: faFigma, title: 'Figma' },
  { icon: faNodeJs, title: 'Node.js' },
  { icon: faLeaf, title: 'MongoDB' },
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
  background: var(--content-bg-dark);
  border: 1px solid var(--border-dark);
  border-radius: 12px;
  text-align: center;
  transition: all 0.3s ease;
}
.light .stack-card {
  background: var(--content-bg-light);
  border: 1px solid var(--border-light);
}
.stack-card:hover {
  border-color: var(--border-dark-hover);
  transform: translateY(-4px);
  background: var(--border-dark-hover);
}
.light .stack-card:hover {
  border-color: var(--border-light-hover);
  background: var(--border-light-hover);
}
.stack-icon {
  font-size: 34px;
  color: var(--text-dark);

}
.light .stack-icon {
  color: var(--text-light);
}
.stack-title {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-dark-secondary);
}
.light .stack-title {
  color: var(--text-light-secondary);
}

@media (max-width: 600px) {
  .stack-title {
    display: none;
  }
}
</style>