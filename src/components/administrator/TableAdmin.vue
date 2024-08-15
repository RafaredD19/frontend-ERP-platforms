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
    ></v-data-table>
  </v-card>
</template>

<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  masters: {
    type: Array,
    required: true
  }
});

const search = ref('');
const headers = [
  {
    align: 'start',
    key: 'business',
    sortable: false,
    title: 'Business',
  },
  { key: 'user.username', title: 'Username' },
  { key: 'user.role', title: 'Role' },
  { key: 'user.status', title: 'Status' }
];

const filteredMasters = computed(() => {
  return props.masters.map(master => ({
    business: master.business,
    user: master.user,
  }));
});
</script>

<style scoped>
/* Estilos específicos para tu componente */
</style>
