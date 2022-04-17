import { IsomorphicProvider } from '@pocketjs/provider'
import { KeyManager } from '@pocketjs/signer'
import Config from '@/modules/config'
import Cache from '@/modules/cache'
import { decrypt, encrypt, sha256 } from '@/modules/encryptor'
import store from '@/modules/store'

let encryptionPassword = ''

interface Wallet {
   address: string
   publicKey: string
   privateKey: string
}

const init = async () => {
   encryptionPassword = await sha256(Config.STORAGE_ENCRYPTION_KEY)
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

const getBalance = async (address: string): Promise<number> => {
   const rpcUrl = Config.RPC_URL
   const provider = new IsomorphicProvider({ rpcUrl })
   const balance = Cache.get(`balance:${address}`)
   if (balance !== undefined) return balance
   return provider.getBalance(address).then(
      async (bigBalance) => {
         const balance = Number(bigBalance) // convert bigint to number
         await Cache.set(`balance:${address}`, balance, Config.BALANCE_TTL)
         return Promise.resolve(balance)
      },
      () => {
         return Promise.reject()
      },
   )
}

export default {
   init,
   validatePassword,
   createPassword,
   lock,
   unlock,
   createNew,
   importFromPrivateKey,
   getBalance,
}
