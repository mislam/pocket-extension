import { IsomorphicProvider } from '@pocketjs/provider'
import { KeyManager } from '@pocketjs/signer'
import { sha256 } from '@/modules/encryptor'
import store from '@/modules/store'

const validatePassword = (
   password: string,
   confirmPassword: string,
): { error: string | boolean } => {
   if (password !== confirmPassword) {
      return {
         error: "Passwords don't match",
      }
   }
   if (password.length < 8) {
      return {
         error: 'Password must be at least 8 characters long',
      }
   }
   const regexp = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})')
   if (!regexp.test(password)) {
      return {
         error: 'Password must have at least an uppercase, a lowercase, a number and a special chatacter (i.e. ! @ # $ % ^ & *)',
      }
   }
   return {
      error: false,
   }
}

const createPassword = async (password: string) => {
   const passwordHash = await sha256(password)
   await store.dispatch('setPasswordHash', passwordHash)
   await store.dispatch('unlock')
}

const unlock = async (password: string): Promise<{ error: string | boolean }> => {
   const passwordHash = await sha256(password)
   if (passwordHash !== store.state.passwordHash) {
      return {
         error: 'Incorrect password',
      }
   }
   await store.dispatch('unlock')
   return {
      error: false,
   }
}

const createAccount = async () => {
   return (await KeyManager.createRandom()).getAccount()
}

const getBalance = async (address: string): Promise<BigInt> => {
   const rpcUrl = import.meta.env.VITE_RPC_URL
   const provider = new IsomorphicProvider({ rpcUrl })
   const balance = await provider.getBalance(address)
   return balance
}

export default {
   validatePassword,
   createPassword,
   unlock,
   createAccount,
   getBalance,
}
