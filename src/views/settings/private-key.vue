<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { useToast } from 'vue-toastification'
import Wallet from '@/modules/wallet'

// Get the encrypted password sent from unlock screen
const props = defineProps({ ep: String })
const encryptedPassword = props.ep || ''

const store = useStore()
const toast = useToast()
const privateKey = ref<string>('')
const error = ref<boolean>(false)

onBeforeMount(async () => {
   await getPrivateKey()
})

const getPrivateKey = async () => {
   if (!encryptedPassword) return
   const derivedPrivateKey = await Wallet.getPrivateKey(encryptedPassword, store.state.selectedWallet)
   if (derivedPrivateKey) {
      privateKey.value = derivedPrivateKey
      error.value = false
   } else {
      privateKey.value = ''
      error.value = true
      toast.error('Oops! Your wallet appears to be corrupted or invalid.', {
         timeout: 5000,
      })
   }
}

const copy = () => {
   navigator.clipboard.writeText(privateKey.value)
   toast.success('The private key is copied to your clipboard.', {
      timeout: 3000,
   })
}
</script>

<template>
   <div class="view">
      <button class="btn-back" @click="$router.back"></button>
      <div class="flex justify-center mb-5 text-heading">Private Key</div>
      <div v-if="!error">
         <div class="alert warning mb-5">
            <p class="text-sm">Never disclose your private key! Anyone with your private key can fully control your wallet, including transferring your funds.</p>
         </div>
         <div class="relative">
            <textarea class="block w-full font-mono text-base" rows="5" v-model="privateKey" disabled></textarea>
            <div class="absolute bottom-1 right-1 bg-slate-900/90 p-2 rounded-full">
               <button type="button" @click="copy" class="btn small oval primary">Copy</button>
            </div>
         </div>
      </div>
      <div class="grow"></div>
      <button type="button" @click="$router.back" class="btn mt-5">Close</button>
   </div>
</template>
