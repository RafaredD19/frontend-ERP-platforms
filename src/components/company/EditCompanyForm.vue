<template>
  <v-dialog v-model="dialog" max-width="600px">
    <v-card>
      <v-card-title>
        <span class="headline">Editar Cuenta de Compañía</span>
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
            <h3 class="text-lg font-semibold mb-2">Completar Información de la Compañía</h3>
            <div v-for="(label, field) in requiredFields" :key="field">
              <!-- Si el label es "Recurso de wialon", muestra un campo seleccionable con búsqueda -->
              <v-select
                v-if="label === 'Recurso de wialon'"
                v-model="formData[field]"
                :items="resourceNames"
                item-text="name"
                item-value="id"
                :label="label"
                :filterable="true" 
                clearable
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
        <v-btn color="primary" text @click="submitEditForm">Guardar Cambios</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import Swal from 'sweetalert2';
import { findAllProjects } from "@/api/ProjectsService";
import { updateCompany, requiredFieldsCompany, findRecourses } from "@/api/CompanyService";
import store from "@/store";

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  companyData: {
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
const resourceNames = ref([]); // Lista de nombres de recursos
const resourceMap = ref({}); // Mapa de nombres a IDs

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

    // Buscar el nombre correspondiente al ID actual y asignarlo al campo del formulario
    const recourseName = Object.keys(resourceMap.value).find(name => resourceMap.value[name] === props.companyData.recourseWialon);
    if (recourseName) {
      formData.value.recourseWialon = recourseName;
    }
  } catch (error) {
    console.error("Error loading resources", error);
  }
};

const initializeForm = async () => {
  formData.value = {
    business: props.companyData.business,
    ruc : props.companyData.ruc,
    username: props.companyData.user.username,
    password: props.companyData.user.password,
    usernameWialon: props.companyData.usernameWialon,
    passwordWialon: props.companyData.passwordWialon,
    tokenWialon: props.companyData.tokenWialon,
    tokenNimbus: props.companyData.tokenNimbus,
    recourseWialon: props.companyData.recourseWialon // Esto se actualizará en loadRecourses
  };

  selectedProjects.value = props.companyData.projects.map(project => project._id);

  await loadRequiredFields();
  await loadRecourses(); // Cargar recursos después de inicializar el formulario
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
  const companyId = props.companyData._id; // Obtener el _id de la compañía
  const payload = { projectIds: selectedProjects.value };

  try {
    const response = await requiredFieldsCompany(token, payload, companyId);
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

  const token = store.state.token;

  try {
    await updateCompany(token, props.companyData._id, payload);
    Swal.fire({
      icon: 'success',
      title: 'Éxito',
      text: 'La compañía se actualizó correctamente.',
    });
    emit('updated');
    close();
  } catch (error) {
    console.error("Error al actualizar la compañía:", error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.message || 'Ocurrió un error al actualizar la compañía.',
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
