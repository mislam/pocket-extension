import { createRouter, createWebHashHistory } from 'vue-router'

import CreatePassword from '@/pages/CreatePassword.vue'
import Login from '@/pages/Login.vue'
import Dashboard from '@/pages/Dashboard.vue'

const routes = [
   {
      path: '/create-password',
      name: 'CreatePassword',
      component: CreatePassword,
   },
   {
      path: '/login',
      name: 'Login',
      component: Login,
   },
   {
      path: '/',
      name: 'Dashboard',
      component: Dashboard,
      requiresAuth: true,
   },
]

const router = createRouter({
   history: createWebHashHistory(),
   routes,
})

export default router
