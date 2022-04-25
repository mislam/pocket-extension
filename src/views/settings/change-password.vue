<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import Wallet from '@/modules/wallet'

const router = useRouter()
const toast = useToast()
const currentPassword = ref<string>('')
const newPassword = ref<string>('')
const confirmPassword = ref<string>('')
const passwordInput = ref<any>(null)
const verifyError = ref<boolean | string>(false)
const changeError = ref<boolean | string>(false)

onMounted(() => {
   // autofocus on the input field
   passwordInput.value.focus()
})

const change = async () => {
   // Verify the current password
   const verify = await Wallet.verifyPassword(currentPassword.value)
   verifyError.value = verify.error
   if (verify.error) {
      passwordInput.value.focus() // focus on the input
      passwordInput.value.select() // and select the text
      return
   }
   // Validate new password
   const validation = Wallet.validatePassword(newPassword.value, confirmPassword.value)
   changeError.value = validation.error
   if (validation.error) {
      return
   }
   // If the current and new password are identical
   if (currentPassword.value === newPassword.value) {
      changeError.value = 'Your new password must be different than your current password.'
      return
   }
   // Change password
   await Wallet.changePassword(currentPassword.value, newPassword.value)
   await Wallet.lock()
   toast.success('Password changed successfully! Now you can use the new password to unlock your wallet.', {
      timeout: 5000,
   })
   router.push('/unlock')
}
</script>

<template>
   <div class="view flex flex-col">
      <div class="flex justify-center mb-5 text-heading">Change Password</div>
      <form class="grow flex flex-col" @submit.prevent="change">
         <input class="hidden" type="text" autocomplete="username" />
         <div class="mb-3">
            <input class="block w-full" :class="{ 'form-error-input': verifyError }" type="password" v-model="currentPassword" ref="passwordInput" placeholder="Current Password" autocomplete="" />
         </div>
         <div class="mb-3">
            <input class="block w-full" type="password" v-model="newPassword" placeholder="New Password" autocomplete="new-password" />
         </div>
         <div>
            <input class="block w-full" type="password" v-model="confirmPassword" placeholder="Confirm New Password" autocomplete="new-password" />
         </div>
         <div v-if="verifyError || changeError" class="mt-3 form-error-message">{{ verifyError || changeError }}</div>
         <div class="grow"></div>
         <div class="grid grid-cols-2 gap-3">
            <router-link to="/settings" class="btn block">Cancel</router-link>
            <button type="submit" class="btn primary w-full" :disabled="!currentPassword || !newPassword || !confirmPassword">Change</button>
         </div>
      </form>
   </div>
</template>
