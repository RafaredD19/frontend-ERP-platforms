import { createRouter, createWebHistory } from 'vue-router';
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
                },
                {
                    name: "company",
                    path: "company",
                    component: () => import("@/views/CompanyView.vue"),
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

router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
   
    if (requiresAuth && !store.state.isAuthenticated) {
       
        next({ name: 'login' });
    } else if (to.name === 'login' && store.state.isAuthenticated) {
        if (store.state.role == "MASTER") {
          
            next({ name: 'company' });
        } else if (store.state.role == "REGULAR_USER_ROLE") {
          
            next({ name: 'forms' });
        }else if (store.state.role == "SUPER_MASTER"){
         
            next({name : 'administrator'})
        } else {
            next();
        }
    } else if (to.path === '/' && store.state.isAuthenticated) {
      
        if (store.state.role == "MASTER") {
            next({ name: 'company' });
        } else if (store.state.role == "REGULAR_USER_ROLE") {
            next({ name: 'forms' });
        }else if (store.state.role == "SUPER_MASTER"){
            next({name : 'administrator'})
        } else {
            next();
        }
    } else {
        next();
    }

});
export default router;


