import { Router, createRouter, createWebHashHistory, RouteLocationRaw } from 'vue-router'
import store from '@/modules/store'

import Onboarding from '@/views/Onboarding.vue'
import CreatePassword from '@/views/CreatePassword.vue'
import Unlock from '@/views/Unlock.vue'
import Dashboard from '@/views/Dashboard.vue'
import History from '@/views/History.vue'
import Settings from '@/views/Settings.vue'

const routes = [
   {
      path: '/create-password',
      name: 'CreatePassword',
      component: CreatePassword,
   },
   {
      path: '/onboarding',
      name: 'Onboarding',
      component: Onboarding,
      meta: { requiresPassword: true },
      beforeEnter: (to: RouteLocationRaw, from: RouteLocationRaw) => {
         // if wallet has been already created/imported
         if (store.state.wallets.length > 0) {
            router.push(from) // go back to where you came from
         }
      },
   },
   {
      path: '/unlock',
      name: 'Unlock',
      component: Unlock,
      props: true,
      beforeEnter: () => {
         // if already unlocked and has encryptedPassword
         if (!store.state.locked && store.state.encryptedPassword) {
            router.push({ name: 'Dashboard' }) // go to dashboard
         }
      },
   },
   {
      path: '/',
      name: 'Dashboard',
      component: Dashboard,
   },
   {
      path: '/history',
      name: 'History',
      component: History,
   },
   {
      path: '/settings',
      name: 'Settings',
      component: Settings,
   },
]

const router: Router = createRouter({
   history: createWebHashHistory(),
   routes,
})

router.beforeEach((to, from) => {
   // if password is not set yet, go to create password
   if (!store.state.passwordHash) {
      if (to.name !== 'CreatePassword') {
         return { name: 'CreatePassword' }
      }
   }
   // if password is set and routing to the unlock route, do nothing
   else if (to.name === 'Unlock') {
      return true
   }
   // if the route requires password and the encryptedPassword is empty, go to unlock
   else if (to.meta.requiresPassword && !store.state.encryptedPassword) {
      return {
         name: 'Unlock',
         params: {
            prompt: 'Enter password to proceed',
         },
      }
   }
   // if no wallet has been created/imported yet, go to onboarding
   else if (store.state.wallets.length === 0) {
      if (to.name !== 'Onboarding') {
         return { name: 'Onboarding' }
      }
   }
   // if locked, go to unlock
   else if (store.state.locked) {
      return { name: 'Unlock' }
   }
})

export default router
