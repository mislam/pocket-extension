<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const selectedWallet = computed(() => {
   return store.state.selectedWallet
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
         <router-link to="/settings/private-key" class="btn primary w-full">Reveal Private Key</router-link>
         <router-link to="/settings/remove-wallet" class="btn danger w-full">Remove Wallet</router-link>
      </div>
   </div>
</template>
