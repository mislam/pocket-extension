<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Wallet from '@/modules/wallet'

const router = useRouter()
const password = ref<string>('')
const passwordInput = ref<any>(null)
const error = ref<any>(false)

const props = defineProps({
   prompt: String,
   returnTo: String,
})

const prompt = computed(() => {
   return props.prompt || 'Enter password to unlock'
})

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

   if (props.returnTo) {
      router.push({ name: props.returnTo, params: { ep: encryptedPassword } })
   } else {
      router.push('/dashboard')
   }
}
</script>

<template>
   <div class="view without-footer">
      <div class="flex justify-center mb-5 text-3xl leading-none">
         <div class="logo-circle">
            <svg width="96" height="96" viewBox="0 0 96 96" class="-translate-y-1" xmlns="http://www.w3.org/2000/svg">
               <path d="M65,4A38.41,38.41,0,0,0,9.6,38.4V96H28.8V71.8L25.15,58.54l13-3.64A18.8,18.8,0,0,1,34.43,52,19.21,19.21,0,0,1,55.72,20.81L68.66,17.2Z" class="fill-white/30" />
               <path d="M28.91,60.68l3.53,12.76C75.05,92.17,108.19,32.1,68.79,6.14l3.64,13.2L59.39,23C77,36.05,62.26,63,42.45,56.75" class="fill-white/20" />
            </svg>
         </div>
      </div>
      <div class="flex justify-center mb-5 text-xl leading-none">{{ prompt }}</div>
      <form class="grow flex flex-col" @submit.prevent="unlock">
         <div><input class="block w-full" :class="{ 'form-error-input': error }" type="password" v-model="password" ref="passwordInput" placeholder="Password" autocomplete="" /></div>
         <div v-if="error" class="mt-3 form-error-message">{{ error }}</div>
         <div class="grow"></div>
         <button class="btn primary w-full mt-5" :disabled="!password">Unlock</button>
      </form>
   </div>
</template>
