<template>
    <div class="container custom-container pb-5">
        <h2 class="section-title">{{ sectionTitle }}</h2>
        <div class="row justify-content-center">
            <div class="col">
                <div class="tabs">
                    <!-- the light "pill" that slides behind the active tab -->
                    <span class="tab-indicator" :style="{ transform: `translateX(${activeIndex * 100}%)` }"></span>
                    <button
                        v-for="tab in tabs"
                        :key="tab.key"
                        type="button"
                        class="tab"
                        :class="{ active: activeTab === tab.key }"
                        @click="activeTab = tab.key"
                    >
                        {{ tab.label }}
                    </button>
                </div>

                <!-- the box animates its height, so the page below doesn't jump -->
                <div class="timeline-container" :style="{ height: containerHeight ? containerHeight + 'px' : 'auto' }">
                    <!-- the new list slides down into place while the old one slides down and out -->
                    <Transition name="slide-down">
                        <div :key="activeTab" :ref="setPanel" class="panel">
                            <div class="timeline">
                                <div v-for="(item, index) in currentTab.items" :key="index" class="timeline-item">
                                    <div class="timeline-icon">
                                        <img :src="item.icon" alt="Company Logo" class="timeline-img" />
                                    </div>
                                    <div class="timeline-date">{{ item.date }}</div>
                                    <div class="timeline-company">{{ item.company }}</div>
                                    <div class="timeline-role">{{ item.role }}</div>
                                </div>
                            </div>
                        </div>
                    </Transition>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from "vue";
import { educationTimeline } from "@/data/education.js";
import { workTimeline } from '../data/work.js'

const tabs = [
  { key: "work", label: "Work", items: workTimeline },
  { key: "education", label: "Education", items: educationTimeline },
];

const activeTab = ref("work");

const activeIndex = computed(() => tabs.findIndex((tab) => tab.key === activeTab.value));
const currentTab = computed(() => tabs[activeIndex.value]);

const sectionTitle = computed(() =>
  activeTab.value === "work" ? "Work" : "Education"
);

// Height of the box = height of the list that is showing
const panel = ref(null);
// keep the newest list (Vue passes null when the old one is removed – we ignore that)
function setPanel(el) {
  if (el) panel.value = el;
}
const containerHeight = ref(0);

function updateHeight() {
  if (panel.value) containerHeight.value = panel.value.offsetHeight;
}

watch(activeTab, () => nextTick(updateHeight));

onMounted(() => {
  updateHeight();
  window.addEventListener("resize", updateHeight);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateHeight);
});
</script>

<style scoped>
.custom-container {
    max-width: var(--container-max);
    margin-left: auto;
    margin-right: auto;
}

.section-title {
    background: var(--border-dark);
    color: var(--text-dark);
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 500;
    display: inline-block;
    margin-bottom: 16px;
}
.light .section-title {
    background: var(--border-light);
    color: var(--text-light);
}

.timeline-container {
  position: relative;
  background: var(--content-bg-dark);
  border-radius: 8px;
  color: var(--text-dark);
  overflow: hidden;
  transition: height 0.4s ease;
}

/* ---------- switching Work <-> Education: slide down ---------- */
.slide-down-enter-active {
  transition: opacity 0.4s ease 0.1s, transform 0.4s ease 0.1s;
}
.slide-down-leave-active {
  transition: opacity 0.2s ease, transform 0.25s ease; /* the old list gets out of the way quickly */
}
/* the old list stays on top of the new one while it leaves */
.slide-down-leave-active {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}
.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-24px); /* comes in from a little above */
}
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(24px); /* goes out a little below */
}
.light .timeline-container {
  background: var(--content-bg-light);
  color: var(--text-light);
}

.tabs {
    position: relative;
    display: flex;
    margin-bottom: 10px;
    background: var(--border-dark-hover);
    border-radius: 8px;
    overflow: hidden;
}
.light .tabs {
    background: var(--border-light-hover);
}
.tab:hover {
    color: var(--text-dark);
}
.light .tab:hover {
    color: var(--text-light);
}

.tab {
    position: relative;
    z-index: 1;
    flex: 1;
    text-align: center;
    padding: 10px 0;
    cursor: pointer;
    color: var(--text-dark-secondary);
    background: none;
    border: none;
    font: inherit;
    transition: color 0.3s;
}
.light .tab {
    color: var(--text-light-secondary);
}

.tab.active {
    color: var(--text-dark);
    font-weight: 600;
}
.light .tab.active {
    color: var(--text-light);
}
.tab:focus-visible {
    outline: 2px solid var(--text-dark-secondary);
    outline-offset: -4px;
    border-radius: 8px;
}

/* the sliding background behind the active tab */
.tab-indicator {
    position: absolute;
    top: 0;
    left: 0;
    width: 50%;
    height: 100%;
    background: var(--content-bg-dark);
    border-radius: 8px;
    transition: transform 0.4s ease;
}
.light .tab-indicator {
    background: var(--content-bg-light);
}

.timeline {
    position: relative;
    margin-left: 20px;
    padding: 20px 0;
}

.timeline::before {
    content: "";
    position: absolute;
    left: 20px;
    top: 10px;
    bottom: 0;
    width: 2px;
    background: var(--border-dark-hover);
}
.light .timeline::before {
    background: var(--border-light-hover);
}

.timeline-item {
    position: relative;
    padding-left: 60px;
    margin-bottom: 30px;
}

.timeline-item:last-child {
    margin-bottom: 0;
}

.timeline-icon {
    position: absolute;
    left: -10px;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: var(--content-bg-dark);
    border: 2px solid var(--border-dark);
    display: flex;
    justify-content: center;
    align-items: center;
}
.light .timeline-icon {
    background: var(--content-bg-light);
    border: 2px solid var(--border-light);
}
.timeline-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
}

.timeline-date {
    font-size: 12px;
    color: var(--text-dark-secondary);
}
.light .timeline-date {
    color: var(--text-light-secondary);
}

.timeline-company {
    font-weight: 600;
    margin: 3px 0;
}

.timeline-role {
    font-size: 13px;
    padding-right: 10px;
    color: var(--text-dark-secondary);
}
.light .timeline-role {
    color: var(--text-light-secondary);
}

@media (prefers-reduced-motion: reduce) {
    .tab-indicator,
    .timeline-container,
    .slide-down-enter-active,
    .slide-down-leave-active {
        transition: none;
    }
}
</style>
