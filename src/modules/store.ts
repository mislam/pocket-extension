import { createStore } from 'vuex'
import Storage from '@/modules/storage'

interface Wallet {
   name: string // A meaningful name set by the user
   address: string // Wallet address
   encryptedPrivateKey: string // Private key is encrypted with the user defined password
}

interface State {
   locked: boolean
   encryptedPassword?: string
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
      setEncryptedPassword(state, encryptedPassword) {
         state.encryptedPassword = encryptedPassword
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
         await Storage.init(state)
         commit('lock', Storage.get('locked'))
         commit('setPasswordHash', Storage.get('passwordHash'))
         commit('setWallets', Storage.get('wallets'))
         commit('setSelectedWallet', Storage.get('selectedWallet'))
      },
      async lock({ commit }) {
         commit('lock', true)
         await Storage.set('locked', true)
      },
      async unlock({ commit }) {
         commit('lock', false)
         await Storage.set('locked', false)
      },
      async setPasswordHash({ commit }, hash) {
         commit('setPasswordHash', hash)
         await Storage.set('passwordHash', hash)
      },
      async addWallet({ commit, state }, wallet: Wallet) {
         const wallets = JSON.parse(JSON.stringify(state.wallets)) // clone
         wallets.push(wallet)
         wallet.name = `Wallet ${wallets.length}`
         commit('setWallets', wallets)
         commit('setSelectedWallet', wallet)
         await Storage.set('wallets', wallets)
         await Storage.set('selectedWallet', wallet)
      },
   },
})
