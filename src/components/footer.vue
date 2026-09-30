<template>
  <footer class="site-footer">
    <div class="container custom-container">

      <!-- 1. Contact card -->
      <section class="footer-cta" id="contact" aria-labelledby="footerCtaTitle">
        <div>
          <p class="section-title">Contact</p>
          <h2 id="footerCtaTitle">Let's have a chat ☕</h2>
          <p class="cta-text">
            I design and build websites that are easy to use and good to look at.
            Send me a line and let’s talk about what you’re building.
          </p>
          <div class="work-status">
            <span class="pulse-dot" aria-hidden="true"></span>
            Currently working at
            <a href="https://næmt.nu" target="_blank" rel="noopener">næmt.nu</a>
          </div>
        </div>

        <div class="cta-actions">
          <div class="email-copy">
            <span>{{ email }}</span>
            <button type="button" class="btn btn-ghost" @click="copyEmail">{{ copyLabel }}</button>
          </div>
          <a class="btn btn-primary" :href="`mailto:${email}`">
            Send me an email
            <FontAwesomeIcon :icon="faArrowRight" />
          </a>
        </div>
      </section>

      <!-- 2. Columns -->
      <div class="footer-grid">
        <div class="about">
          <p class="brand">NHJ</p>
          <p class="about-text">Web developer focused on frontend and UI/UX design. Based in Odense, Denmark.</p>
        </div>

        <nav aria-label="Footer">
          <p class="col-title">Pages</p>
          <ul class="footer-links">
            <li><router-link to="/">Home</router-link></li>
            <li><router-link to="/projects">Projects</router-link></li>
          </ul>
        </nav>

        <div>
          <p class="col-title">Elsewhere</p>
          <ul class="footer-links">
            <li>
              <a href="https://github.com/Nikolaihoej" target="_blank" rel="noopener">
                <FontAwesomeIcon :icon="faGithub" class="icon" /> GitHub
              </a>
            </li>
            <li>
              <a href="https://www.linkedin.com/in/nikolai-jensen-472577195/" target="_blank" rel="noopener">
                <FontAwesomeIcon :icon="faLinkedin" class="icon" /> LinkedIn
              </a>
            </li>
            <li>
              <a :href="`mailto:${email}`">
                <FontAwesomeIcon :icon="faEnvelope" class="icon" /> Email
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p class="col-title">Local time</p>
          <p class="clock">{{ time }}</p>
          <p class="clock-sub">Odense, Denmark · {{ timeZone }}</p>
        </div>
      </div>

      <!-- 3. Bottom bar -->
      <div class="footer-bottom">
        <span>© {{ year }} NHJ</span>
        <button type="button" class="to-top" @click="scrollToTop">
          Back to top
          <span class="arrow" aria-hidden="true"><FontAwesomeIcon :icon="faArrowUp" /></span>
        </button>
      </div>

    </div>
  </footer>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faEnvelope, faArrowUp, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons'

const email = 'nikolaihoj@gmail.com'
const year = new Date().getFullYear()

// Copy email
const copyLabel = ref('Copy')
async function copyEmail() {
  try {
    await navigator.clipboard.writeText(email)
    copyLabel.value = 'Copied'
  } catch (e) {
    copyLabel.value = 'Could not copy'
  }
  setTimeout(() => (copyLabel.value = 'Copy'), 1600)
}

// Live clock in Odense
const time = ref('--:--')
const timeZone = ref('CET')
let clockTimer

function updateClock() {
  const now = new Date()
  time.value = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Copenhagen' })
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Copenhagen', timeZoneName: 'short' }).formatToParts(now)
  timeZone.value = parts.find((p) => p.type === 'timeZoneName').value // CET or CEST
}

onMounted(() => {
  updateClock()
  clockTimer = setInterval(updateClock, 15000)
})

onBeforeUnmount(() => {
  clearInterval(clockTimer)
})

// Back to top
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<style scoped>
.custom-container {
  max-width: var(--container-max);
}

.site-footer {
  margin-top: 80px;
  padding-bottom: 28px;
  color: var(--text-dark);
}
.light .site-footer {
  color: var(--text-light);
}

/* ---------- 1. contact card ---------- */
.footer-cta {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: end;
  gap: 32px;
  background: var(--content-bg-dark);
  border: 1px solid var(--border-dark);
  border-radius: 8px;
  padding: 40px;
}
.light .footer-cta {
  background: var(--content-bg-light);
  border-color: var(--border-light);
}

.section-title {
  display: inline-block;
  background: var(--border-dark);
  color: var(--text-dark);
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  margin: 0 0 20px;
}
.light .section-title {
  background: var(--border-light);
  color: var(--text-light);
}

.footer-cta h2 {
  margin: 0;
  font-size: clamp(28px, 3.2vw, 44px);
  line-height: 1.08;
  letter-spacing: -0.03em;
  font-weight: 600;
}

.cta-text {
  margin: 14px 0 0;
  max-width: 46ch;
  color: var(--text-dark-secondary);
  font-size: 16px;
  line-height: 1.6;
}
.light .cta-text {
  color: var(--text-light-secondary);
}

/* same dot as in hero.vue */
.work-status {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 22px;
  font-size: 14px;
  color: var(--text-dark-secondary);
}
.light .work-status {
  color: var(--text-light-secondary);
}
.work-status a {
  color: var(--text-dark);
  text-decoration: none;
  border-bottom: 1px solid var(--border-dark-hover);
}
.light .work-status a {
  color: var(--text-light);
  border-color: var(--border-light-hover);
}
.work-status a:hover {
  border-color: currentColor;
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

.cta-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 280px;
}

.email-copy {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  background: var(--bg-dark);
  border: 1px solid var(--border-dark);
  border-radius: 8px;
  padding: 6px 6px 6px 16px;
  font-size: 15px;
}
.light .email-copy {
  background: var(--bg-light);
  border-color: var(--border-light);
}
.email-copy span {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 500;
  text-decoration: none;
  border-radius: 8px;
  padding: 12px 18px;
  border: 1px solid transparent;
  transition: transform 0.3s, box-shadow 0.3s, border-color 0.3s;
}
.btn-primary {
  background: var(--text-dark);
  color: var(--bg-dark);
}
.light .btn-primary {
  background: var(--text-light);
  color: var(--bg-light);
}
.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}
.btn-ghost {
  background: var(--content-bg-dark);
  color: var(--text-dark);
  border-color: var(--border-dark);
  padding: 8px 12px;
  font-size: 14px;
}
.light .btn-ghost {
  background: var(--content-bg-light);
  color: var(--text-light);
  border-color: var(--border-light);
}
.btn-ghost:hover {
  border-color: var(--border-dark-hover);
}

/* ---------- 2. columns ---------- */
.footer-grid {
  display: grid;
  grid-template-columns: 1.6fr 1fr 1fr 1fr;
  gap: 32px;
  padding: 48px 4px 40px;
}

.brand {
  margin: 0 0 14px;
  font-size: 32px;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1;
}

.about-text {
  margin: 0;
  max-width: 34ch;
  color: var(--text-dark-secondary);
  font-size: 15px;
  line-height: 1.6;
}
.light .about-text {
  color: var(--text-light-secondary);
}

.col-title {
  margin: 0 0 14px;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--text-dark-secondary);
}
.light .col-title {
  color: var(--text-light-secondary);
}

.footer-links {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 10px;
}
.footer-links a {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--text-dark);
  text-decoration: none;
  font-size: 15px;
}
.light .footer-links a {
  color: var(--text-light);
}
.footer-links .icon {
  width: 16px;
  color: var(--text-dark-secondary);
  transition: color 0.2s, transform 0.2s;
}
.light .footer-links .icon {
  color: var(--text-light-secondary);
}
.footer-links a:hover .icon {
  color: inherit;
  transform: translateY(-1px);
}

.clock {
  margin: 0 0 8px;
  font-size: 28px;
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}
.clock-sub {
  margin: 0;
  font-size: 14px;
  color: var(--text-dark-secondary);
}
.light .clock-sub {
  color: var(--text-light-secondary);
}

/* ---------- 3. bottom bar ---------- */
.footer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border-top: 1px solid var(--border-dark);
  padding: 20px 4px 0;
  font-size: 14px;
  color: var(--text-dark-secondary);
}
.light .footer-bottom {
  border-color: var(--border-light);
  color: var(--text-light-secondary);
}

.to-top {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: none;
  border: none;
  padding: 0;
  font: inherit;
  color: inherit;
  cursor: pointer;
  transition: color 0.2s;
}
.to-top:hover {
  color: var(--text-dark);
}
.light .to-top:hover {
  color: var(--text-light);
}
.to-top .arrow {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--content-bg-dark);
  border: 1px solid var(--border-dark);
  color: var(--text-dark);
  font-size: 13px;
  transition: border-color 0.3s, transform 0.3s;
}
.light .to-top .arrow {
  background: var(--content-bg-light);
  border-color: var(--border-light);
  color: var(--text-light);
}
.to-top:hover .arrow {
  border-color: var(--border-dark-hover);
  transform: translateY(-2px);
}

/* keyboard focus */
.btn:focus-visible,
.footer-links a:focus-visible,
.to-top:focus-visible,
.work-status a:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 3px;
}

/* ---------- mobile ---------- */
@media (max-width: 860px) {
  .footer-cta {
    grid-template-columns: 1fr;
    align-items: start;
    padding: 28px;
  }
  .cta-actions {
    min-width: 0;
  }
  .footer-grid {
    grid-template-columns: 1fr 1fr;
    gap: 28px 20px;
  }
  .about {
    grid-column: 1 / -1;
  }
}
@media (max-width: 480px) {
  .footer-cta {
    padding: 22px;
  }
  .footer-bottom {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
