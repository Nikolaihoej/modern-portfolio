import { createRouter, createWebHistory, START_LOCATION } from 'vue-router'
import Home from './views/home.vue'
// Projects is only loaded when you open the page, so the home page doesn't have to download three.js
const Projects = () => import('./views/Projects.vue')

const SITE_URL = 'https://nhjportfolio.web.app'

// title and description for each page (shown in Google and on the browser tab)
const routes = [
  {
    path: '/',
    component: Home,
    meta: {
      title: 'Nikolai Jensen – Web Designer & Frontend Developer in Odense',
      description: 'Portfolio of Nikolai Jensen, a web designer and frontend developer in Odense, Denmark, focused on UI/UX design and websites that are easy to use.',
    },
  },
  {
    path: '/projects',
    component: Projects,
    meta: {
      title: 'Projects – Websites designed at næmt.nu | Nikolai Jensen',
      description: 'A selection of websites I’ve designed for real clients at næmt.nu. Browse the projects and click one to visit the live site.',
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,

  // Where the page should be scrolled to after changing page.
  // Without this, Vue Router keeps the old scroll position – that's why
  // /projects opened in the middle of the page.
  scrollBehavior(to, from, savedPosition) {
    // A fresh page load (also when you refresh) always starts at the top.
    // Without this, the browser remembered where you were and pulled you back down there.
    // Links like /#contact still scroll to their section.
    if (from === START_LOCATION && !to.hash) return { top: 0 }

    // wait for the old page to fade out in App.vue (0.2s) before scrolling,
    // so you don't see the old page jump to the top while it fades out
    return new Promise((resolve) => {
      setTimeout(() => {
        if (savedPosition) resolve(savedPosition) // back/forward: return to where you were
        else if (to.hash) resolve({ el: to.hash }) // links like /#contact
        else resolve({ top: 0 }) // a normal link: start at the top
      }, 200)
    })
  },
})

// After every page change: update the title, description and canonical link in <head>
router.afterEach((to) => {
  if (!to.meta.title) return // a page without its own texts keeps the ones from index.html
  document.title = to.meta.title
  document.querySelector('meta[name="description"]').setAttribute('content', to.meta.description)
  document.querySelector('link[rel="canonical"]').setAttribute('href', SITE_URL + to.path)
})

export default router