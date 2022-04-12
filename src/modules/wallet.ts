import { IsomorphicProvider } from '@pocketjs/provider'
import { KeyManager } from '@pocketjs/signer'
import { encrypt, sha256 } from '@/modules/encryptor'
import store from '@/modules/store'

interface Wallet {
   address: string
   publicKey: string
   privateKey: string
}

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
   await storeEncryptedWallet(wallet)
}

const importFromPrivateKey = async (privateKey: string) => {
   const wallet = (await KeyManager.fromPrivateKey(privateKey)).getAccount()
   if (!validateWallet(wallet)) {
      throw new Error('You entered an invalid private key')
   }
   if (walletExist(wallet)) {
      throw new Error('You already have this wallet')
   }
   await storeEncryptedWallet(wallet)
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
 * Encrypt the private key with the hash of the user defined password
 * and store the wallet with its address and the encrypted private key.
 * @param {Wallet} wallet
 */
const storeEncryptedWallet = async (wallet: Wallet) => {
   await store.dispatch('addWallet', {
      address: wallet.address,
      encryptedPrivateKey: await encrypt(store.state.passwordHash, wallet.privateKey),
   })
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
   createNew,
   importFromPrivateKey,
   getBalance,
}
