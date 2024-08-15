<template>
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Crear Master</span>
        </v-card-title>
  
        <v-card-text>
          <v-form ref="form">
            <v-text-field
              v-model="form.business"
              label="Business"
              required
            ></v-text-field>
            <v-text-field
              v-model="form.username"
              label="Username"
              required
            ></v-text-field>
            <v-text-field
              v-model="form.role"
              label="Role"
              required
            ></v-text-field>
            <v-switch
              v-model="form.status"
              label="Active"
            ></v-switch>
          </v-form>
        </v-card-text>
  
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="submitForm">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  
  const props = defineProps({
    modelValue: {
      type: Boolean,
      required: true
    }
  });
  
  const emit = defineEmits(['update:modelValue']);
  
  const dialog = ref(props.modelValue);
  
  watch(() => props.modelValue, (newVal) => {
    dialog.value = newVal;
  });
  
  const close = () => {
    emit('update:modelValue', false);
  };
  
  const form = ref({
    business: '',
    username: '',
    role: '',
    status: false,
  });
  
  const submitForm = () => {
    if (form.value.business && form.value.username && form.value.role) {
      console.log('Form submitted', form.value);
      close();
    } else {
      console.log('Please fill all required fields');
    }
  };
  </script>
  
  <style scoped>
  /* Estilos específicos para tu formulario */
  </style>
  