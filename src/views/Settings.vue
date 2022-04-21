<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const selectedWallet = computed(() => {
   const wallet = store.state.selectedWallet
   return {
      name: wallet.name,
      shortAddress: wallet.address.slice(0, 4).toUpperCase() + '...' + wallet.address.slice(-4).toUpperCase(),
   }
})
</script>

<template>
   <div class="view">
      <div class="mb-5">
         <label class="block mb-1">Change Wallet Name</label>
         <input class="block w-full text-2xl" type="text" v-model="selectedWallet.name" />
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
         <button class="primary w-full">Export Private Key</button>
         <button class="danger w-full">Remove Wallet</button>
      </div>
   </div>
</template>
