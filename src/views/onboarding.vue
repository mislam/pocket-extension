<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Wallet from '@/modules/wallet'

// Get the encrypted password sent from unlock screen
const props = defineProps({ ep: String })
const encryptedPassword = props.ep || ''

const router = useRouter()
const method = ref('create') // or import
const privateKeyInput = ref<string>('')
const error = ref<boolean | string>(false)

const switchMethod = (m: string) => {
   error.value = false
   method.value = m
}

const create = async () => {
   try {
      await Wallet.createNew(encryptedPassword)
      error.value = false
      router.push('/dashboard')
   } catch (e: any) {
      error.value = e.message
   }
}

const importWallet = async () => {
   try {
      await Wallet.importFromPrivateKey(encryptedPassword, privateKeyInput.value)
      router.push('/dashboard')
   } catch (e: any) {
      error.value = e.message
   }
}
</script>

<template>
   <div class="view without-footer">
      <!-- Create -->
      <div class="grow flex flex-col" v-if="'create' === method">
         <div class="flex justify-center mb-5 text-3xl leading-none">
            <div class="logo-circle">
               <svg width="96" height="96" viewBox="0 0 96 96" class="-translate-y-1" xmlns="http://www.w3.org/2000/svg">
                  <path d="M65,4A38.41,38.41,0,0,0,9.6,38.4V96H28.8V71.8L25.15,58.54l13-3.64A18.8,18.8,0,0,1,34.43,52,19.21,19.21,0,0,1,55.72,20.81L68.66,17.2Z" fill="#1d8aed" />
                  <path d="M28.91,60.68l3.53,12.76C75.05,92.17,108.19,32.1,68.79,6.14l3.64,13.2L59.39,23C77,36.05,62.26,63,42.45,56.75" fill="#40adff" />
               </svg>
            </div>
         </div>
         <div class="flex justify-center mb-3 text-3xl leading-none">Welcome</div>
         <div class="flex justify-center mb-5 text-subheading text-center">Now let's set up a secure wallet for you.</div>
         <div v-if="error" class="mb-5 form-error-message">{{ error }}</div>
         <div class="grow"></div>
         <button type="button" @click="create" class="btn primary w-full">Create a new wallet</button>
         <button type="button" @click="switchMethod('import')" class="btn w-full mt-3">I already have a wallet</button>
      </div>
      <!-- Import -->
      <div class="grow flex flex-col" v-if="'import' === method">
         <div class="flex justify-center mb-3 text-heading">Import Your Wallet</div>
         <div class="flex justify-center mb-5 text-subheading text-center">Import an existing wallet with your 128-digit private key.</div>
         <form class="grow flex flex-col" @submit.prevent="importWallet">
            <div>
               <textarea class="block w-full font-mono" rows="5" v-model="privateKeyInput" placeholder="Enter your private key"></textarea>
            </div>
            <div v-if="error" class="mt-3 form-error-message">{{ error }}</div>
            <div class="grow"></div>
            <button type="submit" class="btn primary w-full mt-5" :disabled="!privateKeyInput.length">Import Wallet</button>
         </form>
         <button type="button" @click="switchMethod('create')" class="btn w-full mt-3">Or, Create a new wallet</button>
      </div>
   </div>
</template>
