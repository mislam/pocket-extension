import { createApp } from 'vue'
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

const el = document.createElement('div')
document.body.appendChild(el)
const app = createApp(Popup)

store.dispatch('init').then(() => {
   app.use(store)
   app.use(router)
   app.mount(el)
})
