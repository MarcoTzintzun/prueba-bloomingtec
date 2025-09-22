<template>
  <v-row class="mb-4 fadeIn">
    <v-col class="d-flex justify-end">
      <v-btn icon @click="logout">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-col>
  </v-row>

  <v-card-title class="fadeIn">
    Prueba Tecnica Bloomingtec
    <v-spacer></v-spacer>
  </v-card-title>
  <img alt="Vue logo" src="../assets/logo.png" class="logo fadeIn" />
  <v-container class="fadeIn">
    <v-card>
      <v-data-table
        :headers="encabezados"
        :items="tareasOrdenadas"
        item-key="id"
        :search="busqueda"
        mobile-breakpoint="832"
      >
        <template v-slot:top>
          <v-row align="center" justify="space-between">
            <v-col cols="12" sm="4">
              <v-btn color="#84b626" @click="abrirNuevaTarea">
                <v-icon left>mdi-plus</v-icon>
                Nueva tarea
              </v-btn>
            </v-col>
            <v-col cols="12" sm="4" class="d-flex justify-end">
              <v-text-field
                v-model="busqueda"
                label="Buscar"
                append-icon="mdi-magnify"
                clearable
                dense
                outlined
              />
            </v-col>
          </v-row>
        </template>

        <!-- ID -->
        <template v-slot:[`item.id`]="{ item }">
          <span :class="{ 'tarea-completada': item.completada }">
            {{ item.id }}
          </span>
        </template>

        <!-- Titulo -->
        <template v-slot:[`item.titulo`]="{ item }">
          <span :class="{ 'tarea-completada': item.completada }">
            {{ item.titulo }}
          </span>
        </template>

        <!-- Fecha -->
        <template v-slot:[`item.fecha`]="{ item }">
          <span :class="{ 'tarea-completada': item.completada }">
            {{ item.fecha }}
          </span>
        </template>

        <!-- Check completada -->
        <template v-slot:[`item.completada`]="{ item }">
          <v-checkbox
            v-model="item.completada"
            hide-details
            @change="guardarTareas"
          />
        </template>

        <!-- Acciones -->
        <template v-slot:[`item.acciones`]="{ item }">
          <v-btn
            icon
            small
            @click="iniciarEdicion(item.id, item.titulo)"
            :disabled="item.completada"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon small color="red" @click="eliminarTarea(item.id)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- Modal Nueva Tarea -->
    <v-dialog v-model="dialogoNuevaTarea" max-width="400px">
      <v-card>
        <v-card-title>Nueva Tarea</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="tareaNueva"
            label="Título de la tarea"
            outlined
            dense
            autofocus
            :error="errorNuevaTarea"
            :error-messages="
              errorNuevaTarea
                ? ['Es obligatorio poner un título a la tarea']
                : []
            "
            @keyup.enter="guardarNuevaTarea"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn color="blue darken-1" dark @click="dialogoNuevaTarea = false">
            Cancelar
          </v-btn>
          <v-btn color="green darken-1" dark @click="guardarNuevaTarea">
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal Editar -->
    <v-dialog v-model="dialogoEditar" max-width="400px">
      <v-card>
        <v-card-title>Editar Tarea</v-card-title>
        <v-card-text>
          <v-text-field
            autofocus
            v-model="tareaEditar"
            @keyup.enter="guardarEdicion"
            label="Titulo de la tarea"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="black darken-1"
            text
            @click="dialogoEditar = false"
            style="background-color: ligthhgrey"
          >
            Cancelar
          </v-btn>
          <v-btn color="green darken-1" text @click="guardarEdicion">
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <Footer />
  </v-container>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import Footer from "../components/Footer.vue";
import { useRouter } from "vue-router";

const busqueda = ref("");
const tareaNueva = ref("");
const tareas = ref([]);
const errorNuevaTarea = ref(false);
const dialogoNuevaTarea = ref(false);
const dialogoEditar = ref(false);
const tareaEditar = ref("");
const editarId = ref(null);
const router = useRouter();

// Cargar tareas guardadas
onMounted(() => {
  const guardadas = localStorage.getItem("tareas");
  if (guardadas) tareas.value = JSON.parse(guardadas);
});

// Vigilar cambios y guardar
watch(
  tareas,
  (val) => {
    localStorage.setItem("tareas", JSON.stringify(val));
  },
  { deep: true }
);

const encabezados = [
  { title: "ID", key: "id" },
  { title: "Titulo", key: "titulo" },
  { title: "Fecha de creacion", key: "fecha" },
  { title: "Completada", key: "completada" },
  { title: "Acciones", key: "acciones", sortable: false },
];

// Ordena tareas: recientes primero, completadas al final
const tareasOrdenadas = computed(() => {
  return [...tareas.value].sort((a, b) => {
    if (a.completada !== b.completada) return a.completada ? 1 : -1;
    return new Date(b.fecha) - new Date(a.fecha);
  });
});

const logout = () => {
  localStorage.removeItem("loggedIn");
  localStorage.removeItem("user");
  router.replace({ name: "login" });
  location.reload();
};

// Guardar tareas en localStorage
const guardarTareas = () => {
  localStorage.setItem("tareas", JSON.stringify(tareas.value));
};

// Abrir modal nueva tarea
const abrirNuevaTarea = () => {
  tareaNueva.value = "";
  errorNuevaTarea.value = false;
  dialogoNuevaTarea.value = true;
};

// Obtener ID consecutivo formateado.
const obtenerSiguienteId = () => {
  if (!tareas.value.length) return "001";
  const ids = tareas.value.map((t) => parseInt(t.id));
  const maxId = Math.max(...ids);
  return String(maxId + 1).padStart(3, "0");
};

// Guardar nueva tarea
const guardarNuevaTarea = () => {
  if (!tareaNueva.value.trim()) {
    errorNuevaTarea.value = true;
    return;
  }
  tareas.value.unshift({
    id: obtenerSiguienteId(),
    titulo: tareaNueva.value,
    fecha: new Date().toLocaleString([], {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }),
    completada: false,
  });
  tareaNueva.value = "";
  errorNuevaTarea.value = false;
  dialogoNuevaTarea.value = false;
};

// Editar tarea
const iniciarEdicion = (id, titulo) => {
  editarId.value = id;
  tareaEditar.value = titulo;
  dialogoEditar.value = true;
};

// Guardar cambios de tarea editada
const guardarEdicion = () => {
  if (!tareaEditar.value.trim()) return;
  const index = tareas.value.findIndex((t) => t.id === editarId.value);
  if (index !== -1) tareas.value[index].titulo = tareaEditar.value;
  dialogoEditar.value = false;
  tareaEditar.value = "";
};

// Eliminar tarea por ID con confirmacion
const eliminarTarea = (id) => {
  if (
    confirm(
      "¿Seguro que deseas eliminar esta tarea?, esta accion no se puede deshacer."
    )
  ) {
    const index = tareas.value.fiscriptx((t) => t.id === id);
    if (index !== -1) tareas.value.splice(index, 1);
  }
};
</script>

<style scoped>
.logo {
  width: 20%;
}
.tarea-completada {
  color: #9e9e9e !important;
  opacity: 0.6;
  text-decoration: line-through;
}
.fadeIn {
  animation: fadeIn 0.8s ease;
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
