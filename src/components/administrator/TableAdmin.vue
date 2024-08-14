<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="masters"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Masters</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
export default {
  props: {
    masters: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      headers: [
        { text: "Business", value: "business" },
        { text: "Username", value: "user.username" },
        { text: "Role", value: "user.role" },
        { text: "Status", value: "user.status" }
      ]
    };
  }
};
</script>

<style scoped>
/* Estilos específicos para tu componente */
</style>
