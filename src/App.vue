<template>
    <navBar />
    <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
            <component :is="Component" />
        </transition>
    </router-view>
</template>

<script setup>
import navBar from './components/navBar.vue'
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');
#app {
    background-color: hsl(0 0% 4%);
    background-image: linear-gradient(180deg, rgb(26, 44, 37) 0%, rgba(18, 39, 25, 0.7) 15%, rgba(0, 0, 0, 0) 30%);
    color: white;
    position: relative;
    z-index: 1;
    font-family: 'Inter', sans-serif;
}


.fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s;
}
.fade-enter-from, .fade-leave-to {
    opacity: 0;
}
.fade-enter-to, .fade-leave-from {
    opacity: 1;
}
</style>