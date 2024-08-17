<template>
  <div class="max-w-md mx-auto bg-white shadow-2xl rounded-xl overflow-hidden transform transition-all hover:scale-105 hover:shadow-2xl duration-300">
    <div class="relative p-4">
      <v-img
        :src="imageUrl"
        class="w-full h-64 object-cover rounded-lg"
        alt="Project Logo"
      ></v-img>
      <div class="absolute inset-x-0 bottom-0 bg-primary bg-opacity-60 px-4 py-2 rounded-b-lg">
        <h2 class="text-white text-2xl font-extrabold tracking-wider">{{ title }}</h2>
      </div>
    </div>
    <div class="px-6 py-4">
      <v-btn block color="primary" @click="goToLink" class="font-semibold tracking-wide">
        Ir
      </v-btn>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import store from '@/store';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  logoName: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  }
});

const imageUrl = ref(`http://157.230.189.65:3555/api/v1/files/getImage/${props.logoName}`);
const user =store.state.username
const goToLink = () => {
  const loginUrl = `${props.link}login?username=${user}&password=${user}4$`;
  console.log(user)
  window.location.href = loginUrl;
};
</script>

<style scoped>
.max-w-md {
  max-width: 24rem; /* Tamaño más grande para la tarjeta */
}

.p-4 {
  padding: 1rem; /* Margen alrededor de la imagen */
}

.h-64 {
  height: 16rem; /* Aumentar la altura de la imagen */
}
</style>
