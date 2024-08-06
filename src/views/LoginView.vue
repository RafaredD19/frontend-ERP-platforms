<template>
    <div class="min-h-screen flex items-center justify-center bg-blue-100">
      <div class="flex flex-col md:flex-row w-full max-w-7xl   bg-white shadow-md rounded-lg overflow-hidden">
        <div class="md:w-1/2 flex items-center justify-center pl-2 pr-2 bg-gray-100">
          <img :src="imgLogo" alt="Logo Image" class="max-w-full h-auto" />
        </div>
        <div class="md:w-1/2 p-8">
          <form-login @validate-login="onValidateLogin"/>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import FormLogin from '@/components/login/FormLogin.vue';
  import ImgLogo from '@/assets/logoimage.jpg';
  import { authLoginApi } from '@/api/LoginService';
import { useRouter } from 'vue-router';
import store from '@/store';
  
  export default {
    components: {
      FormLogin
    },
    data() {
      return {
        imgLogo: ImgLogo
      };
    }
  };
  </script>
  
  <style>
    
  
  </style>
  