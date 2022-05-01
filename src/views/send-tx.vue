<script setup lang="ts">
import { ref, computed, onBeforeMount, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import Config from '@/modules/config'
import Wallet from '@/modules/wallet'

const store = useStore()
const router = useRouter()
const toast = useToast()
const address = ref<string>('')
const amount = ref<string>('')
const memo = ref<string>('')
const error = ref<any>(false)
const addressInput = ref<any>(null)

const fee = Config.DEFAULT_BASE_FEE // uPokt
const balance = ref<number>(0) // uPokt

const selectedWallet = computed(() => {
   return store.state.selectedWallet
})

const sendAllowed = computed(() => {
   return balance.value > fee
})

onBeforeMount(async () => {
   await getBalance()
   addressInput.value.focus()
   if (!sendAllowed.value) {
      toast.error("You don't have enough balance to send.", {
         timeout: 3000,
      })
   }
})

const getBalance = async () => {
   await Wallet.getBalance(selectedWallet.value.address).then((upokt) => {
      // convert uPokt to Pokt with two decimal points
      balance.value = upokt
   })
}

const setMaxAmount = () => {
   amount.value = String(Math.floor((balance.value - fee) / 1e4) / 1e2)
}

const validate = () => {
   if (!sendAllowed.value) {
      error.value = "You don't have enough balance to send."
   } else if (!address.value) {
      error.value = "Recipient's address cannot be empty."
   } else if (!new RegExp('^[0-9a-fA-F]{40}$').test(address.value)) {
      error.value = "Recipient's address is invalid."
   } else if (address.value === selectedWallet.value.address) {
      error.value = "Recipient's address must be different than the sender's address."
   } else if (!amount.value) {
      error.value = 'Amount cannot be empty.'
   } else if (isNaN(Number(amount.value))) {
      error.value = 'Amount must be a number.'
   } else if (Number(amount.value) <= 0) {
      error.value = 'Amount must be larger than zero.'
   } else {
      error.value = false
   }
}

const send = () => {
   validate()
   if (error.value) {
      toast.error(error.value, {
         timeout: 3000,
      })
   } else {
      router.push({
         name: '/send-tx-result',
         replace: true,
         params: {
            address: address.value,
            amount: amount.value,
            memo: memo.value,
         },
      })
   }
}
</script>

<template>
   <div class="view flex flex-col">
      <button class="btn-back" @click="$router.back"></button>
      <div class="flex justify-center mb-5 text-heading">Send POKT</div>
      <div class="flex justify-center mb-5">
         <div class="logo-circle small">
            <svg width="48" height="48" viewBox="0 0 48 48" class="fill-blue-500" xmlns="http://www.w3.org/2000/svg">
               <path
                  d="M31,1v9a5.26,5.26,0,0,1-5.27,5.24H22.86c-.24,0-.5,0-.76,0a6.46,6.46,0,0,0-4.24,2.26l-.1.11a7.51,7.51,0,0,0-1.5,4.59v.09a7.87,7.87,0,0,0,.65,3.13,2.3,2.3,0,0,1-.6,2.73L14,30.05a11.58,11.58,0,0,1-2.88-7.69v-.09A11.76,11.76,0,0,1,23.17,10.54h2.5V.07C25.12,0,24.55,0,24,0a24,24,0,0,0-7,47V38.08a5.32,5.32,0,0,1,5.32-5.32h3.56a6.56,6.56,0,0,0,4.24-2.23l.1-.11a7.47,7.47,0,0,0,1.49-4.6v-.08a9.17,9.17,0,0,0-.72-3,2.63,2.63,0,0,1,.76-3c.74-.62,1.5-1.23,2.25-1.84a11.55,11.55,0,0,1,2.87,7.69v.09A11.8,11.8,0,0,1,24.79,37.5H22.3V48c.54,0,1.11,0,1.68,0A24,24,0,0,0,31,1Z"
               />
            </svg>
         </div>
      </div>
      <form class="grow flex flex-col" @submit.prevent="send">
         <input type="text" v-model="address" ref="addressInput" placeholder="Recipient's Address" :disabled="!sendAllowed" />

         <div class="input-group mt-3">
            <input type="text" v-model="amount" placeholder="Amount" :disabled="!sendAllowed" />
            <button type="button" @click="setMaxAmount" class="btn small" :disabled="!sendAllowed">Max</button>
         </div>

         <textarea class="mt-3" rows="2" v-model="memo" maxlength="75" placeholder="Tx Memo (Optional)" :disabled="!sendAllowed"></textarea>
         <div class="grow"></div>
         <div class="grid grid-cols-2 gap-3">
            <button type="button" @click="$router.back" class="btn">Cancel</button>
            <button type="submit" class="btn primary" :disabled="!sendAllowed">Send</button>
         </div>
      </form>
   </div>
</template>
