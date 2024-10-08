<template>
  <v-card-title>
      <h1 class="font-bold lg:text-3xl text-xl text-gray-400">Mantenimiento de Administradores</h1>
    </v-card-title>
  <v-container>
    <v-row justify="end" class="mb-4">
      <v-col cols="auto">
        <v-btn color="primary" @click="openCreateForm">
          Crear +
        </v-btn>
      </v-col>
    </v-row>
    <TableAdmin :masters="masters" @delete="confirmDelete" @edit="openEditForm" />
    <CreateMasterForm v-model="showCreateForm" @next="handleNextStep" />
    <EditMasterForm v-model="showEditForm" :masterData="selectedMaster" @updated="loadMasters" />
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Swal from 'sweetalert2';
import TableAdmin from "@/components/administrator/TableAdmin.vue";
import CreateMasterForm from "@/components/administrator/CreateMasterForm.vue";
import EditMasterForm from "@/components/administrator/EditMasterForm.vue";
import { findAllMasters, deleteMasters } from "@/api/AdministratorService";
import store from "@/store";

const masters = ref([]);
const showCreateForm = ref(false);
const showEditForm = ref(false);
const selectedMaster = ref(null);

const loadMasters = async () => {
  try {
    const token = store.state.token;
    const response = await findAllMasters(token);
    masters.value = response.data.data;
  } catch (error) {
    console.error("Error loading masters", error);
  }
};

const openCreateForm = () => {
  showCreateForm.value = true;
};

const openEditForm = (master) => {
  selectedMaster.value = master;
  showEditForm.value = true;
};

const confirmDelete = async (_id) => {
  const result = await Swal.fire({
    title: '¿Estás seguro?',
    text: "Esta acción no se puede deshacer.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  });

  if (result.isConfirmed) {
    try {
      const token = store.state.token;
      await deleteMasters(token, _id);
      Swal.fire('Eliminado', 'El usuario ha sido eliminado correctamente.', 'success');
      loadMasters(); // Recargar la lista de usuarios
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
      Swal.fire('Error', error.response?.data?.message || 'Ocurrió un error al eliminar el usuario.', 'error');
    }
  }
};

onMounted(loadMasters);
</script>

<style scoped>
.mb-4 {
  margin-bottom: 16px;
}
</style>
