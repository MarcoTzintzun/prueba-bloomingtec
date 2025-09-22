<script setup>
import { ref, onMounted } from "vue";
import Principal from "./views/PrincipalView.vue";
import Login from "./views/LoginView.vue";

const loggedIn = ref(false);

// Al iniciar, revisar localStorage
onMounted(() => {
  loggedIn.value = localStorage.getItem("loggedIn") === "true";
});

const handleLoginSuccess = () => {
  loggedIn.value = true;
};

const handleLogout = () => {
  localStorage.removeItem("loggedIn");
  localStorage.removeItem("user");
  loggedIn.value = false;
};
</script>

<template>
  <div>
    <Login v-if="!loggedIn" @login-success="handleLoginSuccess" />
    <Principal v-else @logout="handleLogout" />
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.logo {
  width: 20%;
}
</style>
