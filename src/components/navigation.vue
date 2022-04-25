<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import Wallet from '@/modules/wallet'

const store = useStore()
const router = useRouter()
const toast = useToast()
const visible = ref(false)
const menu = ref(false)

const currentRoute = computed(() => {
   return router.currentRoute.value.path
})

const finishedOnboarding = computed(() => {
   // when there is an wallet and the password is also set
   return store.state.wallets.length > 0 && !!store.state.passwordHash
})

const unlocked = computed(() => {
   return !store.state.locked && '/unlock' !== router.currentRoute.value.path
})

const selectedWallet = computed(() => {
   const wallet = store.state.selectedWallet
   return {
      name: wallet.name,
      address: wallet.address,
      shortAddress: wallet.address.slice(0, 3).toUpperCase() + '..' + wallet.address.slice(-3).toUpperCase(),
   }
})

visible.value = unlocked.value
watch(unlocked, (unlocked) => {
   setTimeout(() => {
      visible.value = unlocked
   }, 300)
})

const toggleMenu = () => {
   menu.value = !menu.value
}

const closeMenu = () => {
   menu.value = false
}

const lockWallet = async () => {
   await Wallet.lock()
   router.push('/unlock')
   closeMenu()
}

const goto = (to: string) => {
   if (to !== currentRoute.value) {
      router.push(to)
   }
}

const copyWalletAddress = () => {
   navigator.clipboard.writeText(selectedWallet.value.address)
   toast.success('The wallet address is copied to your clipboard.', {
      timeout: 3000,
   })
}
</script>

<template>
   <div v-if="finishedOnboarding && unlocked">
      <!-- Header -->
      <transition name="slide-up-fade">
         <div v-if="visible" class="flex h-12 bg-slate-900/20">
            <div class="flex-none w-12 h-12">
               <div @click="toggleMenu" class="w-full h-full p-3.5 text-slate-500 hover:cursor-pointer hover:text-slate-300">
                  <svg width="20" height="20" viewBox="0 0 20 20" class="fill-current transition-colors" xmlns="http://www.w3.org/2000/svg">
                     <rect y="3" width="20" height="2" />
                     <rect y="15" width="20" height="2" />
                     <rect y="9" width="20" height="2" />
                  </svg>
               </div>
            </div>
            <div class="grow flex justify-center items-center">
               <div class="text-white/90 whitespace-nowrap">{{ selectedWallet.name }}</div>
               <div @click="copyWalletAddress" class="text-white/60 pl-2 font-mono cursor-pointer hover:text-blue-400">({{ selectedWallet.shortAddress }})</div>
            </div>
            <div class="flex-none w-12 h-12"></div>
         </div>
      </transition>
      <!-- Footer -->
      <transition name="slide-down-fade">
         <ul v-if="visible" class="tabs">
            <li @click="goto('/dashboard')" :class="{ active: '/dashboard' === currentRoute }">
               <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path
                     d="M12,0A12,12,0,1,0,24,12,12,12,0,0,0,12,0Zm1.08,17.56V20H11.13V17.61a7.51,7.51,0,0,1-3.4-1.24.57.57,0,0,1-.14-.77l.7-1.08a.58.58,0,0,1,.78-.18,6.17,6.17,0,0,0,3.13,1c1,0,1.48-.34,1.48-.92,0-1.67-5.84-1.37-5.84-5.06,0-1.72,1.26-2.92,3.29-3.24V4h1.95V6.07a5.35,5.35,0,0,1,2.8,1.24.57.57,0,0,1,0,.8L15.16,9a.57.57,0,0,1-.75.1,4.08,4.08,0,0,0-2.36-.72c-.89,0-1.39.33-1.39.91,0,1.43,5.84,1.25,5.84,4.9C16.5,15.85,15.29,17.18,13.08,17.56Z"
                  />
               </svg>
            </li>
            <li @click="goto('/history')" :class="{ active: '/history' === currentRoute }">
               <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12,0A12,12,0,0,0,1.31,6.57l4-.52A9,9,0,1,1,3,12s0-.08,0-.11l-3,.39A12,12,0,1,0,12,0Z" />
                  <polygon points="3.11 2.35 7.03 5.78 1.89 7.49 3.11 2.35" />
                  <path d="M3.7,4.19,5.06,5.38,3.28,6,3.7,4.19M2.52.5.5,9,9,6.18,2.52.5Z" />
                  <path d="M12,4.5a7.61,7.61,0,0,0-1.66.19L12.94,7,9.63,8.07,4.89,9.65A7.33,7.33,0,0,0,4.5,12,7.5,7.5,0,1,0,12,4.5Zm1,8V17H11V11.62h0l3.86-3.86,1.41,1.42Z" />
               </svg>
            </li>
            <li @click="goto('/settings')" :class="{ active: '/settings' === currentRoute }">
               <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path
                     d="M22.8,9.53l-2.26-.36A8.55,8.55,0,0,0,20,8l1.35-1.85a1.22,1.22,0,0,0,0-1.7l-1.8-1.8a1.22,1.22,0,0,0-1.7,0L16,4a8.55,8.55,0,0,0-1.21-.5L14.47,1.2A1.2,1.2,0,0,0,13.27,0H10.73a1.2,1.2,0,0,0-1.2,1.2L9.17,3.46A8.55,8.55,0,0,0,8,4L6.11,2.61a1.22,1.22,0,0,0-1.7,0l-1.8,1.8a1.22,1.22,0,0,0,0,1.7L4,8a8.55,8.55,0,0,0-.5,1.21L1.2,9.53A1.2,1.2,0,0,0,0,10.73v2.54a1.2,1.2,0,0,0,1.2,1.2l2.26.36A8.55,8.55,0,0,0,4,16L2.61,17.89a1.22,1.22,0,0,0,0,1.7l1.8,1.8a1.22,1.22,0,0,0,1.7,0L8,20a8.55,8.55,0,0,0,1.21.5l.36,2.26a1.2,1.2,0,0,0,1.2,1.2h2.54a1.2,1.2,0,0,0,1.2-1.2l.36-2.26a10.06,10.06,0,0,0,1.22-.5l1.86,1.35a1.22,1.22,0,0,0,1.7,0l1.79-1.8a1.2,1.2,0,0,0,0-1.7L20.05,16a8.26,8.26,0,0,0,.49-1.19l2.26-.36a1.2,1.2,0,0,0,1.2-1.2V10.73A1.2,1.2,0,0,0,22.8,9.53ZM16.5,12A4.5,4.5,0,1,1,12,7.5,4.49,4.49,0,0,1,16.5,12Z"
                  />
               </svg>
            </li>
         </ul>
      </transition>
      <!-- Sidebar -->
      <transition name="slide-fade">
         <div v-if="menu" class="flex absolute z-10 top-0 w-full h-full max-w-sm">
            <div class="grow bg-slate-900 h-full">
               <div class="flex h-12 border-b border-b-slate-800">
                  <div class="grow flex items-center pl-3.5 text-xl font-semibold text-slate-500">Pocket</div>
                  <div @click="closeMenu" class="flex-none w-12 h-12 p-3.5 text-slate-500 hover:cursor-pointer hover:text-slate-300">
                     <div>
                        <svg width="20" height="20" viewBox="0 0 20 20" class="fill-current transition-colors" xmlns="http://www.w3.org/2000/svg">
                           <rect x="9" y="0.1" width="2" height="19.8" rx="1" transform="translate(-4.14 10) rotate(-45)" />
                           <rect x="0.1" y="9" width="19.8" height="2" rx="1" transform="translate(-4.14 10) rotate(-45)" />
                        </svg>
                     </div>
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
      </transition>
   </div>
</template>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active,
.slide-up-fade-enter-active,
.slide-up-fade-leave-active,
.slide-down-fade-enter-active,
.slide-down-fade-leave-active {
   transition: all 0.3s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
   transform: translateX(-100%);
   opacity: 0;
}
.slide-up-fade-enter-from,
.slide-up-fade-leave-to {
   transform: translateY(-100%);
   opacity: 0;
}
.slide-down-fade-enter-from,
.slide-down-fade-leave-to {
   transform: translateY(100%);
   opacity: 0;
}
</style>
