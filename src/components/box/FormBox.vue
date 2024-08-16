<template>
  <div class="max-w-sm mx-auto bg-white shadow-2xl rounded-xl overflow-hidden transform transition-all hover:scale-105 hover:shadow-2xl duration-300">
    <div class="relative">
      <v-img
        :src="imageUrl"
        class="w-full h-56 object-cover"
        alt="Project Logo"
      ></v-img>
      <div class="absolute inset-x-0 bottom-0 bg-primary bg-opacity-60 px-4 py-2">
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

const goToLink = () => {
  window.location.href = props.link;
};
</script>

<style scoped>
/* Custom styles for the component */
</style>
