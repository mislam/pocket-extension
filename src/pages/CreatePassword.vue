<script setup>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import sha256 from 'crypto-js/sha256'

const store = useStore()
const router = useRouter()
const pwinput = ref(null)
const pwconfirm = ref(null)

onMounted(() => {
   // autofocus on the input field
   pwinput.value.focus()
})

const create = async () => {
   const passwordInput = pwinput.value.value
   if (pwinput.value.value !== pwconfirm.value.value) {
      return false
   }
   const passwordHash = sha256(passwordInput).toString()
   await store.dispatch('setPasswordHash', passwordHash)
   await store.dispatch('unlock')
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
         <button class="w-full mt-5">Create</button>
      </form>
   </div>
</template>
