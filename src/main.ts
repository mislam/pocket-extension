import { createApp } from 'vue'
import store from '@/modules/store'
import router from '@/modules/router'
import popup from '@/popup.vue'

import '@/modules/error-handlers'
import '@/styles/main.css'

const el = document.createElement('div')
el.classList.add('app')
document.body.appendChild(el)
const app = createApp(popup)

store.dispatch('init').then(() => {
   app.use(store)
   app.use(router)
   app.mount(el)
})
