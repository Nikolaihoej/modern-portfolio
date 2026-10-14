import './assets/main.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { vReveal } from './directives/reveal.js'

createApp(App)
  .use(router)
  .directive('reveal', vReveal) // v-reveal: glide in when scrolled into view
  .mount('#app')
