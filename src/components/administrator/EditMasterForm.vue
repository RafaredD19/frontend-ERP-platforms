<template>
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Editar Cuenta Master</span>
        </v-card-title>
  
        <v-card-text>
          <v-form ref="form">
            <!-- Selección de proyectos -->
            <div class="mt-4">
              <h3 class="text-lg font-semibold mb-2">Seleccionar Proyectos</h3>
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
                      :model-value="isProjectSelected(project._id)" 
                      @change="toggleProject(project._id)"
                      :class="{'switch-on': isProjectSelected(project._id), 'switch-off': !isProjectSelected(project._id)}"
                      inset
                    />
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </div>
  
            <!-- Campos dinámicos del formulario -->
            <div v-if="Object.keys(requiredFields).length > 0" class="mt-4">
              <h3 class="text-lg font-semibold mb-2">Completar Información del Master</h3>
              <v-text-field
                v-for="(label, field) in requiredFields"
                :key="field"
                v-model="formData[field]"
                :label="label"
                required
              ></v-text-field>
            </div>
  
            <!-- Campo para cargar imagen -->
            <div class="mt-4">
              <h3 class="text-lg font-semibold mb-2">Cargar Imagen</h3>
              <v-file-input
                v-model="selectedImage"
                label="Seleccionar Imagen"
                accept="image/*"
                prepend-icon="mdi-camera"
                :show-size="true"
                required
              ></v-file-input>
            </div>
          </v-form>
        </v-card-text>
  
        <v-card-actions>
          <v-btn color="red" text @click="close">Cancelar</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="submitEditForm">Guardar Cambios</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script setup>
  import { ref, watch, onMounted } from 'vue';
  import Swal from 'sweetalert2';
  import { findAllProjects } from "@/api/ProjectsService";
  import { updateMaster , requiredFieldsMasters} from "@/api/AdministratorService";
  import store from "@/store";
  
  const props = defineProps({
    modelValue: {
      type: Boolean,
      required: true
    },
    masterData: {
      type: Object,
      required: true
    }
  });
  
  const emit = defineEmits(['update:modelValue', 'updated']);
  
  const dialog = ref(props.modelValue);
  const dialogLoader = ref(false);
  
  const projects = ref([]);
  const selectedProjects = ref([]);
  const requiredFields = ref({});
  const formData = ref({});
  const selectedImage = ref(null);
  
  watch(() => props.modelValue, (newVal) => {
    dialog.value = newVal;
    if (newVal) {
      initializeForm();
    }
  });
  
  const close = () => {
    emit('update:modelValue', false);
    selectedProjects.value = [];
    requiredFields.value = {};
    formData.value = {};
    selectedImage.value = null;
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
  
  const initializeForm = async () => {
    formData.value = {
      business: props.masterData.business,
      username: props.masterData.user.username,
      password: props.masterData.user.password,
      usernameWialon: props.masterData.usernameWialon,
      passwordWialon: props.masterData.passwordWialon,
      tokenWialon: props.masterData.tokenWialon,
    };
  
    selectedProjects.value = props.masterData.projects.map(project => project._id);
  
    await loadRequiredFields();
  };
  
  const isProjectSelected = (projectId) => {
    return selectedProjects.value.includes(projectId);
  };
  
  const toggleProject = async (projectId) => {
    if (isProjectSelected(projectId)) {
      selectedProjects.value = selectedProjects.value.filter(id => id !== projectId);
    } else {
      selectedProjects.value.push(projectId);
    }
    
    await loadRequiredFields(); // Volver a cargar los campos cuando se cambia la selección de proyectos
  };
  
  const loadRequiredFields = async () => {
    const token = store.state.token;
    const masterId = props.masterData._id; // Obtener el _id del master
    const payload = { projectIds: selectedProjects.value };
  
    try {
      const response = await requiredFieldsMasters(token, payload,masterId);
      requiredFields.value = response.data.data;
  
      // Mantén los campos existentes en formData
      const existingData = { ...formData.value };
      
      // Inicializa formData con los nuevos campos requeridos, sin borrar los valores existentes
      for (const field in requiredFields.value) {
        formData.value[field] = existingData[field] || '';
      }
    } catch (error) {
      console.error("Error fetching required fields:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Ocurrió un error al obtener los campos requeridos.',
      });
    }
  };
  
  const submitEditForm = async () => {
    dialogLoader.value = true;
  
    const payload = {
      ...formData.value, 
      projectIds: selectedProjects.value
    };
  
    const formDatas = new FormData();
    for (const key in payload) {
      if (Object.prototype.hasOwnProperty.call(payload, key)) {
        if (key === "projectIds") {
          const projectIds = payload[key];
          formDatas.append(key, projectIds.join(',')); // Convertir el array en una cadena separada por comas
        } else {
          formDatas.append(key, payload[key]);
        }
      }
    }
  
    if (selectedImage.value) {
      formDatas.append('image', selectedImage.value);
    }
  
    const token = store.state.token;
  
    try {
      await updateMaster(token, props.masterData._id, formDatas);
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'El master se actualizó correctamente.',
      });
      emit('updated');
      close();
    } catch (error) {
      console.error("Error al actualizar el master:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Ocurrió un error al actualizar el master.',
      });
    } finally {
      dialogLoader.value = false;
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
  .text-lg {
    font-size: 1.125rem;
  }
  .font-semibold {
    font-weight: 600;
  }
  .mb-2 {
    margin-bottom: 0.5rem;
  }
  
  .switch-on .v-input--selection-controls__ripple {
    background-color: #4CAF50 !important; /* Verde cuando está encendido */
  }
  
  .switch-off .v-input--selection-controls__ripple {
    background-color: #F44336 !important; /* Rojo cuando está apagado */
  }
  </style>
  