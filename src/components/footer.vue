<template>
  <footer class="footer">
    <div class="container custom-container">
      <p class="footer-text"> 2026 NHJ</p>
    </div>
  </footer>
</template>

<script setup>
</script>

<style scoped>
.footer {
  background: var(--content-bg-dark);
  color: var(--text-dark);
  padding: 16px 0;
  text-align: center;
}
.light .footer {
  background: var(--content-bg-light);
  color: var(--text-light);
}

.footer-text {
  margin: 0;
}

</style>