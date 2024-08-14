<template>
  <v-container>
    <TableAdmin :masters="masters" />
  </v-container>
</template>

<script>
import TableAdmin from "@/components/administrator/TableAdmin.vue";
import { findAllMasters } from "@/api/AdministratorService";
import store from "@/store";

export default {
  components: {
    TableAdmin
  },
  data() {
    return {
      masters: []
    };
  },
  mounted() {
    this.loadMasters();
  },
  methods: {
    async loadMasters() {
      try {
        const token = store.state.token;
        const response = await findAllMasters(token);
        this.masters = response.data.data.map(master => ({
          business: master.business,
          user: master.user,
        }));
      } catch (error) {
        console.error("Error loading masters", error);
      }
    }
  }
};
</script>

<style scoped>
/* Estilos específicos para tu vista */
</style>
