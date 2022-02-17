import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/Dashboard.vue')
    },
    {
      path: '/clients',
      name: 'clients',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/Clients.vue')
    },
    {
      path: '/rental',
      name: 'rental',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/Rental.vue')
    },
    {
      path: '/inventory',
      name: 'inventory',
      // route level code-splitting
      // this generates a separate chunk (bout.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/Inventory.vue')
    },
    {
      path: '/inventory/category',
      name: 'category',
      // route level code-splitting
      // this generates a separate chunk (bout.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/Category.vue')
    }
  ],
})

export default router