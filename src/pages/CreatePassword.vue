<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import wallet from '@/modules/wallet'

const router = useRouter()
const pwinput = ref(null)
const pwconfirm = ref(null)
const error = ref(false)

onMounted(() => {
   // autofocus on the input field
   pwinput.value.focus()
})

const create = async () => {
   const validation = wallet.validatePassword(pwinput.value.value, pwconfirm.value.value)
   error.value = validation.error
   if (validation.error) {
      return
   }
   await wallet.createPassword(pwinput.value.value)
   router.push({ name: 'Dashboard' })
}
</script>

<template>
   <div class="m-5">
      <div class="flex justify-center mb-5 text-xl leading-none">Create Password</div>
      <form @submit.prevent="create">
         <div class="mb-3">
            <label class="block mb-1">New Password</label>
            <input class="block w-full" type="password" ref="pwinput" />
         </div>
         <div>
            <label class="block mb-1">Confirm Password</label>
            <input class="block w-full" type="password" ref="pwconfirm" />
         </div>
         <div v-if="error" class="mt-3 error">{{ error }}</div>
         <button class="w-full mt-5">Create</button>
      </form>
   </div>
</template>

<style scoped>
.error {
   @apply text-red-500;
}
</style>
