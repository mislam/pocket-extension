<script setup lang="ts">
import { ref, reactive, onBeforeMount } from 'vue'
import { useToast } from 'vue-toastification'
import Config from '@/modules/config'
import Wallet from '@/modules/wallet'

const toast = useToast()

const status = reactive({
   available: false,
   error: '',
   success: '',
   txHash: '',
})

const props = defineProps({
   ep: String,
   address: String,
   amount: String,
   memo: String,
})
const encryptedPassword = props.ep || ''
const address = props.address || ''
const amount = props.amount || ''
const memo = props.memo || ''
const shortAddress = address.slice(0, 3).toUpperCase() + '..' + address.slice(-3).toUpperCase()

onBeforeMount(async () => {
   await sendTx()
})

const sendTx = async () => {
   if (!encryptedPassword) return
   const send = await Wallet.send(encryptedPassword, address, amount, memo)
   if (send.error) {
      status.error = send.error
   } else {
      status.success = `Your request has been submitted. It takes approximately ${Config.TX_CONF_ETA} minutes to be confirmed on the next block.`
      status.txHash = send.response.txHash
   }
   status.available = true
}

const copyTxHash = () => {
   navigator.clipboard.writeText(status.txHash)
   toast.success('The transaction hash is copied to your clipboard.', {
      timeout: 3000,
   })
}

const copyAddress = () => {
   navigator.clipboard.writeText(address)
   toast.success("Recipient's address is copied to your clipboard.", {
      timeout: 3000,
   })
}
</script>

<template>
   <div class="view flex flex-col text-sm">
      <div v-if="status.available && status.error" class="alert danger">{{ status.error }}</div>
      <div v-if="status.available && status.success">
         <div class="alert success">{{ status.success }}</div>
         <div class="mt-4">
            <label>Transaction Hash</label>
            <div class="input-group">
               <input type="text" v-model="status.txHash" disabled />
               <button type="button" @click="copyTxHash" class="btn small">Copy</button>
            </div>
            <table class="table-auto mt-4 leading-relaxed">
               <tbody>
                  <tr>
                     <td class="pr-5 text-white/60">Status</td>
                     <td>Pending</td>
                  </tr>
                  <tr>
                     <td class="pr-5 text-white/60">Recipient</td>
                     <td>
                        <span class="font-mono">{{ shortAddress }}</span>
                        <button type="button" @click="copyAddress" class="btn small ml-2 -translate-y-px">Copy</button>
                     </td>
                  </tr>
                  <tr>
                     <td class="pr-5 text-white/60">Amount</td>
                     <td>{{ amount }} POKT</td>
                  </tr>
                  <tr>
                     <td class="pr-5 text-white/60 align-top">Tx Memo</td>
                     <td class="leading-normal">{{ memo }}</td>
                  </tr>
               </tbody>
            </table>
         </div>
      </div>
      <div class="grow"></div>
      <button type="button" @click="$router.back" class="btn">Close</button>
   </div>
</template>
