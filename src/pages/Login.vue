<script setup>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import sha256 from 'crypto-js/sha256'

const store = useStore()
const router = useRouter()
const pwinput = ref(null)

onMounted(() => {
   // autofocus on the input field
   pwinput.value.focus()
})

const login = async () => {
   const passwordInput = pwinput.value.value
   pwinput.value.value = '' // clear password field
   const passwordHash = sha256(passwordInput).toString()
   if (passwordHash === store.state.passwordHash) {
      await store.dispatch('unlock')
      router.push({ name: 'Dashboard' })
   }
}
</script>

<template>
   <div class="m-5">
      <div class="flex justify-center mb-5 text-xl leading-none">Enter Password to Unlock</div>
      <form @submit.prevent="login">
         <div><input class="block w-full" type="password" ref="pwinput" /></div>
         <button class="block w-full mt-5">Unlock</button>
      </form>
   </div>
</template>
