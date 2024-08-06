<template>
  <div>
    <h2 class="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h2>
    <form @submit.prevent="validateLogin">
      <div class="mb-4 relative">
        <label for="username" class="block text-gray-700 text-sm font-bold mb-2">Usuario:</label>
        <div class="flex items-center">
          <span class="absolute pl-3">
            <font-awesome-icon icon="user" class="text-gray-500" />
          </span>
          <input type="text" id="username" v-model="username" required
                 class="shadow appearance-none border rounded w-full py-2 px-3 pl-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        </div>
      </div>
      <div class="mb-6 relative">
        <label for="password" class="block text-gray-700 text-sm font-bold mb-2">Contraseña:</label>
        <div class="flex items-center">
          <span class="absolute pl-3">
            <font-awesome-icon icon="lock" class="text-gray-500" />
          </span>
          <input :type="showPassword ? 'text' : 'password'" id="password" v-model="password" required
                 class="shadow appearance-none border rounded w-full py-2 px-3 pl-10 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" />
          <span class="absolute right-3 cursor-pointer" @click="togglePasswordVisibility">
            <font-awesome-icon :icon="showPassword ? 'eye-slash' : 'eye'" class="text-gray-500" />
          </span>
        </div>
      </div>
      <div class="flex items-center justify-center pt-5">
        <button type="submit"
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Iniciar Sesión
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

export default {
  components: {
    FontAwesomeIcon
  },
  emits: ['validate-login'],
  setup(_, { emit }) {
    const username = ref('');
    const password = ref('');
    const showPassword = ref(false);

    const validateLogin = () => {
      const data = {
        username: username.value,
        password: password.value
      };
      emit('validate-login', data);
    };

    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value;
    };

    return {
      username,
      password,
      validateLogin,
      showPassword,
      togglePasswordVisibility
    };
  }
};
</script>

<style scoped>
/* Puedes agregar estilos locales aquí si es necesario */
</style>
