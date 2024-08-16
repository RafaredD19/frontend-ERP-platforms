<template>
  <v-dialog v-model="show" max-width="600">
    <v-card class="bg-gray-50 rounded-lg shadow-lg">
      <v-card-title class="text-xl font-semibold text-center text-gray-800">
        Proyectos asignados de la empresa <strong>{{ company?.business }}</strong>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text class="p-4">
        <v-simple-table v-if="company?.projects && company.projects.length">
          <thead>
            <tr>
              <th class="text-left py-2 px-4 bg-gray-200 text-gray-600">Nombre del Proyecto</th>
              <th class="text-left py-2 px-4 bg-gray-200 text-gray-600">Código</th>
              <th class="text-left py-2 px-4 bg-gray-200 text-gray-600">Logo</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(project, index) in company.projects" :key="index" class="hover:bg-gray-100">
              <td class="py-2 px-4 text-gray-700">{{ project.name }}</td>
              <td class="py-2 px-4 text-gray-700">{{ project.code }}</td>
              <td class="py-2 px-4 text-gray-700">
                <img v-if="project.logoName" :src="getLogoUrl(project.logoName)" alt="Logo" class="h-10 w-10 object-contain rounded-full">
                <span v-else>No disponible</span>
              </td>
            </tr>
          </tbody>
        </v-simple-table>
        <v-alert v-else type="info" class="mt-4">
          No hay proyectos asignados a esta empresa.
        </v-alert>
      </v-card-text>
      <v-card-actions class="flex justify-end p-4">
        <v-btn color="primary" text @click="close" class="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600">
          Cerrar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from 'vue';

// Definir `emit`
const emit = defineEmits(['close']);

const props = defineProps({
  company: {
    type: Object,
    required: true
  }
});

const show = ref(true);

// Método para obtener la URL del logo
const getLogoUrl = (logoName) => {
  return `http://157.230.189.65:3555/api/v1/files/getImage/${logoName}`;
};

const close = () => {
  show.value = false;
  emit('close'); // Emitir el evento de cierre
};

// Reinicia la visibilidad del modal cuando cambie la prop `company`
watch(() => props.company, () => {
  show.value = true;
});
</script>

<style scoped>
.v-card-title {
  text-align: center;
  padding-bottom: 16px;
}
.v-simple-table th {
  background-color: #f5f5f5;
  font-weight: bold;
}
.v-simple-table td {
  padding: 8px;
}
</style>
