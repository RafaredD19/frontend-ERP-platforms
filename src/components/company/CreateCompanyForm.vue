<template>
  <v-dialog v-model="dialog" max-width="600px">
    <v-card>
      <v-card-title>
        <span class="headline">Crear Cuenta de Compañía</span>
      </v-card-title>

      <v-card-text>
        <v-form ref="form">
          <!-- Selección de proyectos -->
          <div class="mt-4">
            <h3 class="text-lg font-semibold mb-2">Seleccionar Proyectos</h3>
            <v-row>
              <v-col
                v-for="project in projects"
                :key="project._id"
                cols="12"
                sm="4"
              >
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>{{ project.name }}</v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-switch 
                      :model-value="selectedProjects.includes(project._id)" 
                      @change="toggleProject(project._id)"
                      :class="{'switch-on': selectedProjects.includes(project._id), 'switch-off': !selectedProjects.includes(project._id)}"
                      inset
                    />
                  </v-list-item-action>
                </v-list-item>
              </v-col>
            </v-row>
            <div v-if="projects.length === 0">
              <p>No se encontraron proyectos.</p>
            </div>
          </div>

          <!-- Campos dinámicos del formulario -->
          <div v-if="Object.keys(requiredFields).length > 0" class="mt-4">
            <h3 class="text-lg font-semibold mb-2">Completar Información de la Compañía</h3>
            <div v-for="(label, field) in requiredFields" :key="field">
              <!-- Si el label es "Recurso de wialon", muestra un campo seleccionable -->
              <v-select
                v-if="label === 'Recurso de wialon'"
                v-model="formData[field]"
                :items="resourceNames"
                item-text="name"
                item-value="id"
                :label="label"
                required
              ></v-select>
              <!-- Caso contrario, muestra un campo de texto -->
              <v-text-field
                v-else
                v-model="formData[field]"
                :label="label"
                required
              ></v-text-field>
            </div>
          </div>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-btn color="red" text @click="close">Cancelar</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="submitCompanyForm">Guardar</v-btn>
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
import { ref, onMounted, watch, nextTick } from 'vue';
import Swal from 'sweetalert2';
import { findAllProjects } from "@/api/ProjectsService";
import { requiredFieldsCompany, createCompany, findRecourses } from "@/api/CompanyService";
import store from "@/store";

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['update:modelValue']);

const dialog = ref(props.modelValue);
const dialogLoader = ref(false);

const projects = ref([]);
const selectedProjects = ref([]);
const requiredFields = ref({});
const formData = ref({});
const resourceNames = ref([]); // Lista de nombres de recursos
const resourceMap = ref({}); // Mapa de nombres a IDs

watch(() => props.modelValue, (newVal) => {
  dialog.value = newVal;
  if (newVal) {
    loadRequiredFields(); // Cargar los campos requeridos al abrir el componente
  }
});

const close = () => {
  emit('update:modelValue', false);
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

const loadRecourses = async () => {
  try {
    const token = store.state.token;
    const response = await findRecourses(token);
    const resources = response.data.data;
    resourceNames.value = resources.map(resource => resource.name);
    resources.forEach(resource => {
      resourceMap.value[resource.name] = resource.id;
    });
  } catch (error) {
    console.error("Error loading resources", error);
  }
};

const toggleProject = async (projectId) => {
  if (selectedProjects.value.includes(projectId)) {
    selectedProjects.value = selectedProjects.value.filter(id => id !== projectId);
  } else {
    selectedProjects.value.push(projectId);
  }

  await loadRequiredFields();
};

const loadRequiredFields = async () => {
  const token = store.state.token;
  const payload = { projectIds: selectedProjects.value };

  try {
    const response = await requiredFieldsCompany(token, payload);
    requiredFields.value = response.data.data;

    // Inicializa formData con campos vacíos
    for (const field in requiredFields.value) {
      formData.value[field] = formData.value[field] || '';
    }
  } catch (error) {
    close(); // Cerrar el modal antes de mostrar la alerta
    console.error("Error fetching required fields:", error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.message || 'Ocurrió un error al obtener los campos requeridos.',
    });
  }
};

const submitCompanyForm = async () => {
  if (selectedProjects.value.length === 0) {
    close(); // Cerrar el modal antes de mostrar la alerta de atención
    await nextTick(); // Asegurarse de que el modal esté completamente cerrado
    Swal.fire({
      icon: 'warning',
      title: 'Atención',
      text: 'Debes seleccionar al menos un proyecto.',
    });
    return;
  }

  // Si el campo "Recurso de wialon" está en el formulario, sustituir el valor con el ID correspondiente
  for (const field in requiredFields.value) {
    if (requiredFields.value[field] === 'Recurso de wialon') {
      formData.value[field] = resourceMap.value[formData.value[field]];
    }
  }

  const payload = {
    ...formData.value, 
    projectIds: selectedProjects.value
  };

  console.log("Payload enviado:", JSON.stringify(payload, null, 2)); // Imprimir el payload en formato JSON

  dialogLoader.value = true;

  const token = store.state.token;

  try {
    await createCompany(token, payload);

    close(); // Cierra el modal al completar la creación
    await nextTick(); // Espera a que el modal esté completamente cerrado

    Swal.fire({
      icon: 'success',
      title: 'Éxito',
      text: 'La compañía se creó correctamente.',
    });

    setTimeout(() => {
      location.reload();
    }, 3000);
  } catch (error) {
    close(); // Cerrar el modal antes de mostrar la alerta
    await nextTick(); // Asegurarse de que el modal esté completamente cerrado
    console.error("Error al crear la compañía:", error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.message || 'Ocurrió un error al crear la compañía.',
    });
  } finally {
    dialogLoader.value = false;
  }
};

onMounted(() => {
  loadProjects();
  loadRecourses(); // Cargar los recursos disponibles al montar el componente
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
