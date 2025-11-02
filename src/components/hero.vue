<template>
    <div class="container custom-container my-4">
        <div class="row d-flex align-items-center">
            <div class="image col-auto" style="position: relative; width: 108px; height: 108px;" @mouseenter="handleHover" @mouseleave="handleLeave" @click="handleHover">
                <svg class="profile-border" width="100" height="100" style="position: absolute; overflow: visible;">
                    <circle cx="50" cy="50" r="46" stroke="#1aaa61" stroke-width="20" :stroke-dashoffset="borderOffset" stroke-dasharray="289" style="transition: stroke-dashoffset 0.6s ease-in-out;"/>
                </svg>
                <img class="profile-img" :src="filled ? meGlassesImg : meImg" alt="Hero Image" style="position: relative; z-index: 1;" />
            </div>
            <div class="details col text-left ms-3">
                <div class="title-container">
                    <h2 class="title">Hey! I'm Nikolai <span class="surfer-hand" :class="{ animated: handAnimating }" @click="animateHand" @mouseenter="animateHand">🤙🏼</span></h2>
                </div>
                <div class="location">Based in Odense • DK</div>
            </div>
        </div>
        <div class="description my-4">I'm a web developer who focuses on frontend and UI/UX design. I pay attention to details and enjoy solving problems with code and design.</div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import meImg from '../assets/images/me.png'
import meGlassesImg from '../assets/images/meGlasses.png'

const filled = ref(false)
const borderOffset = ref(289)
const animating = ref(false)
let fillTimeout = null

function handleHover() {
    if (animating.value) return;
    animating.value = true;

    if (!filled.value) {
        // Fill animation
        borderOffset.value = 0;
        fillTimeout = setTimeout(() => {
            filled.value = true;
            animating.value = false;
            fillTimeout = null;
        }, 600);
    } else {
        // Reverse animation
        borderOffset.value = 289;
        fillTimeout = setTimeout(() => {
            filled.value = false;
            animating.value = false;
            fillTimeout = null;
        }, 600);
    }
}

function handleLeave() {
    if (fillTimeout) {
        // Cancel any ongoing animation (fill or reverse) if mouse leaves early
        clearTimeout(fillTimeout);
        fillTimeout = null;
        // Reset to previous state
        if (!filled.value) {
            // If filling, reset to initial
            borderOffset.value = 289;
            filled.value = false;
        } else {
            // If reversing, reset to filled
            borderOffset.value = 0;
            filled.value = true;
        }
        animating.value = false;
    }
}

const handAnimating = ref(false)

function animateHand() {
    handAnimating.value = true
    setTimeout(() => {
        handAnimating.value = false
    }, 800) // match animation duration
}
</script>

<style scoped>
.profile-img {
    position: relative;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    z-index: 2;
}

.custom-container {
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
}

.surfer-hand {
    display: inline-block;
    transition: transform 0.3s;
    cursor: pointer;
    rotate: 300deg;
}
.surfer-hand.animated {
    animation: surfer-gesture 0.8s cubic-bezier(.68,-0.55,.27,1.55) both;
}

@keyframes surfer-gesture {
    0%   { transform: rotate(0deg); }
    20%  { transform: rotate(-30deg); }
    40%  { transform: rotate(30deg); }
    60%  { transform: rotate(-30deg); }
    80%  { transform: rotate(30deg); }
    100% { transform: rotate(0deg); }
}


</style>