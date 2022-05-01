<script setup lang="ts">
import QRCode from 'qrcode-generator'
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useToast } from 'vue-toastification'

const store = useStore()
const toast = useToast()
const address = store.state.selectedWallet.address
const svg = ref<string>('')

const generateQRCode = () => {
   const qrcode = QRCode(0, 'L')
   qrcode.addData(address)
   qrcode.make()
   svg.value = qrcode.createSvgTag(5, 0)
}

const copy = () => {
   navigator.clipboard.writeText(address)
   toast.success('Your wallet address is copied to your clipboard.', {
      timeout: 3000,
   })
}

generateQRCode()
</script>

<template>
   <div class="view flex flex-col">
      <div class="flex justify-center mb-3 text-heading">Deposit POKT</div>
      <div class="flex justify-center mb-5 text-subheading text-center">Scan or copy your wallet address.</div>
      <div class="flex justify-center">
         <div class="bg-white p-2 rounded-md" ref="qrcode" v-html="svg"></div>
      </div>
      <div class="input-group mt-5">
         <input type="text" v-model="address" disabled />
         <button type="button" @click="copy" class="btn small">Copy</button>
      </div>
      <div class="grow"></div>
      <button type="button" @click="$router.back" class="btn">Close</button>
   </div>
</template>
