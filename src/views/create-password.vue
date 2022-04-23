<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Wallet from '@/modules/wallet'

const router = useRouter()
const password = ref<string>('')
const passwordConfirm = ref<string>('')
const passwordInput = ref<any>(null)
const error = ref<boolean | string>(false)

onMounted(() => {
   // autofocus on the input field
   passwordInput.value.focus()
})

const create = async () => {
   const validation = Wallet.validatePassword(password.value, passwordConfirm.value)
   error.value = validation.error
   if (validation.error) {
      return
   }
   await Wallet.createPassword(password.value)
   const encryptedPassword = await Wallet.encryptPassword(password.value)
   router.push({ name: '/onboarding', params: { ep: encryptedPassword } })
}
</script>

<template>
   <div class="view without-footer flex flex-col">
      <div class="flex justify-center mb-5">
         <div class="logo-circle">
            <svg width="96" height="96" viewBox="0 0 96 96" class="-translate-y-1" xmlns="http://www.w3.org/2000/svg">
               <path d="M65,4A38.41,38.41,0,0,0,9.6,38.4V96H28.8V71.8L25.15,58.54l13-3.64A18.8,18.8,0,0,1,34.43,52,19.21,19.21,0,0,1,55.72,20.81L68.66,17.2Z" fill="#1d8aed" />
               <path d="M28.91,60.68l3.53,12.76C75.05,92.17,108.19,32.1,68.79,6.14l3.64,13.2L59.39,23C77,36.05,62.26,63,42.45,56.75" fill="#40adff" />
            </svg>
         </div>
      </div>
      <div class="flex justify-center mb-3 text-heading">Create a password</div>
      <div class="flex justify-center mb-5 text-subheading text-center">You will use it to unlock your secure wallet.</div>
      <form class="grow flex flex-col" @submit.prevent="create">
         <input class="hidden" type="text" autocomplete="username" />
         <div class="mb-3">
            <input class="block w-full" type="password" v-model="password" ref="passwordInput" placeholder="Password" autocomplete="new-password" />
         </div>
         <div>
            <input class="block w-full" type="password" v-model="passwordConfirm" placeholder="Confirm Password" autocomplete="new-password" />
         </div>
         <div v-if="error" class="mt-3 form-error-message">{{ error }}</div>
         <div class="grow"></div>
         <button class="btn primary w-full mt-5" :disabled="!password || !passwordConfirm">Create</button>
      </form>
   </div>
</template>
