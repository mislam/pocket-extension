<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import wallet from '@/modules/wallet'

const router = useRouter()
const pwinput = ref<any>(null)
const error = ref<any>(false)

onMounted(() => {
   // autofocus on the input field
   pwinput.value.focus()
})

const unlock = async () => {
   const unlock = await wallet.unlock(pwinput.value.value)
   error.value = unlock.error
   if (unlock.error) {
      return
   }
   pwinput.value.value = '' // clear password field
   router.push({ name: 'Dashboard' })
}
</script>

<template>
   <div class="m-5">
      <div class="flex justify-center mb-5 text-xl leading-none">Enter Password to Unlock</div>
      <form @submit.prevent="unlock">
         <div><input class="block w-full" type="password" ref="pwinput" /></div>
         <div v-if="error" class="mt-3 error">{{ error }}</div>
         <button class="block w-full mt-5">Unlock</button>
      </form>
   </div>
</template>

<style scoped>
.error {
   @apply text-red-500;
}
</style>
