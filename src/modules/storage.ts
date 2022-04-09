import { encrypt, decrypt } from '@/modules/encryptor'

let data = new Map<string, any>()
const encryptionKey = 'k3!G5]c#w(8;v@E{q.L%p:m7,f^k)4?g'
const storageKey = '_'

const init = async (state: object) => {
   data = new Map(Object.entries(state))
   let encryptedData
   if ('storage' in chrome) {
      const obj = await chrome.storage.local.get(storageKey)
      if (!obj.hasOwnProperty(storageKey)) {
         return
      }
      encryptedData = obj[storageKey]
   } else {
      if (!window.localStorage.hasOwnProperty(storageKey)) {
         return
      }
      encryptedData = window.localStorage[storageKey]
   }
   data = await _decrypt(encryptedData)
}

const set = async (key: string, value: any) => {
   data.set(key, value)
   await _persist()
}

const get = (key: string) => {
   return data.get(key)
}

const _encrypt = async (data: Map<string, any>) => {
   return await encrypt(encryptionKey, Object.fromEntries(data))
}

const _decrypt = async (encryptedData: string) => {
   return new Map(Object.entries(await decrypt(encryptionKey, encryptedData)))
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
