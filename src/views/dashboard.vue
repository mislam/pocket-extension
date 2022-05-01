<script setup lang="ts">
import { useStore } from 'vuex'
import Config from '@/modules/config'
import Cache from '@/modules/cache'
import Wallet from '@/modules/wallet'
import { reactive, computed, watch, onBeforeUnmount } from 'vue'

const store = useStore()
const balance = reactive({
   available: false,
   uPokt: 0,
   pokt: 0,
   usd: 0,
})

const selectedWallet = computed(() => {
   return store.state.selectedWallet
})

const sendAllowed = computed(() => {
   return balance.uPokt > Config.DEFAULT_BASE_FEE
})

const currency = (value: number): string => {
   return value.toLocaleString(navigator.language, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const getBalance = () => {
   Wallet.getBalance(selectedWallet.value.address).then(
      // success
      (uPokt) => {
         balance.uPokt = uPokt
         balance.pokt = Math.floor(uPokt / 1e4) / 1e2 // convert uPokt to Pokt with two decimal points
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
}

// Initial call to get balance
getBalance()

// Watch for wallet selection changes
const unwatch = watch(selectedWallet, () => {
   getBalance()
})

// Poll balance every `BALANCE_TTL` seconds
const fetchTimer = setInterval(() => {
   getBalance()
}, Config.BALANCE_TTL * 1000)

// Stop the watch and clear timer before unmount
onBeforeUnmount(() => {
   unwatch()
   clearInterval(fetchTimer)
})
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
         <div class="grid grid-cols-2 gap-3 mt-5">
            <router-link to="/deposit" class="btn w-full">Deposit</router-link>
            <button type="button" @click="$router.push('/send-tx')" class="btn w-full" :disabled="!sendAllowed">Send</button>
         </div>
      </div>
   </div>
</template>
