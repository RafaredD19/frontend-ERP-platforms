<template>
  <v-card flat>
    <template v-slot:text>
      <v-text-field
        v-model="search"
        label="Search"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        hide-details
        single-line
      ></v-text-field>
    </template>

    <v-data-table
      :headers="headers"
      :items="filteredMasters"
      :search="search"
    >
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon
          color="blue"
          @click="openDetailForm(item)"
        >
          mdi-file-eye
        </v-icon>
        <v-icon
          color="green"
          @click="$emit('edit', item)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          color="red"
          @click="$emit('delete', item._id)"
        >
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>

    <!-- Incluir el componente del modal -->
    <DetailCompanyForm
      v-if="showDetailForm"
      :company="selectedCompany"
      @close="closeDetailForm"
    />
  </v-card>
</template>

<script setup>
import { computed, ref } from 'vue';
import DetailCompanyForm from './DetailCompanyForm.vue';

const props = defineProps({
  masters: {
    type: Array,
    required: true
  }
});

const showDetailForm = ref(false);
const selectedCompany = ref(null);

const openDetailForm = (item) => {
  selectedCompany.value = item; // Pasamos todo el objeto `item`
  showDetailForm.value = true;
};

const closeDetailForm = () => {
  showDetailForm.value = false;
  selectedCompany.value = null; // Limpiamos la selección al cerrar
};

const search = ref('');
const headers = [
  {
    align: 'start',
    key: 'business',
    sortable: false,
    title: 'Compañia',
  },
  { key: 'user.username', title: 'Usuario' , align: 'start'},
  { key: 'user.role', title: 'Rol',  align: 'start', },
  { key: 'user.status', title: 'Estado',  align: 'start', },
  {
    key: 'actions',
    title: 'Acciones',
    align: 'left',
  },
];

const filteredMasters = computed(() => {
  return props.masters;
});
</script>

<style scoped>
/* Estilos específicos para tu componente */
</style>
