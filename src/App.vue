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

/* transitions */
.fade-enter-active, .fade-leave-active { transition: opacity .5s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.fade-enter-to, .fade-leave-from { opacity: 1; }
</style>