import { createApp } from 'vue'
import toast from 'vue-toastification'
import store from '@/modules/store'
import router from '@/modules/router'
import popup from '@/popup.vue'

import 'vue-toastification/dist/index.css'
import '@/modules/error-handlers'
import '@/styles/main.css'

// Dynamically create the app container div
const el = document.createElement('div')
el.classList.add('app')
document.body.appendChild(el)
const app = createApp(popup)

// Register plugin
app.use(toast, {
   position: 'top-center',
   closeButton: false,
   hideProgressBar: true,
})

// First initialize store and then use it
store.dispatch('init').then(() => {
   app.use(store)
   app.use(router)
   app.mount(el)
})
