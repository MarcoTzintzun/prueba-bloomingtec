<template>
  <v-container
    class="fill-height d-flex align-center justify-center login-container"
  >
    <v-card class="login-card elevation-12">
      <v-toolbar flat color="#4caf50" dark>
        <v-toolbar-title class="text-h6">Ingreso</v-toolbar-title>
      </v-toolbar>

      <v-card-text>
        <v-form ref="loginForm" @submit.prevent="login" class="login-form">
          <v-text-field
            v-model="email"
            label="Correo"
            dense
            solo
            rounded
            :rules="[
              (v) => !!v || 'Correo obligatorio',
              (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Correo no válido',
            ]"
            hint="Ingrese su correo"
            prepend-icon="mdi-account"
            autocomplete="username"
            @keyup.enter="login"
          />
          <v-text-field
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            label="Contraseña"
            outlined
            rounded
            hint="Ingrese su contraseña"
            :rules="[
              (v) => !!v || 'Contraseña obligatoria',
              (v) => v.length >= 4 || 'Mínimo 4 caracteres',
            ]"
            prepend-icon="mdi-lock"
            :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append="togglePassword"
            @keyup.enter="login"
          />
        </v-form>
      </v-card-text>

      <v-card-actions class="d-flex justify-center">
        <v-btn block rounded class="login-btn" @click="login"> Ingresar </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";

export default {
  name: "LoginView",
  emits: ["login-success"],
  setup(props, { emit }) {
    const router = useRouter();
    const email = ref("");
    const password = ref("");
    const showPassword = ref(false);

    const demoUser = { email: "admin@bloomingtec.com", password: "admin123" };

    const login = () => {
      if (
        email.value === demoUser.email &&
        password.value === demoUser.password
      ) {
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("user", JSON.stringify({ email: email.value }));
        emit("login-success");
        router.replace({ name: "principal" });
      } else {
        alert("Credenciales incorrectas");
      }
    };

    const togglePassword = () => {
      showPassword.value = !showPassword.value;
    };

    return { email, password, login, showPassword, togglePassword };
  },
};
</script>

<style scoped>
.login-container {
  min-height: 80vh;
  transition: background 0.5s ease;
}

.login-card {
  width: 400px;
  border-radius: 12px;
  animation: fadeIn 0.8s ease;
}

.login-btn {
  transition: all 0.3s ease;
  background-color: #4caf50;
  color: white;
}

.login-btn:hover {
  transform: translateY(-2px);
}

.login-form .v-input {
  border-radius: 8px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
