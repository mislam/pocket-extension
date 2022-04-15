<script setup lang="ts">
import { useStore } from 'vuex'
import Wallet from '@/modules/wallet'
import { reactive } from 'vue'

const store = useStore()
const balance = reactive({
   pokt: 0,
   usd: 0,
})

const wallet = store.state.selectedWallet

const currency = (value: number): string => {
   return value.toLocaleString(navigator.language, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

Wallet.getBalance(wallet.address).then((uPokt: bigint) => {
   balance.pokt = Number(uPokt / BigInt(10000)) / 100
   if (balance.pokt) {
      fetch(import.meta.env.VITE_PRICE_URL).then(async (response) => {
         const price = (await response.json()).price
         balance.usd = balance.pokt * price
      })
   }
})
</script>

<template>
   <div class="view">
      <div>
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
