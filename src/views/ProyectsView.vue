<template>
  <v-card-title>
      <h1 class="font-bold lg:text-3xl text-xl text-gray-400">Mantenimiento de proyectos</h1>
    </v-card-title>
    <v-container>
      <v-row justify="end" class="mb-4">
        <v-col cols="auto">
          <v-btn color="primary" @click="openCreateForm">
            Crear +
          </v-btn>
        </v-col>
      </v-row>
      <TableAdmin :masters="masters" @delete="confirmDelete" />
      <CreateMasterForm v-model="showCreateForm" @next="handleNextStep" />
    </v-container>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  // import Swal from 'sweetalert2';
  import TableAdmin from "@/components/projects/TableProjects.vue";
 
  import { findAllProjects } from "@/api/ProjectsService.js";
  import store from "@/store";
  
  const masters = ref([]);
  const showCreateForm = ref(false);
  
  
  const loadMasters = async () => {
    try {
      const token = store.state.token;
      const response = await findAllProjects(token);
      masters.value = response.data.data.map(master => ({
        name: master.name,
        code: master.code,
        link : master.link
      }));
    } catch (error) {
      console.error("Error loading masters", error);
    }
  };
  
  const openCreateForm = () => {
    showCreateForm.value = true;
  };
  
  
 
  
  onMounted(loadMasters);
  </script>
  
  <style scoped>
  .mb-4 {
    margin-bottom: 16px;
  }
  </style>
  