<script setup lang="ts">
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useToast } from 'vue-toastification'
import Wallet from '@/modules/wallet'

// Get the encrypted password sent from unlock screen
const props = defineProps({ ep: String })
const encryptedPassword = props.ep || ''

const store = useStore()
const toast = useToast()
const privateKey = ref<string>('')
const error = ref<boolean | string>(false)
const copyButtonText = ref<string>('Copy')

if (encryptedPassword) {
   Wallet.getPrivateKey(encryptedPassword, store.state.selectedWallet).then((derivedPrivateKey) => {
      if (derivedPrivateKey) {
         privateKey.value = derivedPrivateKey
         error.value = false
      } else {
         privateKey.value = ''
         error.value = 'Oops! Your wallet appears to be corrupted or invalid.'
      }
   })
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
      <div v-if="!error">
         <div class="alert warning mb-5">
            <p>Never disclose your private key! Anyone with your private key can fully control your wallet, including transfering away your funds.</p>
         </div>
         <div class="relative">
            <textarea class="block w-full font-mono" rows="5" v-model="privateKey" disabled></textarea>
            <div class="absolute bottom-2 right-2">
               <button type="button" @click="copy" class="btn small oval primary">{{ copyButtonText }}</button>
            </div>
         </div>
      </div>
      <div v-else class="alert danger mb-5">
         <p>{{ error }}</p>
      </div>
      <button type="button" @click="$router.back" class="btn mt-5">Close</button>
   </div>
</template>
