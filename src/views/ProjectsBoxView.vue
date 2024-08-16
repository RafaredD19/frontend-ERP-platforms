<template>
    <v-container>
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
  