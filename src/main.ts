import { createApp } from 'vue'
import store from '@/modules/store'
import router from '@/modules/router'
import Popup from '@/Popup.vue'

import '@/modules/error-handlers'
import '@/styles/main.css'

const el = document.createElement('div')
document.body.appendChild(el)
const app = createApp(Popup)

store.dispatch('init').then(() => {
   app.use(store)
   app.use(router)
   app.mount(el)
})
