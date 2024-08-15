<template>
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
import Swal from 'sweetalert2';
import TableAdmin from "@/components/administrator/TableAdmin.vue";
import CreateMasterForm from "@/components/administrator/CreateMasterForm.vue";
import { findAllMasters, deleteMasters } from "@/api/AdministratorService";
import store from "@/store";

const masters = ref([]);
const showCreateForm = ref(false);
const selectedProjects = ref({}); // Guardará los proyectos seleccionados

const loadMasters = async () => {
  try {
    const token = store.state.token;
    const response = await findAllMasters(token);
    masters.value = response.data.data.map(master => ({
      business: master.business,
      user: master.user,
      _id : master._id
    }));
  } catch (error) {
    console.error("Error loading masters", error);
  }
};

const openCreateForm = () => {
  showCreateForm.value = true;
};

const handleNextStep = (projectAccess) => {
  selectedProjects.value = projectAccess;
  console.log('Proyectos seleccionados:', selectedProjects.value);
  // Aquí puedes manejar la transición al siguiente paso
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
