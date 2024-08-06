import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store';

const router = createRouter({
  history: createWebHistory(),
  routes: [
      {
          meta: {
              title: "Home",
              requiresAuth: true
          },
          path: "/",
          component: () => import("@/layouts/MasterLayout.vue"),
          children: [
              {
                  name: "administrator",
                  path: "administrator",
                  component: () => import("@/views/AdministratorViews.vue"),
              }
          ]
      },
      {
          meta: {
              title: "Login"
          },
          path: "/login",
          name: "login",
          component: () => import("@/views/LoginView.vue")
      }
  ]
})

// Navigation Guard
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !store.state.isAuthenticated) {
      // Si la ruta requiere autenticación y el usuario no está autenticado, redirigir a la página de inicio de sesión
      next({ name: 'login' });
  } else if (to.name === 'login' && store.state.isAuthenticated) {
      if (store.state.role == "ADMIN_ROLE") {
          next({ name: 'customers' });
      } else if (store.state.role == "REGULAR_USER_ROLE") {
          next({ name: 'forms' });
      }else if (store.state.role == "MASTER_ADMIN_ROLE"){
          next({name : 'administrator'})
      } else {
          next();
      }
  } else if (to.path === '/' && store.state.isAuthenticated) {
      if (store.state.role == "ADMIN_ROLE") {
          next({ name: 'customers' });
      } else if (store.state.role == "REGULAR_USER_ROLE") {
          next({ name: 'forms' });
      }else if (store.state.role == "MASTER_ADMIN_ROLE"){
          next({name : 'administrator'})
      } else {
          next();
      }
  } else {
      next();
  }

});

export default router
