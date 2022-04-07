import AES from 'crypto-js/aes'
import Utf8 from 'crypto-js/enc-utf8'

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
   data = _decrypt(encryptedData)
}

const set = async (key: string, value: any) => {
   data.set(key, value)
   await _persist()
}

const get = (key: string) => {
   return data.get(key)
}

const _encrypt = (data: Map<string, any>) => {
   return AES.encrypt(JSON.stringify(Object.fromEntries(data)), encryptionKey).toString()
}

const _decrypt = (encryptedData: string) => {
   return new Map(
      Object.entries(JSON.parse(AES.decrypt(encryptedData, encryptionKey).toString(Utf8))),
   )
}

const _persist = async () => {
   const encryptedData = _encrypt(data)
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
