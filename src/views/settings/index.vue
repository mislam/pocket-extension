<script setup lang="ts">
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useToast } from 'vue-toastification'
import Wallet from '@/modules/wallet'

const store = useStore()
const toast = useToast()
const walletName = ref<string>(store.state.selectedWallet.name)

const selectedWallet = computed(() => {
   return store.state.selectedWallet
})

const walletNameIsEdited = computed(() => {
   return walletName.value && walletName.value !== selectedWallet.value.name
})

const changeWalletName = async () => {
   await Wallet.changeName(selectedWallet.value.address, walletName.value)
   toast.success('Wallet name changed successfully!', {
      timeout: 3000,
   })
}
</script>

<template>
   <div class="view">
      <div class="mb-5">
         <label class="block mb-1">Change Wallet Name</label>
         <form class="grow flex bg-slate-900 rounded-md p-1 pl-0" @submit.prevent="changeWalletName">
            <input class="grow text-xl" type="text" v-model="walletName" />
            <button type="submit" class="btn small primary" :disabled="!walletNameIsEdited">Change</button>
         </form>
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
         <router-link to="/settings/private-key" class="btn primary w-full">Show Private Key</router-link>
         <router-link to="/settings/remove-wallet" class="btn danger w-full">Remove Wallet</router-link>
      </div>
   </div>
</template>
