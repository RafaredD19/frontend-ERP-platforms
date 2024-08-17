<template>
   <v-card-title>
      <h1 class="font-bold lg:text-3xl text-xl text-gray-400">Proyectos disponibles</h1>
    </v-card-title>
  <v-container class="bg-gray-100 min-h-screen py-6">
    <v-row>
      <v-col
        v-for="project in projects"
        :key="project._id"
        cols="12"
        md="4"
      >
        <FormBox
          :title="project.name"
          :logoName="project.logoName"
          :link="project.link"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import FormBox from '@/components/box/FormBox.vue';
import { findAllProjects } from '@/api/ProjectsService';
import store from '@/store';

const projects = ref([]);

const loadProjects = async () => {
  try {
    const token = store.state.token;
    const response = await findAllProjects(token);
    projects.value = response.data.data;
  } catch (error) {
    console.error('Error loading projects', error);
  }
};

onMounted(() => {
  loadProjects();
});
</script>

<style scoped>
/* Puedes ajustar el color de fondo y el padding a tu gusto */
.bg-gray-100 {
  background-color: #f7fafc;
}

.min-h-screen {
  min-height: 100vh;
}

.py-6 {
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
}
</style>
