<script setup lang="ts">
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useToast } from 'vue-toastification'
import capitalize from 'lodash.capitalize'
import Config from '@/modules/config'

const store = useStore()
const toast = useToast()
const mainnetUrl = new URL(Config.MAINNET_RPC_URL).origin
const testnetUrl = new URL(Config.TESTNET_RPC_URL).origin
const selectedNetwork = ref<string>(store.state.network)

const selected = (network: string) => {
   return selectedNetwork.value === network
}

const select = async (network: string) => {
   if (selectedNetwork.value !== network) {
      selectedNetwork.value = network
      await store.dispatch('setNetwork', network)
      toast.info(`Network changed to ${capitalize(network)}.`, {
         timeout: 2000,
      })
   }
}
</script>

<template>
   <div class="view">
      <button class="btn-back" @click="$router.back"></button>
      <div class="flex justify-center mb-5 text-heading">Change Network</div>
      <div class="pills">
         <div @click="select('mainnet')" :class="{ selected: selected('mainnet') }">
            <dl>
               <dt>Mainnet</dt>
               <dd>{{ mainnetUrl }}</dd>
            </dl>
         </div>
         <div @click="select('testnet')" :class="{ selected: selected('testnet') }">
            <dl>
               <dt>Testnet</dt>
               <dd>{{ testnetUrl }}</dd>
            </dl>
         </div>
      </div>
      <div class="grow"></div>
      <button type="button" @click="$router.back" class="btn">Close</button>
   </div>
</template>
