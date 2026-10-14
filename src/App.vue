<template>
  <div id="app">
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
// the theme (.light) is set on <body> by the button in navBar.vue
</script>

<style>
#app {
  position: relative;
  z-index: 1;
    height: 100%;
    min-height: 100vh;
}

/* page change: the old page fades out quickly, the new one fades in
   (the 0.2s must match the wait in scrollBehavior in router.js) */
.fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-active { transition: opacity var(--dur) ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.fade-enter-to, .fade-leave-from { opacity: 1; }
</style>