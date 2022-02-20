import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/dashboard',
      name: 'home',
      component: Home
    },
    {
      path: '/dashboard/home',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/Dashboard.vue')
    },
    {
      path: '/dashboard/clients',
      name: 'clients',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/Clients.vue')
    },
    {
      path: '/dashboard/rental',
      name: 'rental',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/Rental.vue')
    },
    {
      path: '/dashboard/inventory',
      name: 'inventory',
      // route level code-splitting
      // this generates a separate chunk (bout.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/Inventory.vue')
    },
    {
      path: '/dashboard/inventory/category',
      name: 'category',
      // route level code-splitting
      // this generates a separate chunk (bout.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/Category.vue')
    }
  ],
})

export default router