import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/home.vue'
import Projects from './views/Projects.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/projects', component: Projects }
]

export default createRouter({
  history: createWebHistory(),
  routes,

  // Where the page should be scrolled to after changing page.
  // Without this, Vue Router keeps the old scroll position – that's why
  // /projects opened in the middle of the page.
  scrollBehavior(to, from, savedPosition) {
    // wait for the fade between pages in App.vue (0.5s) before scrolling,
    // so you don't see the old page jump to the top while it fades out
    return new Promise((resolve) => {
      setTimeout(() => {
        if (savedPosition) resolve(savedPosition) // back/forward: return to where you were
        else if (to.hash) resolve({ el: to.hash }) // links like /#contact
        else resolve({ top: 0 }) // a normal link: start at the top
      }, 500)
    })
  },
})