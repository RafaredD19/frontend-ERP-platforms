<template>
  <v-container>
    <v-row justify="end" class="mb-4">
      <v-col cols="auto">
        <v-btn color="primary" @click="openCreateForm">
          Crear +
        </v-btn>
      </v-col>
    </v-row>
    <TableAdmin :masters="masters" />
    <CreateMasterForm v-model="showCreateForm" />
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import TableAdmin from "@/components/administrator/TableAdmin.vue";
import CreateMasterForm from "@/components/administrator/CreateMasterForm.vue";
import { findAllMasters } from "@/api/AdministratorService";
import store from "@/store";

const masters = ref([]);
const showCreateForm = ref(false);

const loadMasters = async () => {
  try {
    const token = store.state.token;
    const response = await findAllMasters(token);
    masters.value = response.data.data.map(master => ({
      business: master.business,
      user: master.user,
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
/* Estilos específicos para tu vista */
.mb-4 {
  margin-bottom: 16px;
}
</style>
