import { Router, createRouter, createWebHashHistory, RouteLocationRaw } from 'vue-router'
import store from '@/modules/store'

const routeOptions: any = {
   '/onboarding': {
      meta: { requiresPassword: true },
   },
   '/settings/private-key': {
      meta: { requiresPassword: true },
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
   }
   if (routeOptions.hasOwnProperty(routePath)) {
      Object.assign(route, routeOptions[routePath])
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
   // if password is set and routing to the unlock route, do nothing (stay there)
   else if (to.path === '/unlock') {
      // do nothing, stay at unlock route
   }
   // if the route requires password and the encryptedPassword is not passed, go to unlock
   else if (to.meta.requiresPassword && !to.params.ep) {
      return {
         name: '/unlock',
         params: {
            prompt: 'Enter password to proceed',
            returnTo: to.path,
         },
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
