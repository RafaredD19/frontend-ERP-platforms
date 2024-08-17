<template>
  <v-card>
      <v-layout>
          <v-navigation-drawer v-model="drawer" :rail="rail" permanent @click="rail = false" color="indigo-darken-1"
              class="border-0">
              <div class="p-2 py-7 flex items-center justify-center gap-2">
                  <div>
                      <div class="p-1 pt-4 flex items-center justify-center">
                          <img :src="logoEdriver" class="w-[6rem] bg-gray-100 rounded-md" />
                      </div>
                      <p v-if="!rail" class="font-bold text-2xl text-center w-full">eBox</p>
                  </div>
              </div>
              <v-list>
                  <div v-for="itemNavegation in filteredItems" :key="itemNavegation.value">
                      <router-link :to="itemNavegation.to" v-if="itemNavegation.children.length == 0">
                          <v-list-item @click="selectItem(itemNavegation.to)" :prepend-icon="itemNavegation.icon"
                              :title="itemNavegation.title" :value="itemNavegation.value"
                              :class="{ 'selected-item': selectedItem === itemNavegation.to }"></v-list-item>
                      </router-link>
                      <v-list-group v-else :value="itemNavegation.value" fluid>
                          <template v-slot:activator="{ props }">
                              <v-list-item v-bind="props" :prepend-icon="itemNavegation.icon" :title="itemNavegation.title"
                                  active-class="bg-indigo-lighten-1"></v-list-item>
                          </template>
                          <div :class="{ 'my-2 border-l-4 border-blue-500 ml-3': !rail, 'my-2 border-l-4 border-blue-700': rail }">
                              <router-link :to="item.to" v-for="item in itemNavegation.children" :key="item.value" class="rounded-md">
                                  <v-list-item @click="selectItem(item.to)" :prepend-icon="item.icon" :title="item.title"
                                      :value="item.value" active-class="blue-darken-3 rounded-md"
                                      :class="{ 'selected-item': selectedItem === item.to }"></v-list-item>
                              </router-link>
                          </div>
                      </v-list-group>
                  </div>
              </v-list>
          </v-navigation-drawer>
          <v-main class="h-screen bg-slate-100 block">
              <div class="w-full bg-white flex justify-between items-center px-3 shadow-sm">
                  <v-btn variant="text" icon="mdi-menu" color="blue-grey-lighten-1" class="cursor-pointer"
                      @click.stop="rail = !rail"></v-btn>
                  <div class="flex items-center">
                      <div class="flex items-center text-start text-xs">
                          <v-list>
                              <v-list-item class="text-start item-personalizado" :prepend-avatar="avatarPath">
                                  <template v-slot:default>
                                      <v-row>
                                          <v-col>
                                              <div class="text-sm">Hola, {{ username }}</div>
                                              <div class="caption">{{ rol }}</div>
                                          </v-col>
                                      </v-row>
                                  </template>
                              </v-list-item>
                          </v-list>
                      </div>
                      <MenuAsPopover />
                  </div>
              </div>
              <section class="overflow-y-auto section_main" :class="isMobile ? 'p-4' : 'p-8'">
                  <router-view />
              </section>
          </v-main>
      </v-layout>
  </v-card>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import MenuAsPopover from '@/components/general/MenuAsPopover.vue';
// import avatarImage from "@/assets/iconuser_hombre.png";
// import LogoEdriver from "@/assets/logo.png";
import store from '@/store';

export default {
  components: {
       MenuAsPopover
  },
  data() {
      return {
          // avatarPath: avatarImage,
          // logoEdriver: LogoEdriver
      }
  },
  setup() {
      const isMobile = ref(false);
      const drawer = ref(true);
      const rail = ref(true);
      const rol = ref('');
      const username = ref('');
      const selectedItem = ref(null);
      const ItemsNavegation = ref([


      
         
        
          {
              icon: "mdi-domain",
              title: "Compañias",
              value: "company",
              to: "/company",
              children: []
          },
          {
              icon: "mdi-account-group",
              title: "Administradores",
              value: "administrator",
              to: "/administrator",
              children: []
          },
          {
              icon: "mdi mdi-monitor",
              title: "Proyectos",
              value: "project",
              to: "/project",
              children: []
          },
          {
              icon: "mdi mdi-monitor",
              title: "Proyectos",
              value: "boxproject",
              to: "/boxproject",
              children: []
          },
      ]);

      const router = useRoute();

      onMounted(() => {
          rol.value = store.state.role;
          username.value = store.state.username;
          handleResize();
          window.addEventListener("resize", handleResize);
          selectedItem.value = router.fullPath;
      });

      const filteredItems = computed(() => {
          if (store.state.role === 'MASTER') {
              return ItemsNavegation.value.filter(item => item.value === 'company'  || item.value==='boxproject' );
          } else if (store.state.role === 'COMPANY') {
              return ItemsNavegation.value.filter(item =>   item.value==='boxproject');
          } else if (store.state.role === 'SUPER_MASTER') {
              return ItemsNavegation.value.filter(item => item.value === 'administrator' || item.value ==='project');
          } else {
              return [];
          }
      });

      const handleResize = () => {
          isMobile.value = window.innerWidth <= 500;
      };

      const selectItem = (item) => {
          selectedItem.value = item;
      };

      return {
          isMobile,
          drawer,
          rail,
          rol,
          username,
          selectedItem,
          ItemsNavegation,
          filteredItems,
          selectItem
      }
  }
}
</script>

<style>
.selected-item {
  background-color: #4777bea1 !important;
  border-right: 4px solid rgb(119, 153, 190);
}

.v-list-item-title {
  font-size: 14px !important;
}

.v-list-item-subtitle {
  font-size: 13px !important;
}

.section_main {
  overflow-y: auto !important;
  height: 100%;
  padding-bottom: 5rem !important;
}
</style>
