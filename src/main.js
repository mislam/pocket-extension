import { createApp } from 'vue'
import Popup from '@/Popup.vue'
import '@/styles/main.css'

const el = document.createElement('div')
document.body.appendChild(el)
createApp(Popup).mount(el)
