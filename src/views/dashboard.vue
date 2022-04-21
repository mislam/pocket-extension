<script setup lang="ts">
import { useStore } from 'vuex'
import Config from '@/modules/config'
import Cache from '@/modules/cache'
import Wallet from '@/modules/wallet'
import { reactive } from 'vue'

const store = useStore()
const balance = reactive({
   available: false,
   pokt: 0,
   usd: 0,
})

const wallet = store.state.selectedWallet

const currency = (value: number): string => {
   return value.toLocaleString(navigator.language, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

Wallet.getBalance(wallet.address).then(
   // success
   (uPokt) => {
      balance.pokt = Number(uPokt / 1e4) / 1e2 // convert uPokt to Pokt with two decimal points
      balance.available = true
      if (balance) {
         Cache.fetch(Config.PRICE_URL, Config.PRICE_TTL).then((data) => {
            balance.usd = balance.pokt * data.price
         })
      }
   },
   // failure
   () => {
      balance.available = false
   },
)
</script>

<template>
   <div class="view">
      <div v-if="balance.available">
         <div class="flex justify-center items-center">
            <span class="text-3xl leading-none">{{ currency(balance.pokt) }}</span>
            <span class="ml-1 leading-none">POKT</span>
         </div>
         <div class="flex justify-center items-center mt-2 text-white/60">
            <span class="leading-none mr-1">≈</span>
            <span class="text-xl leading-none">{{ currency(balance.usd) }}</span>
            <span class="ml-1 text-xs leading-none">USD</span>
         </div>
      </div>
   </div>
</template>