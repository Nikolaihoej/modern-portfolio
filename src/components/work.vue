<template>
	<div class="container custom-container mb-5">
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
    height: 500px;
}

.section-title {
    background: #2a2a2a;
    color: #fff;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 500;
    display: inline-block;
}

.timeline-container {
  background: #2b2b2b;
  border-radius: 12px;
  color: #fff;
}

.tabs {
	display: flex;
	margin-bottom: 10px;
	background: #3a3a3a;
	border-radius: 8px;
	overflow: hidden;
}
.tab:hover {
	background: #4a4a4a;  
}

.tab {
	flex: 1;
	text-align: center;
	padding: 10px 0;
	cursor: pointer;
	color: #aaa;
	transition: 0.3s;
}

.tab.active {
	background: #1e1e1e;
	color: #fff;
	font-weight: 600;
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
	background: #555;
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
	background: #1e1e1e;
	border: 2px solid #fff;
	display: flex;
	justify-content: center;
	align-items: center;
}
.timeline-img {
	width: 100%;
	height: 100%;
	object-fit: cover;
	border-radius: 50%;
}

.timeline-date {
	font-size: 12px;
	color: #ccc;
}

.timeline-company {
	font-weight: 600;
	margin: 3px 0;
}

.timeline-role {
	font-size: 13px;
	padding-right: 10px;
	color: #aaa;
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
