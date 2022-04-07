import { createRouter, createWebHashHistory } from 'vue-router'

import CreatePassword from '@/pages/CreatePassword.vue'
import Unlock from '@/pages/Unlock.vue'
import Dashboard from '@/pages/Dashboard.vue'

const routes = [
   {
      path: '/create-password',
      name: 'CreatePassword',
      component: CreatePassword,
   },
   {
      path: '/unlock',
      name: 'Unlock',
      component: Unlock,
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
