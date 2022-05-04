import { createApp } from 'vue'
import toast from 'vue-toastification'
import store from '@/modules/store'
import router from '@/modules/router'
import popup from '@/popup.vue'

import 'vue-toastification/dist/index.css'
import '@/modules/error-handlers'
import '@/styles/index.css'

const init = async () => {
   const app = createApp(popup)

   // Register plugin
   app.use(toast, {
      position: 'top-center',
      closeButton: false,
      hideProgressBar: true,
      pauseOnHover: false,
   })

   // First initialize the Vuex store
   await store.dispatch('init')

   // Use required plugins
   app.use(store)
   app.use(router)

   // Create the app container DOM
   const el = document.createElement('div')
   el.classList.add('app')
   document.body.appendChild(el)

   // Mount app to the container DOM
   app.mount(el)
}

export default {
   init,
}
