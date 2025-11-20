<template>
  <div id="app" :class="appClasses">
    <navBar />
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import navBar from './components/navBar.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

// replace with your real reactive theme state
const isLight = false
const route = useRoute()

const appClasses = computed(() => ({
  light: isLight,
  'no-gradient': !!route.meta.noGradient
}))
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');

#app {
  position: relative;
  z-index: 1;
}

/* transitions */
.fade-enter-active, .fade-leave-active { transition: opacity .5s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.fade-enter-to, .fade-leave-from { opacity: 1; }
</style>