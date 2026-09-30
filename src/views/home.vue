<template>
    <div>
        <ParticleBackground />
        <!-- the game and the hero share one dark panel, like a profile card -->
        <div class="hero-block">
            <CorgiRun />
            <hero />
        </div>
        <techTree />
        <RecentProjects />
        <work />
        <Footer />
    </div>
</template>

<script setup>
import ParticleBackground from '../components/particleBackground.vue'
import hero from '../components/hero.vue'
import CorgiRun from '../components/corgiRun.vue'
import techTree from '../components/techTree.vue'
import RecentProjects from '../components/recentProjects.vue'
import work from '../components/work.vue'
import Footer from '../components/footer.vue'
</script>

<style scoped>
/* one dark panel behind the game + hero, same width as the content below */
.hero-block {
    width: min(100% - 24px, var(--container-max) - 24px);
    margin: 48px auto;
    background: var(--bg-dark); /* covers the particles and glow, so it reads as one card */
    border-radius: 12px;
}
.light .hero-block {
    background: var(--bg-light);
}

/* inside the panel the two parts use the panel's width, not their own container padding */
.hero-block :deep(.custom-container) {
    max-width: none;
    padding-left: 0;
    padding-right: 0;
}

/* the picture overlaps the faded bottom of the game */
.hero-block :deep(.hero) {
    margin-top: clamp(-70px, -2vw, -20px);
    padding-bottom: 8px;
}
</style>
