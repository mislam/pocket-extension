<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Wallet from '@/modules/wallet'

const router = useRouter()
const password = ref<string>('')
const passwordInput = ref<any>(null)
const error = ref<any>(false)

const props = defineProps({
   title: String,
   description: String,
   returnTo: String,
})

const title = props.title || 'Unlock Your Wallet'
const description = props.description || ''
const returnTo = props.returnTo || ''
const buttonText = returnTo ? 'Confirm' : 'Unlock'

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

   if (returnTo) {
      router.push({ name: returnTo, params: { ep: encryptedPassword } })
   } else {
      router.push('/dashboard')
   }
}
</script>

<template>
   <div class="view without-footer">
      <div class="flex justify-center mb-5">
         <div class="logo-circle">
            <svg width="96" height="96" viewBox="0 0 96 96" class="-translate-y-1" xmlns="http://www.w3.org/2000/svg">
               <path
                  d="M84,34.29H80.29C80.29,15.35,66.93,0,48,0S15.71,15.36,15.71,34.29H12a8,8,0,0,0-8,8V80A16,16,0,0,0,20,96H76A16,16,0,0,0,92,80V42.29A8,8,0,0,0,84,34.29ZM51.87,74.08H52l.78,7.8A2,2,0,0,1,51,84.07H45.21a2,2,0,0,1-2-2,1.48,1.48,0,0,1,0-.21l.78-7.8h.13a8,8,0,1,1,7.74,0ZM29.43,34.29c0-11.36,7.21-20.57,18.57-20.57s18.57,9.21,18.57,20.57Z"
                  class="fill-white/20"
               />
            </svg>
         </div>
      </div>
      <div class="flex justify-center mb-5 text-xl leading-none">{{ title }}</div>
      <form class="grow flex flex-col" @submit.prevent="unlock">
         <input class="block w-full" :class="{ 'form-error-input': error }" type="password" v-model="password" ref="passwordInput" placeholder="Enter your password" autocomplete="" />
         <div v-if="error" class="mt-2 form-error-message">{{ error }}</div>
         <div class="grow flex items-end">
            <div v-if="description" class="alert warning mt-5">
               <p class="text-sm">{{ description }}</p>
            </div>
         </div>
         <button class="btn primary w-full mt-5" :disabled="!password">{{ buttonText }}</button>
      </form>
   </div>
</template>
