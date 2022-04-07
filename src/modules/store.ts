import { createStore } from 'vuex'
import storage from '@/modules/storage'

interface State {
   locked: boolean
   passwordHash: string | null
}

export default createStore<State>({
   state: {
      locked: true,
      passwordHash: null,
   },
   mutations: {
      lock(state, locked) {
         state.locked = locked
      },
      setPasswordHash(state, hash) {
         state.passwordHash = hash
      },
   },
   actions: {
      async init({ commit, state }) {
         await storage.init(state)
         commit('lock', storage.get('locked'))
         commit('setPasswordHash', storage.get('passwordHash'))
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
   },
})
