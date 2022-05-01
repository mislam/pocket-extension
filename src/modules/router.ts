import { Router, createRouter, createWebHashHistory } from 'vue-router'
import store from '@/modules/store'

// Include additional meta fields to some special routes
const routeOptions: any = {
   '/onboarding': {
      requiresPassword: true,
   },
   '/add-wallet': {
      requiresPassword: {
         title: 'Add Wallet',
         description: 'Enter your password to confirm',
      },
   },
   '/settings/private-key': {
      requiresPassword: {
         title: 'Show Private Key',
         description: 'Enter your password to confirm',
         alert: 'Never disclose your private key! Anyone with your private key can fully control your wallet, including transferring your funds.',
      },
   },
   '/send-tx-result': {
      requiresPassword: {
         title: 'Send POKT',
         description:
            'You are about to send <span class="font-mono" style="color:#f59e0b">{{amount}}</span> POKT from your wallet. Enter your password to confirm this transaction.',
         cancelable: true,
      },
      requiredParams: ['address', 'amount', 'memo'],
   },
}

const routes: any = [{ path: '/', redirect: '/dashboard' }]
const views = import.meta.globEager('@/views/**/*.vue')
Object.entries(views).forEach(([viewPath, viewModule]: any) => {
   const routePath = viewPath
      .replace(new RegExp('^../views'), '')
      .replace(new RegExp('.\\w+$'), '')
      .replace(new RegExp('/index$'), '')
   const route = {
      name: routePath,
      path: routePath,
      props: true,
      component: viewModule.default,
      meta: {},
   }
   if (routeOptions.hasOwnProperty(routePath)) {
      Object.assign(route.meta, routeOptions[routePath])
   }
   routes.push(route)
})

const router: Router = createRouter({
   history: createWebHashHistory(),
   routes,
})

router.beforeEach((to, from) => {
   // if password is not set yet, go to create password
   if (!store.state.passwordHash) {
      if (to.path !== '/create-password') {
         return '/create-password'
      }
   }
   // if password is set yet and still requesting create password route, cancel routing
   else if (to.path === '/create-password') {
      return false
   }
   // if password is set and routing to the unlock route, do nothing (stay there)
   else if (to.path === '/unlock') {
      // if already unlocked and not requesting password verification, go to dashboard
      if (!store.state.locked && !to.params.returnPath) {
         return '/dashboard'
      }
   }
   // if the route requires password and the encryptedPassword is not passed, go to unlock
   else if (to.meta.requiresPassword && !to.params.ep) {
      // if any of the required params is missing, go back to dashboard
      const requiredParams: any = to.meta.requiredParams || []
      for (const key of requiredParams) {
         if (!to.params.hasOwnProperty(key)) {
            return '/dashboard'
         }
      }
      const options = JSON.stringify(to.meta.requiresPassword)
      const payload = JSON.stringify(to.params)
      const returnPath = to.path
      const params = Object.assign({}, { options, returnPath, payload })
      return {
         name: '/unlock',
         params,
      }
   }
   // if no wallet has been created/imported yet, go to onboarding
   else if (store.state.wallets.length === 0) {
      if (to.path !== '/onboarding') {
         return '/onboarding'
      }
   }
   // if wallet has been already created/imported, but still at onboarding route, go to dashboard
   else if (store.state.wallets.length > 0 && to.path === '/onboarding') {
      return '/dashboard'
   }
   // if locked, go to unlock
   else if (store.state.locked) {
      return '/unlock'
   }
})

export default router
