<template>
	<div class="container custom-container pb-5">
		<h2 class="section-title">Work</h2>
		<div class="row justify-content-center">
			<div class="col">
				<div class="tabs">
					<div class="tab" :class="{ active: activeTab === 'work' }" @click="activeTab = 'work'">Work</div>
					<div class="tab" :class="{ active: activeTab === 'education' }" @click="activeTab = 'education'">Education</div>
				</div>
				<div class="timeline-container">
					<Transition name="fade" mode="out-in">
						<div class="timeline" :key="activeTab">
							<div v-for="(item, index) in currentTimeline" :key="index" class="timeline-item">
								<div class="timeline-icon">
									<img :src="item.icon" alt="Company Logo" class="timeline-img" />
								</div>
								<div class="timeline-date">{{ item.date }}</div>
								<div class="timeline-company">{{ item.company }}</div>
								<div class="timeline-role">{{ item.role }}</div>
							</div>
						</div>
					</Transition>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed } from "vue";

import { educationTimeline } from "@/data/education.js";
import { workTimeline } from '../data/work.js'

const activeTab = ref("work"); // Start with "work"

const currentTimeline = computed(() =>
  activeTab.value === "work" ? workTimeline : educationTimeline
);
</script>

<style scoped>
.custom-container {
    max-width: 800px;
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
}
.light .section-title {
    background: var(--border-light);
    color: var(--text-light);
}

.timeline-container {
  background: var(--content-bg-dark);
  border-radius: 12px;
  color: var(--text-dark);
}
.light .timeline-container {
  background: var(--content-bg-light);
  color: var(--text-light);
}

.tabs {
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
    background: var(--border-dark-hover);  
}
.light .tab:hover {
    background: var(--border-light-hover);
}

.tab {
    flex: 1;
    text-align: center;
    padding: 10px 0;
    cursor: pointer;
    color: var(--text-dark-secondary);
    transition: 0.3s;
}
.light .tab {
    color: var(--text-light-secondary);
}

.tab.active {
    background: var(--content-bg-dark);
    color: var(--text-dark);
    font-weight: 600;
}
.light .tab.active {
    background: var(--content-bg-light);
    color: var(--text-light);
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

.fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
    opacity: 0;
}
.fade-enter-to, .fade-leave-from {
    opacity: 1;
}
</style>
