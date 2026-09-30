<template>
    <div class="container custom-container my-4">
        <div class="row d-flex align-items-center">
            <div class="image col-auto" @mouseenter="handleHover" @mouseleave="handleLeave" @click="handleHover">
                <!-- the size is set once with --avatar-size (see the CSS) – ring and image follow it -->
                <div class="avatar">
                    <svg class="profile-border" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="46" stroke="#168bff" stroke-width="20" fill="none" :stroke-dashoffset="borderOffset" stroke-dasharray="289" style="transition: stroke-dashoffset 0.6s ease-in-out;"/>
                    </svg>
                    <img class="profile-img" :src="filled ? meGlassesImg : meImg" alt="Hero Image" />
                </div>
            </div>
            <div class="details col text-left ms-3">
                <div class="title-container">
                    <h2 class="title">Hey! I'm Nikolai <span class="surfer-hand" :class="{ animated: handAnimating }" @click="animateHand" @mouseenter="animateHand">🤙🏼</span></h2>
                </div>
                <div class="location">
                    <div>Based in Odense • DK</div>
                    <div class="work-status">
                        <span class="pulse-dot" aria-hidden="true"></span>
                            Currently working at
                        <a class="location-link" href="https://næmt.nu" target="_blank" rel="noopener">næmt.nu</a>
                    </div>
                </div>
            </div>
        </div>
        <div class="description my-4" :class="{ highlighted: isOn }">
            <h3>
                I'm a <mark class="key" style="--i: 0">web developer</mark> who focuses on
                <mark class="key" style="--i: 1">frontend</mark> and <mark class="key" style="--i: 2">UI/UX design</mark>.
                I pay <mark class="key" style="--i: 3">attention to details</mark> and enjoy
                <mark class="key" style="--i: 4">solving problems</mark> with code and design.
            </h3>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import meImg from '../assets/images/mewithoutglassesandbg.png'
import meGlassesImg from '../assets/images/menewwithglasses.png'

const filled = ref(false)
const borderOffset = ref(289)
const animating = ref(false)
let fillTimeout = null

// The highlight follows the blue circle: when the circle is filled (glasses on),
// the key words stay highlighted – also after the mouse leaves.
// Hover again and the circle empties and the highlight goes away.
const isOn = computed(() => borderOffset.value === 0)

// The glow at the top of the page lives on #app (main.css), so we tell it via a class on <body>
watch(isOn, (on) => {
    document.body.classList.toggle('hero-active', on)
})

onBeforeUnmount(() => {
    document.body.classList.remove('hero-active')
})

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
/* one number controls the picture + ring: 220px on big screens, smaller on phones */
.avatar {
    --avatar-size: clamp(88px, 26vw, 220px);
    position: relative;
    width: var(--avatar-size);
    height: var(--avatar-size);
    margin: calc(var(--avatar-size) * 0.06); /* room for the ring, which sits a bit outside the picture */
}

/* the svg uses viewBox 0–100, so the ring scales with the picture */
.profile-border {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    overflow: visible;
}

.profile-img {
    position: relative;
    z-index: 1;
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
}

.custom-container {
    max-width: var(--container-max);
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


.location { 
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.location-link {
    color: inherit;
    text-decoration: none;
    font-weight: bold;
    opacity: 0.5;
    transition: opacity 0.3s;
}
.location-link:hover {
    opacity: 1;
}

/* ---------- name + info grow with the picture (same 26vw → 220px idea) ---------- */
.title {
    font-size: clamp(26px, 4.4vw, 56px);
    font-weight: 600;
    line-height: 1.05;
    letter-spacing: -0.02em;
    margin-bottom: clamp(8px, 1.2vw, 16px);
}
.location {
    font-size: clamp(14px, 1.7vw, 20px);
    gap: clamp(6px, 0.8vw, 12px);
}
.work-status {
    gap: clamp(6px, 0.7vw, 10px);
}
.pulse-dot {
    width: clamp(8px, 0.9vw, 11px);
    height: clamp(8px, 0.9vw, 11px);
    flex-basis: clamp(8px, 0.9vw, 11px);
}

/* ---------- key words that light up when you hover the picture ---------- */
.description h3 {
    transition: color 0.4s ease;
}
.highlighted h3 {
    color: var(--text-dark-secondary); /* the rest of the text steps back */
}
.light .highlighted h3 {
    color: var(--text-light-secondary);
}

.key {
    color: inherit;
    padding: 0 3px;
    margin: 0 -3px; /* the padding doesn't push the text apart */
    border-radius: 4px;
    /* a blue "marker" that sweeps in from the left */
    background: linear-gradient(#168bff, #168bff) no-repeat left center / 0% 100%;
    -webkit-box-decoration-break: clone;
    box-decoration-break: clone;
    transition:
        background-size 0.45s ease calc(var(--i) * 70ms),
        color 0.3s ease calc(var(--i) * 70ms);
}
.highlighted .key {
    background-size: 100% 100%;
    color: #fff;
}

@media (prefers-reduced-motion: reduce) {
    .key {
        transition: none;
    }
}

@keyframes surfer-gesture {
    0%   { transform: rotate(0deg); }
    20%  { transform: rotate(-30deg); }
    40%  { transform: rotate(30deg); }
    60%  { transform: rotate(-30deg); }
    80%  { transform: rotate(30deg); }
    100% { transform: rotate(0deg); }
}


.work-status {
    display: inline-flex;
    align-items: center;
    gap: 6px;
}

.pulse-dot {
    width: 8px;
    height: 8px;
    flex: 0 0 8px;
    border-radius: 50%;
    background: #168bff;
    box-shadow: 0 0 0 0 rgb(22 139 255 / 60%);
    animation: pulse 1.8s infinite;
}

@keyframes pulse {
    70% {
        box-shadow: 0 0 0 6px rgb(22 139 255 / 0%);
    }
    100% {
        box-shadow: 0 0 0 0 rgb(22 139 255 / 0%);
    }
}

</style>