import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import { useCookies } from "vue3-cookies";

const guard = function(to, from, next) {
  const { cookies } = useCookies();
  if(cookies.get('auth')) {
    next();
  } else {
    window.location.href = "/dashboard";
  }
};

const logged = function(to, from, next) {
  const { cookies } = useCookies();
  if(cookies.get('auth')) {
    window.location.href = "/dashboard/home";
  } else {
    next();
  }
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/dashboard',
      name: 'login',
      component: Home,
      beforeEnter: (to, from, next) => {
        logged(to, from, next);
      }
    },
    {
      path: '/dashboard/home',
      name: 'home',
      component: () => import('../views/Dashboard.vue'),
      beforeEnter: (to, from, next) => {
        guard(to, from, next);
      }
    },
    {
      path: '/dashboard/clients',
      name: 'clients',
      component: () => import('../views/Clients.vue'),
      beforeEnter: (to, from, next) => {
        guard(to, from, next);
      }
    },
    {
      path: '/dashboard/rental',
      name: 'rental',
      component: () => import('../views/Rental.vue'),
      beforeEnter: (to, from, next) => {
        guard(to, from, next);
      }
    },
    {
      path: '/dashboard/inventory',
      name: 'inventory',
      component: () => import('../views/Inventory.vue'),
      beforeEnter: (to, from, next) => {
        guard(to, from, next);
      }
    },
    {
      path: '/dashboard/inventory/category',
      name: 'category',
      component: () => import('../views/Category.vue'),
      beforeEnter: (to, from, next) => {
        guard(to, from, next);
      }
    },
    {
      path: '/dashboard/employees',
      name: 'employees',
      component: () => import('../views/Employees.vue'),
      beforeEnter: (to, from, next) => {
        guard(to, from, next);
      }
    },
  ],
})

export default router