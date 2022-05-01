<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useToast } from 'vue-toastification'
import Wallet from '@/modules/wallet'

const store = useStore()
const toast = useToast()
const walletName = ref<string>(store.state.selectedWallet.name)
const walletNamePreview: any = ref(null)

const selectedWallet = computed(() => {
   return store.state.selectedWallet
})

const walletNameIsEdited = computed(() => {
   return walletName.value && walletName.value !== selectedWallet.value.name
})

// limit wallet name length to be 140px at max
const limitWalletName = () => {
   const width = walletNamePreview.value.offsetWidth
   if (width > 140) {
      walletName.value = walletName.value.slice(0, -1)
   }
}

const changeWalletName = async () => {
   await Wallet.changeName(selectedWallet.value.address, walletName.value)
   toast.success('Wallet name changed successfully!', {
      timeout: 2000,
   })
}
</script>

<template>
   <div class="view">
      <div class="mb-5">
         <label class="block mb-1">Change Wallet Name</label>
         <form @submit.prevent="changeWalletName">
            <div class="input-group">
               <input type="text" v-model="walletName" @keyup="limitWalletName" />
               <button type="submit" class="btn small primary" :disabled="!walletNameIsEdited">Change</button>
            </div>
         </form>
         <span ref="walletNamePreview" class="absolute text-transparent -z-10 whitespace-nowrap">{{ walletName }}</span>
      </div>
      <div class="pills">
         <router-link to="/settings/change-password">
            <dl>
               <dt>Change Password</dt>
               <dd>Change your lock screen password</dd>
            </dl>
         </router-link>
         <router-link to="/settings/change-network">
            <dl>
               <dt>Change Network</dt>
               <dd>Configure your network settings</dd>
            </dl>
         </router-link>
      </div>
      <div class="mt-5 grid gap-3">
         <router-link to="/settings/private-key" class="btn primary">Show Private Key</router-link>
         <!-- <router-link to="/settings/remove-wallet" class="btn danger">Remove Wallet</router-link> -->
      </div>
   </div>
</template>
