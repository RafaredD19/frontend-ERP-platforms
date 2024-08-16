<template>
  
  <div class="min-h-screen flex items-center justify-center bg-blue-100">
    <div class="flex flex-col md:flex-row w-full max-w-7xl bg-white shadow-md rounded-lg overflow-hidden">
      <div class="md:w-1/2 flex items-center justify-center pl-2 pr-2 bg-gray-100">
        <img :src="imgLogo" alt="Logo Image" class="max-w-full h-auto" />
      </div>
      <div class="md:w-1/2 p-8">
        <div v-if="statusError" class="flex justify-center">
          <v-alert color="#FF5250" theme="dark" icon="mdi-alert-circle" density="compact" closable class="max-w-[25rem]">
            {{ messageError }}

          </v-alert>
        </div>
        <form-login @validate-login="onValidateLogin" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import FormLogin from '@/components/login/FormLogin.vue';
import ImgLogo from '@/assets/logoimage.jpg';
import { authLoginApi } from '@/api/LoginService';
import { useRouter, useRoute } from 'vue-router';
import store from '@/store';

export default {
  components: {
    FormLogin
  },
  data: () => ({
    imgLogo: ImgLogo
  }),
  setup() {
    const messageError = ref('');
    const statusError = ref(false);
    const router = useRouter();
    const route = useRoute();

    const onValidateLogin = (data) => {
      authLoginApi(data)
        .then(response => {
          const user = response.data.data;
          store.commit('setUsername', user.username);
          store.commit('setToken', user.token);
          store.commit('setRole', user.role);
          store.commit('setIsAuthenticated', true);
          router.push('/');
        })
        .catch(error => {
          statusError.value = true;
          if (error.response) {
            if (error.response.status === 401) {
              messageError.value = "Las credenciales de usuario no son válidas";
            } else if (error.response.status === 500) {
              messageError.value = "Error 500: Error interno del servidor";
            } else {
              messageError.value = error.response.data.message;
            }
          } else if (error.request) {
            messageError.value = "No se recibió respuesta del servidor";
          } else {
            messageError.value = "Error al configurar la solicitud: " + error.message;
          }
        });
    };

    onMounted(() => {
      const username = route.query.username;
      const password = route.query.password;

      if (username && password) {
        const data = { username, password };
        onValidateLogin(data);
      }
    });

    return {
      onValidateLogin,
      messageError,
      statusError
    };
  }
};
</script>


<style>
/* Puedes agregar estilos aquí si es necesario */
</style>
