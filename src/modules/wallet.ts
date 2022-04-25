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
   await store.dispatch('setPasswordHash', passwordHash)
   await store.dispatch('unlock')
}

const changePassword = async (currentPassword: string, newPassword: string) => {
   const wallets = JSON.parse(JSON.stringify(store.state.wallets)) // clone

   // Update private keys of existing wallets (if any)
   for (const wallet of wallets) {
      const privateKey = await decrypt(currentPassword, wallet.encryptedPrivateKey)
      wallet.encryptedPrivateKey = await encrypt(newPassword, privateKey)
   }
   store.dispatch('setWallets', wallets)

   const passwordHash = await sha256(newPassword)
   await store.dispatch('setPasswordHash', passwordHash)
}

const lock = async () => {
   await store.dispatch('lock')
}

const verifyPassword = async (password: string): Promise<{ error: string | boolean }> => {
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
   return {
      error: false,
   }
}

const unlock = async (password: string): Promise<{ error: string | boolean }> => {
   const verify = await verifyPassword(password)
   if (verify.error) {
      return {
         error: verify.error,
      }
   } else {
      await store.dispatch('unlock')
      return {
         error: false,
      }
   }
}

const encryptPassword = async (password: string): Promise<string> => {
   return await encrypt(encryptionPassword, password)
}

const getPrivateKey = async (encryptedPassword: string, wallet: any) => {
   const password: string = await decrypt(encryptionPassword, encryptedPassword)
   const privateKey: string = await decrypt(password, wallet.encryptedPrivateKey)
   const derivedWallet = (await KeyManager.fromPrivateKey(privateKey)).getAccount()
   if (
      _validateWallet(derivedWallet) &&
      wallet.address === derivedWallet.address &&
      privateKey === derivedWallet.privateKey &&
      derivedWallet.privateKey.length === 128
   ) {
      return privateKey
   }
   return false
}

const createNew = async (encryptedPassword: string) => {
   const wallet = (await KeyManager.createRandom()).getAccount()
   if (!_validateWallet(wallet)) {
      throw new Error('Could not create a new wallet')
   }
   if (_walletExist(wallet)) {
      throw new Error('You already have this wallet')
   }
   if (!(await _storeEncryptedWallet(encryptedPassword, wallet))) {
      throw new Error('Could not store wallet')
   }
}

const importFromPrivateKey = async (encryptedPassword: string, privateKey: string) => {
   const wallet = (await KeyManager.fromPrivateKey(privateKey)).getAccount()
   if (!_validateWallet(wallet)) {
      throw new Error('You entered an invalid private key.')
   }
   if (_walletExist(wallet)) {
      throw new Error('You already have this wallet.')
   }
   if (!(await _storeEncryptedWallet(encryptedPassword, wallet))) {
      throw new Error('Could not store wallet')
   }
}

const _validateWallet = (wallet: Wallet) => {
   return (
      wallet.address.length === 40 &&
      wallet.publicKey.length === 64 &&
      wallet.privateKey.length === 128
   )
}

const _walletExist = (wallet: Wallet) => {
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
const _storeEncryptedWallet = async (
   encryptedPassword: string,
   wallet: Wallet,
): Promise<boolean> => {
   if (!encryptedPassword) {
      return false
   }
   const password: string = await decrypt(encryptionPassword, encryptedPassword)
   await store.dispatch('addWallet', {
      address: wallet.address,
      encryptedPrivateKey: await encrypt(password, wallet.privateKey),
   })
   return true
}

/**
 * Change the name of a wallet
 * @param name {string}
 */
const changeName = async (address: string, name: string) => {
   await store.dispatch('changeWalletName', { address, name })
}

const getBalance = async (address: string): Promise<number> => {
   const rpcUrl = Config.getRpcUrl(store.state.network)
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
   changePassword,
   verifyPassword,
   lock,
   unlock,
   encryptPassword,
   getPrivateKey,
   createNew,
   importFromPrivateKey,
   changeName,
   getBalance,
}
