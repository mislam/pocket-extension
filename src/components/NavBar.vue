<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()
const menu = ref(false)

const toggleMenu = () => {
   menu.value = !menu.value
}

const closeMenu = () => {
   menu.value = false
}

const lockWallet = async () => {
   await store.dispatch('lock')
   router.push({ name: 'Login' })
   closeMenu()
}
</script>

<template>
   <div class="flex h-12 bg-slate-900/20">
      <div @click="toggleMenu" class="flex-none w-12 h-12 p-3.5">
         <svg width="20" height="20" viewBox="0 0 20 20" class="fill fill-slate-500 transition-colors hover:cursor-pointer hover:fill-slate-300" xmlns="http://www.w3.org/2000/svg">
            <rect y="3" width="20" height="2" />
            <rect y="15" width="20" height="2" />
            <rect y="9" width="20" height="2" />
         </svg>
      </div>
      <div class="grow flex justify-center items-center text-xl font-semibold text-slate-500">Pocket</div>
      <div class="flex-none w-12 h-12"></div>
   </div>
   <Transition name="slide-fade">
      <div v-if="menu" class="flex absolute top-0 w-full h-full max-w-sm">
         <div class="grow bg-slate-900 h-full">
            <div class="flex h-12 border-b border-b-slate-800">
               <div class="grow flex items-center pl-3.5 text-xl font-semibold text-slate-500">Pocket</div>
               <div @click="closeMenu" class="flex-none w-12 h-12 p-3.5">
                  <svg width="20" height="20" viewBox="0 0 20 20" class="fill fill-slate-500 transition-colors hover:cursor-pointer hover:fill-slate-300" xmlns="http://www.w3.org/2000/svg">
                     <rect x="9" y="0.1" width="2" height="19.8" rx="1" transform="translate(-4.14 10) rotate(-45)" />
                     <rect x="0.1" y="9" width="19.8" height="2" rx="1" transform="translate(-4.14 10) rotate(-45)" />
                  </svg>
               </div>
            </div>
            <div class="p-3.5 text-slate-300 text-lg">
               <div v-if="!store.state.locked" @click="lockWallet" class="flex items-center transition-colors hover:cursor-pointer hover:text-blue-500">
                  <div class="mr-2">
                     <svg width="20" height="20" viewBox="0 0 20 20" class="fill fill-current" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15,8A5,5,0,0,0,5,8H3v9H17V8ZM10,5a3,3,0,0,1,3,3H7A3,3,0,0,1,10,5Z" />
                     </svg>
                  </div>
                  <div>Lock Wallet</div>
               </div>
            </div>
         </div>
         <div @click="closeMenu" class="w-24"></div>
      </div>
   </Transition>
</template>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
   transition: all 0.3s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
   transform: translateX(-100%);
   opacity: 0;
}
</style>
