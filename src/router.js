import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/home.vue'
import Projects from './views/Projects.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/projects', component: Projects }
]

export default createRouter({
  history: createWebHistory(),
  routes
})