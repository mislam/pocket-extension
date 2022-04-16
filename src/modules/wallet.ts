import { IsomorphicProvider } from '@pocketjs/provider'
import { KeyManager } from '@pocketjs/signer'
import { decrypt, encrypt, sha256 } from '@/modules/encryptor'
import store from '@/modules/store'

const encryptionPassword = await sha256(import.meta.env.VITE_STORAGE_ENCRYPTION_KEY)
interface Wallet {
   address: string
   publicKey: string
   privateKey: string
}

const validatePassword = (
   password: string,
   confirmPassword: string,
): { error: string | boolean } => {
   if (password.length === 0) {
      return {
         error: 'Password cannot be empty.',
      }
   }
   if (confirmPassword.length === 0) {
      return {
         error: 'Please re-enter your password to confirm.',
      }
   }
   if (password !== confirmPassword) {
      return {
         error: 'Make sure you enter the same password in both fields.',
      }
   }
   if (password.length < 8) {
      return {
         error: 'Please set a longer password that is at least eight characters or more.',
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
   store.commit('setEncryptedPassword', await encrypt(encryptionPassword, password))
   await store.dispatch('setPasswordHash', passwordHash)
   await store.dispatch('unlock')
}

const lock = async () => {
   store.commit('setEncryptedPassword', '')
   await store.dispatch('lock')
}

const unlock = async (password: string): Promise<{ error: string | boolean }> => {
   if (!password.length) {
      // if password is empty
      return {
         error: 'Please enter the password',
      }
   }
   const passwordHash = await sha256(password)
   if (passwordHash !== store.state.passwordHash) {
      return {
         error: 'Incorrect password',
      }
   }
   store.commit('setEncryptedPassword', await encrypt(encryptionPassword, password))
   await store.dispatch('unlock')
   return {
      error: false,
   }
}

const createNew = async () => {
   const wallet = (await KeyManager.createRandom()).getAccount()
   if (!validateWallet(wallet)) {
      throw new Error('Could not create a new wallet')
   }
   if (walletExist(wallet)) {
      throw new Error('You already have this wallet')
   }
   if (!(await storeEncryptedWallet(wallet))) {
      throw new Error('Could not store wallet')
   }
}

const importFromPrivateKey = async (privateKey: string) => {
   const wallet = (await KeyManager.fromPrivateKey(privateKey)).getAccount()
   if (!validateWallet(wallet)) {
      throw new Error('You entered an invalid private key.')
   }
   if (walletExist(wallet)) {
      throw new Error('You already have this wallet.')
   }
   if (!(await storeEncryptedWallet(wallet))) {
      throw new Error('Could not store wallet')
   }
}

const validateWallet = (wallet: Wallet) => {
   return (
      wallet.address.length === 40 &&
      wallet.publicKey.length === 64 &&
      wallet.privateKey.length === 128
   )
}

const walletExist = (wallet: Wallet) => {
   for (const storedWallet of store.state.wallets) {
      if (wallet.address === storedWallet.address) {
         return true
      }
   }
   return false
}

/**
 * Encrypt the private key with the user defined password
 * and store the wallet with its address and the encrypted private key.
 * @param {Wallet} wallet
 */
const storeEncryptedWallet = async (wallet: Wallet): Promise<boolean> => {
   if (!store.state.encryptedPassword) {
      return false
   }
   const password: string = await decrypt(encryptionPassword, store.state.encryptedPassword)
   await store.dispatch('addWallet', {
      address: wallet.address,
      encryptedPrivateKey: await encrypt(password, wallet.privateKey),
   })
   return true
}

const getBalance = async (address: string): Promise<bigint> => {
   const rpcUrl = import.meta.env.VITE_RPC_URL
   const provider = new IsomorphicProvider({ rpcUrl })
   const balance = await provider.getBalance(address)
   return balance
}

export default {
   validatePassword,
   createPassword,
   lock,
   unlock,
   createNew,
   importFromPrivateKey,
   getBalance,
}
