<!-- src/layouts/SidebarLayout.vue -->
<template>
    <div class="flex h-screen bg-gray-200">
      <!-- Sidebar -->
      <div :class="['bg-gray-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform', sidebarOpen ? 'translate-x-0' : '-translate-x-full']" @click="sidebarOpen = false" @keydown="sidebarOpen = false" v-show="sidebarOpen">
        <h1 class="text-2xl font-semibold text-center">Menú</h1>
        <nav>
          <a href="#" class="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">Perfil</a>
          <a href="#" class="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">Configuración</a>
          <a href="#" class="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">Cerrar sesión</a>
        </nav>
      </div>
      <!-- Main content -->
      <div class="flex-1 p-10">
        <button @click="sidebarOpen = !sidebarOpen" class="bg-blue-500 text-white p-2 rounded-md">
          Toggle Sidebar
        </button>
        <router-view />
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        sidebarOpen: false,
      };
    },
  };
  </script>
  
  <style scoped>
  .transition {
    transition: transform 0.3s ease;
  }
  </style>
  