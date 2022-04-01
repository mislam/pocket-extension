import AES from 'crypto-js/aes'
import Utf8 from 'crypto-js/enc-utf8'

let data = {
   locked: true,
   passwordHash: null,
}
const encryptionKey = 'k3!G5]c#w(8;v@E{q.L%p:m7,f^k)4?g'
const storageKey = '_'

const init = async () => {
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

const set = async (key, value) => {
   data[key] = value
   await _persist()
}

const get = (key) => {
   return data.hasOwnProperty(key) ? data[key] : null
}

const _encrypt = (data) => {
   return AES.encrypt(JSON.stringify(data), encryptionKey).toString()
}

const _decrypt = (encryptedData) => {
   return JSON.parse(AES.decrypt(encryptedData, encryptionKey).toString(Utf8))
}

const _persist = async () => {
   const encryptedData = _encrypt(data)
   if ('storage' in chrome) {
      const obj = {}
      obj[storageKey] = encryptedData
      await chrome.storage.local.set(obj)
   } else {
      window.localStorage.setItem(storageKey, encryptedData)
   }
}

export default {
   init,
   set,
   get,
}
