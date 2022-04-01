import { createApp, nextTick } from 'vue'
import store from '@/modules/store'
import router from '@/modules/router'
import Popup from '@/Popup.vue'
import '@/styles/main.css'

router.beforeEach((to, from, next) => {
   // if password is not set yet
   if (store.state.passwordHash === null) {
      if (to.name !== 'CreatePassword') {
         next({ name: 'CreatePassword' })
      } else {
         next()
      }
   }
   // create-password route and password is already set
   else if (to.name === 'CreatePassword' && store.state.passwordHash !== null) {
      next(from) // go back to where you came from
   }
   // non-login route and locked
   else if (to.name !== 'Login' && store.state.locked) {
      next({ name: 'Login' })
   }
   // login route and unlocked
   else if (to.name === 'Login' && !store.state.locked) {
      next({ name: 'Dashboard' })
   }
   // login route and locked, or non-login route and unlocked
   else {
      next()
   }
})

const el = document.createElement('div')
document.body.appendChild(el)
const app = createApp(Popup)

store.dispatch('init').then(() => {
   app.use(store)
   app.use(router)
   app.mount(el)
})
