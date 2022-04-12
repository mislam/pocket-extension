import { createStore } from 'vuex'
import storage from '@/modules/storage'

interface Wallet {
   name: string // A meaningful name set by the user
   address: string // Wallet address
   encryptedPrivateKey: string // Encrypted private key with the hash of the user defined password
}

interface State {
   locked: boolean
   passwordHash: string
   wallets: Wallet[]
   selectedWallet?: Wallet
}

export default createStore<State>({
   state: {
      locked: true,
      passwordHash: '', // SHA-256 hash of the password
      wallets: [],
   },
   mutations: {
      lock(state, locked) {
         state.locked = locked
      },
      setPasswordHash(state, hash) {
         state.passwordHash = hash
      },
      setWallets(state, wallets) {
         state.wallets = wallets
      },
      setSelectedWallet(state, wallet) {
         state.selectedWallet = wallet
      },
   },
   actions: {
      async init({ commit, state }) {
         await storage.init(state)
         commit('lock', storage.get('locked'))
         commit('setPasswordHash', storage.get('passwordHash'))
         commit('setWallets', storage.get('wallets'))
         commit('setSelectedWallet', storage.get('selectedWallet'))
      },
      async lock({ commit }) {
         commit('lock', true)
         await storage.set('locked', true)
      },
      async unlock({ commit }) {
         commit('lock', false)
         await storage.set('locked', false)
      },
      async setPasswordHash({ commit }, hash) {
         commit('setPasswordHash', hash)
         await storage.set('passwordHash', hash)
      },
      async addWallet({ commit, state }, wallet: Wallet) {
         const wallets = JSON.parse(JSON.stringify(state.wallets)) // clone
         wallets.push(wallet)
         wallet.name = `Wallet ${wallets.length}`
         commit('setWallets', wallets)
         commit('setSelectedWallet', wallet)
         await storage.set('wallets', wallets)
         await storage.set('selectedWallet', wallet)
      },
   },
})
