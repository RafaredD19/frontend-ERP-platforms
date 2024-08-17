<template>
  <v-card-title>
      <h1 class="font-bold lg:text-3xl text-xl text-gray-400">Mantenimiento de Compañias</h1>
    </v-card-title>
  <v-container>
    <v-row justify="end" class="mb-4">
      <v-col cols="auto">
        <v-btn color="primary" @click="openCreateForm">
          Crear +
        </v-btn>
      </v-col>
    </v-row>
    <TableCompany :masters="masters" @delete="confirmDelete" @edit="openEditForm" />
    <CreateCompanyForm v-model="showCreateForm" />
    <EditCompanyForm v-model="showEditForm" :companyData="selectedCompany" @updated="loadMasters" />
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Swal from 'sweetalert2';
import TableCompany from "@/components/company/TableComany.vue";
import CreateCompanyForm from "@/components/company/CreateCompanyForm.vue";
import EditCompanyForm from "@/components/company/EditCompanyForm.vue";
import { findAllCompanies, deleteCompany } from "@/api/CompanyService";
import store from "@/store";

const masters = ref([]);
const showCreateForm = ref(false);
const showEditForm = ref(false);
const selectedCompany = ref(null);

const loadMasters = async () => {
  try {
    const token = store.state.token;
    const response = await findAllCompanies(token);
    masters.value = response.data.data;
  } catch (error) {
    console.error("Error loading companies", error);
  }
};

const openCreateForm = () => {
  showCreateForm.value = true;
};

const openEditForm = (company) => {
  selectedCompany.value = company;
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
      await deleteCompany(token, _id);
      Swal.fire('Eliminado', 'La compañía ha sido eliminada correctamente.', 'success');
      loadMasters(); // Recargar la lista de compañías
    } catch (error) {
      console.error("Error al eliminar la compañía:", error);
      Swal.fire('Error', error.response?.data?.message || 'Ocurrió un error al eliminar la compañía.', 'error');
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
