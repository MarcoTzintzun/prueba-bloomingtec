<template>
  <v-footer padless height="30" class="footer-container">
    <span class="footer-text">
      &copy; 2025 devMarco - Prueba técnica Bloomingtec - Septiembre 2025
    </span>
  </v-footer>
</template>

<script>
export default {
  name: "AppFooter",
};
</script>

<style scoped>
.footer-container {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #84b626;
}

.footer-text {
  font-size: 0.9rem;
  color: #fff;
}
</style>
