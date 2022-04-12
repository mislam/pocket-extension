import { Router, createRouter, createWebHashHistory } from 'vue-router'
import store from '@/modules/store'

import Onboarding from '@/views/Onboarding.vue'
import CreatePassword from '@/views/CreatePassword.vue'
import Unlock from '@/views/Unlock.vue'
import Dashboard from '@/views/Dashboard.vue'

const routes = [
   {
      path: '/onboarding',
      name: 'Onboarding',
      component: Onboarding,
   },
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

const router: Router = createRouter({
   history: createWebHashHistory(),
   routes,
})

router.beforeEach((to, from, next) => {
   // if password is not set yet
   if (!store.state.passwordHash) {
      if (to.name !== 'CreatePassword') {
         next({ name: 'CreatePassword' })
      } else {
         next()
      }
   }
   // create-password route and password is already set
   else if (to.name === 'CreatePassword' && !!store.state.passwordHash) {
      next(from) // go back to where you came from
   }
   // if no wallet has been created/imported yet
   else if (store.state.wallets.length === 0) {
      if (to.name !== 'Onboarding') {
         next({ name: 'Onboarding' })
      } else {
         next()
      }
   }
   // onboarding route and wallet has been already created/imported
   else if (to.name === 'Onboarding' && store.state.wallets.length > 0) {
      next(from) // go back to where you came from
   }
   // non-unlock route and locked
   else if (to.name !== 'Unlock' && store.state.locked) {
      next({ name: 'Unlock' })
   }
   // unlock route and unlocked
   else if (to.name === 'Unlock' && !store.state.locked) {
      next({ name: 'Dashboard' })
   }
   // unlock route and locked, or non-unlock route and unlocked
   else {
      next()
   }
})

export default router
