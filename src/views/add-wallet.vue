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

const createWallet = async () => {
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
   <div class="view flex flex-col">
      <!-- Create -->
      <div class="grow flex flex-col" v-if="'create' === method">
         <div class="flex justify-center mb-5 text-heading">Add Wallet</div>
         <div class="pills">
            <div @click="createWallet">
               <dl>
                  <dt>Create a new wallet</dt>
                  <dd>Generate a new wallet with fresh start</dd>
               </dl>
            </div>
            <div @click="switchMethod('import')">
               <dl>
                  <dt>Import an existing wallet</dt>
                  <dd>Import an wallet with your private key</dd>
               </dl>
            </div>
         </div>
         <div v-if="error" class="mt-3 form-error-message">{{ error }}</div>
         <div class="grow"></div>
         <button type="button" @click="$router.back" class="btn mt-5">Close</button>
      </div>
      <!-- Import -->
      <div class="grow flex flex-col" v-if="'import' === method">
         <div class="flex justify-center mb-3 text-heading">Import Your Wallet</div>
         <div class="flex justify-center mb-5 text-subheading text-center">Import an existing wallet with your 128-digit private key.</div>
         <form class="grow flex flex-col" @submit.prevent="importWallet">
            <textarea class="font-mono" rows="5" v-model="privateKeyInput" placeholder="Enter your private key"></textarea>
            <div v-if="error" class="mt-3 form-error-message">{{ error }}</div>
            <div class="grow"></div>
            <div class="grid grid-cols-2 gap-3">
               <button type="button" @click="switchMethod('create')" class="btn">Go Back</button>
               <button type="submit" class="btn primary" :disabled="!privateKeyInput.length">Import Wallet</button>
            </div>
         </form>
      </div>
   </div>
</template>
