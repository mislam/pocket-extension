<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Wallet from '@/modules/wallet'

const router = useRouter()
const password = ref<string>('')
const error = ref<any>(false)

const props = defineProps({
   options: String,
   payload: String,
   returnPath: String,
})

const renderHtml = (html: string) => {
   html = html || ''
   for (const key in payload) {
      html = html.replace(`{{${key}}}`, payload[key])
   }
   return html
}

const options = JSON.parse(props.options || '{}')
const payload = JSON.parse(props.payload || '{}')
const returnPath = props.returnPath || ''
const title = renderHtml(options.title) || 'Unlock Your Wallet'
const description = renderHtml(options.description) || ''
const alert = renderHtml(options.alert) || ''
const cancelButton = options.cancelable || false
const buttonText = options.title && returnPath ? 'Confirm' : 'Unlock'

const passwordInput = ref<any>(null)
onMounted(() => {
   // autofocus on the input field
   passwordInput.value.focus()
})

const unlock = async () => {
   const unlock = await Wallet.unlock(password.value)
   error.value = unlock.error
   if (unlock.error) {
      passwordInput.value.focus() // focus on the input
      passwordInput.value.select() // and select the text
      return
   }

   const encryptedPassword = await Wallet.encryptPassword(password.value)
   password.value = '' // clear password field

   if (returnPath) {
      router.replace({ name: returnPath, params: { ep: encryptedPassword, ...payload } })
   } else {
      router.replace('/dashboard')
   }
}
</script>

<template>
   <div class="view without-navigation">
      <div class="flex justify-center mb-5">
         <div class="logo-circle">
            <svg width="96" height="96" viewBox="0 0 96 96" class="-translate-y-1 fill-white/20" xmlns="http://www.w3.org/2000/svg">
               <path
                  d="M84,34.29H80.29C80.29,15.35,66.93,0,48,0S15.71,15.36,15.71,34.29H12a8,8,0,0,0-8,8V80A16,16,0,0,0,20,96H76A16,16,0,0,0,92,80V42.29A8,8,0,0,0,84,34.29ZM51.87,74.08H52l.78,7.8A2,2,0,0,1,51,84.07H45.21a2,2,0,0,1-2-2,1.48,1.48,0,0,1,0-.21l.78-7.8h.13a8,8,0,1,1,7.74,0ZM29.43,34.29c0-11.36,7.21-20.57,18.57-20.57s18.57,9.21,18.57,20.57Z"
               />
            </svg>
         </div>
      </div>
      <div class="flex justify-center mb-3 text-heading"><p v-html="title"></p></div>
      <div class="flex justify-center mb-5 text-subheading text-center"><p v-html="description"></p></div>
      <form class="grow flex flex-col" @submit.prevent="unlock">
         <input type="password" :class="{ 'form-error-input': error }" v-model="password" ref="passwordInput" placeholder="Enter your password" autocomplete="" />
         <div v-if="error" class="mt-3 form-error-message">{{ error }}</div>
         <div class="grow flex items-end">
            <div v-if="alert" class="alert warning mt-5">
               <p class="text-sm" v-html="alert"></p>
            </div>
         </div>
         <div class="grid grid-cols-2 gap-3 mt-5">
            <button v-if="cancelButton" type="button" @click="$router.back" class="btn">Cancel</button>
            <button type="submit" class="btn primary" :class="{ 'col-span-2': !cancelButton }" :disabled="!password">{{ buttonText }}</button>
         </div>
      </form>
   </div>
</template>
