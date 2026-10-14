<template>
  <div class="container custom-container mb-5">
    <h2 class="section-title"><ScrambleText text="Technology Stack" /></h2>
    <div class="row g-2 justify-content-center">
      <div v-for="(tech, index) in techStack" :key="tech.title" class="col-3 d-flex" v-reveal="index">
        <!-- mouse: lights up while you hover. Phone: tap to light up, tap again to turn off -->
        <div
          class="stack-card flex-fill"
          :class="{ 'is-active': activeTech === tech.title }"
          @pointerenter="onEnter($event, tech.title)"
          @pointerleave="onLeave($event)"
          @pointerup="onTap($event, tech.title)"
        >
          <!-- --brand is the company's own colour, shown when the card is active -->
          <div class="stack-icon" :style="{ '--brand': tech.color }">
            <!-- Figma has five colours, so it is drawn as its own SVG instead of a Font Awesome icon -->
            <svg v-if="tech.title === 'Figma'" class="figma" viewBox="0 0 38 57" aria-hidden="true">
              <path class="f-red" d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" />
              <path class="f-salmon" d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" />
              <path class="f-purple" d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" />
              <path class="f-blue" d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" />
              <path class="f-green" d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z" />
            </svg>
            <FontAwesomeIcon v-else :icon="tech.icon" />
          </div>
          <h3 class="stack-title">{{ tech.title }}</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import ScrambleText from './scrambleText.vue'
import { faVuejs, faHtml5, faCss3Alt, faJs, faNodeJs } from '@fortawesome/free-brands-svg-icons'
import { faLeaf, faDatabase } from '@fortawesome/free-solid-svg-icons'

const techStack = [
  { icon: faVuejs, title: 'Vue.js', color: '#42B883' },
  { icon: faJs, title: 'JavaScript', color: '#F7DF1E' },
  { icon: faCss3Alt, title: 'CSS', color: '#1572B6' },
  { icon: faHtml5, title: 'HTML 5', color: '#E34F26' },
  { title: 'Figma' }, // its colours are set in the CSS (.figma)
  { icon: faNodeJs, title: 'Node.js', color: '#5FA04E' },
  { icon: faLeaf, title: 'MongoDB', color: '#00ED64' },
  { icon: faDatabase, title: 'SQL', color: 'var(--accent)' }, // SQL isn't a company – uses the site's accent colour
];

// The card that is lit up. Phones have no hover (iPhone only shows it on a long press),
// so instead of :hover the card gets the class .is-active – from the mouse or from a tap.
const activeTech = ref(null)

function onEnter(event, title) {
  if (event.pointerType === 'mouse') activeTech.value = title
}
function onLeave(event) {
  if (event.pointerType === 'mouse') activeTech.value = null
}
function onTap(event, title) {
  if (event.pointerType === 'mouse') return
  activeTech.value = activeTech.value === title ? null : title // tap the same card again to turn it off
}
</script>

<style scoped>
.custom-container {
    position: relative; /* sits on top of the faded bottom of the corgi game */
    z-index: 1;
    max-width: var(--container-max);
    margin-left: auto;
    margin-right: auto;
    cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='36' viewBox='0 0 24 24'><circle cx='12' cy='12' r='9' fill='%23FFF' stroke='%23FFF' stroke-width='0.25'/></svg>") 12 18, auto;
}

.stack-card {
  background: var(--content-bg-dark);
  border: 1px solid var(--border-dark);
  border-radius: 8px;
  padding: 24px;
  text-align: center;
  transition: all 0.3s ease;
}
.light .stack-card {
  background: var(--content-bg-light);
  border: 1px solid var(--border-light);
}
.stack-card.is-active {
  border-color: var(--border-dark-hover);
  transform: translateY(var(--lift));
  background: var(--border-dark-hover);
  box-shadow: var(--shadow-lift); /* see main.css */
}
.light .stack-card.is-active {
  border-color: var(--border-light-hover);
  background: var(--border-light-hover);
}
.stack-icon {
  font-size: 34px;
  color: var(--text-dark);
  transition: color 0.3s ease;
}
.light .stack-icon {
  color: var(--text-light);
}
/* active (hover or tap): the icon gets the company's colour */
.stack-card.is-active .stack-icon {
  color: var(--brand);
}

/* Figma: same size as the other icons, grey until active, then its five colours */
.figma {
  height: 1em;
  width: auto;
  vertical-align: -0.125em; /* same baseline as the Font Awesome icons */
}
.figma path {
  fill: currentColor;
  transition: fill 0.3s ease;
}
.stack-card.is-active .figma .f-red    { fill: #F24E1E; }
.stack-card.is-active .figma .f-salmon { fill: #FF7262; }
.stack-card.is-active .figma .f-purple { fill: #A259FF; }
.stack-card.is-active .figma .f-blue   { fill: #1ABCFE; }
.stack-card.is-active .figma .f-green  { fill: #0ACF83; }
.stack-title {
  font-size: var(--fs-label);
  font-weight: 500;
  color: var(--text-dark-secondary);
}
.light .stack-title {
  color: var(--text-light-secondary);
}

@media (max-width: 600px) {
  .stack-title {
    display: none;
  }

  .stack-card {
    padding: 8px;
  }
}
</style>