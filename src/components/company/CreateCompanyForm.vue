<template>
    <v-dialog v-model="dialog" max-width="600px">
      <!-- Paso 1: Selección de proyectos -->
      <v-card v-if="step === 1">
        <v-card-title>
          <span class="headline">Seleccionar Proyectos</span>
        </v-card-title>
  
        <v-card-text>
          <v-form ref="form">
            <div class="mt-4">
              <v-list>
                <v-list-item
                  v-for="project in projects"
                  :key="project._id"
                >
                  <v-list-item-content>
                    <v-list-item-title>{{ project.name }}</v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-switch 
                      :model-value="selectedProjects.includes(project._id)" 
                      @change="toggleProject(project._id)"
                    />
                  </v-list-item-action>
                  
                </v-list-item>
              </v-list>
            </div>
          </v-form>
        </v-card-text>
  
        <v-card-actions>
          <v-btn color="red" text @click="close">Cancelar</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="nextStep">Siguiente</v-btn>
        </v-card-actions>
      </v-card>
  
      <!-- Paso 2: Formulario dinámico -->
      <v-card v-if="step === 2">
        <v-card-title>
          <span class="headline">Completar Información del Master</span>
        </v-card-title>
  
        <v-card-text>
          <v-form ref="requiredFieldsForm">
            <v-text-field
              v-for="(label, field) in requiredFields"
              :key="field"
              v-model="formData[field]"
              :label="label"
              required
            ></v-text-field>
            
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="grey" text @click="previousStep">Atrás</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="close">Cancelar</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="submitMasterForm">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  
    <!-- Diálogo de Carga -->
    <v-dialog v-model="dialogLoader" :scrim="false" persistent width="auto">
      <v-card color="blue">
        <v-card-text>
          Procesando...
          <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from 'vue';
  import Swal from 'sweetalert2';
  import { findAllProjects } from "@/api/ProjectsService";
 
  import { requiredFieldsCompany, createCompany } from "@/api/CompanyService";
  
  import store from "@/store";
  
  const props = defineProps({
    modelValue: {
      type: Boolean,
      required: true
    }
  });
  
  const emit = defineEmits(['update:modelValue']);
  
  const dialog = ref(props.modelValue);
  const dialogLoader = ref(false); // Controla la visibilidad del diálogo de carga
  const step = ref(1); // Controla si estamos en la selección de proyectos o en el formulario
  
  const projects = ref([]);
  const selectedProjects = ref([]);
  const requiredFields = ref({});
  const formData = ref({}); // Almacena los datos del formulario dinámico
  
  watch(() => props.modelValue, (newVal) => {
    dialog.value = newVal;
  });
  
  const close = () => {
    emit('update:modelValue', false);
    step.value = 1; // Resetea al paso inicial cuando se cierra
    selectedProjects.value = [];
    requiredFields.value = {};
    formData.value = {};
  };
  
  const loadProjects = async () => {
    try {
      const token = store.state.token;
      const response = await findAllProjects(token);
      projects.value = response.data.data;
    } catch (error) {
      console.error("Error loading projects", error);
    }
  };
  
  const toggleProject = (projectId) => {
    if (selectedProjects.value.includes(projectId)) {
      selectedProjects.value = selectedProjects.value.filter(id => id !== projectId);
    } else {
      selectedProjects.value.push(projectId);
    }
  };
  
  const nextStep = async () => {
    console.log('Proyectos seleccionados:', selectedProjects.value);
    const token = store.state.token;
    const payload = { projectIds: selectedProjects.value };
    
    try {
      const response = await requiredFieldsCompany(token, payload);
      requiredFields.value = response.data.data;
  
      // Inicializa formData con campos vacíos
      for (const field in requiredFields.value) {
        formData.value[field] = '';
      }
  
      step.value = 2; // Avanza al siguiente paso
    } catch (error) {
      console.error("Error fetching required fields:", error);
      close(); // Cerrar el modal antes de mostrar la alerta
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Ocurrió un error al obtener los campos requeridos.',
      });
    }
  };
  
  const previousStep = () => {
    step.value = 1; // Regresa al paso anterior
  };
  
  const submitMasterForm = async () => {
    // Mostrar el diálogo de carga
    dialogLoader.value = true;

    const payload = {
  ...formData.value, 
  projectIds: selectedProjects.value
};

// // Crear el FormData
// const formDatas = new FormData();
// for (const key in payload) {
//   if (Object.prototype.hasOwnProperty.call(payload, key)) {
//     if (key === "projectIds") {
//       const projectIds = payload[key];
//       formDatas.append(key, projectIds.join(',')); // Convertir el array en una cadena separada por comas
//     } else {
//       formDatas.append(key, payload[key]);
//     }
//   }
// }

    const token = store.state.token;
    
    try {
      await createCompany(token, payload);
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'La compañia se creó correctamente.',
      });
      setTimeout(() => {
    location.reload();
  }, 5000); // 3000 milisegundos = 3 segundos

    } catch (error) {
      console.error("Error al crear el master:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Ocurrió un error al crear el master.',
      });
    } finally {
      
      dialogLoader.value = false;
      close(); 
    }
  };
  
  onMounted(() => {
    loadProjects();
  });
  </script>
  
  <style scoped>
  .mt-4 {
    margin-top: 16px;
  }
  </style>
  