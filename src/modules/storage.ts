import Config from '@/modules/config'
import { encrypt, decrypt, sha256 } from '@/modules/encryptor'

let data = new Map<string, any>()
let encryptionPassword = '' // this is going to be populated in init()
const storageKey = '_' // the key to be used in the key-value pair in storage

const init = async (state: object) => {
   encryptionPassword = await sha256(Config.STORAGE_ENCRYPTION_KEY)
   data = new Map(Object.entries(state))
   let encryptedData
   if ('storage' in chrome) {
      let obj = await chrome.storage.local.get(storageKey)
      if (!obj.hasOwnProperty(storageKey)) {
         await _persist()
         obj = await chrome.storage.local.get(storageKey)
      }
      encryptedData = obj[storageKey]
   } else {
      if (!window.localStorage.getItem(storageKey)) {
         await _persist()
      }
      encryptedData = window.localStorage.getItem(storageKey)
   }
   data = await _decrypt(encryptedData)
}

const set = async (key: string, value: any) => {
   data.set(key, value)
   await _persist()
}

const get = (key: string, defaultValue?: any) => {
   const value = data.get(key)
   return value !== undefined ? value : defaultValue
}

/**
 * Encrypt the data on production environment, but keep it readable on dev environment.
 * @param {Map<string, any>} data Data to be encrypted
 * @returns {string} Encrypted data
 */
const _encrypt = async (data: Map<string, any>): Promise<string> => {
   if (import.meta.env.DEV) {
      return JSON.stringify(Object.fromEntries(data))
   } else {
      return await encrypt(encryptionPassword, Object.fromEntries(data))
   }
}

/**
 * Decrypt the encrypted data on production environment, but just pass it thru in dev environment.
 * @param {string} encryptedData Encrypted data to be decrypted
 * @returns {Map<string, any>} Decrypted data
 */
const _decrypt = async (encryptedData: string): Promise<Map<string, any>> => {
   if (import.meta.env.DEV) {
      return new Map(Object.entries(JSON.parse(encryptedData)))
   } else {
      return new Map(Object.entries(await decrypt(encryptionPassword, encryptedData)))
   }
}

const _persist = async () => {
   const encryptedData = await _encrypt(data)
   if ('storage' in chrome) {
      await chrome.storage.local.set({
         [storageKey]: encryptedData,
      })
   } else {
      window.localStorage.setItem(storageKey, encryptedData)
   }
}

export default {
   init,
   set,
   get,
}
