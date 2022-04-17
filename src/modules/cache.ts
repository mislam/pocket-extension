import Storage from '@/modules/storage'

const get = (key: string) => {
   const entry = Storage.get(`cache.${key}`)
   if (entry && entry.expireAt > new Date().getTime()) {
      return entry.value
   }
}

const set = async (key: string, value: any, ttl: number) => {
   if (typeof key !== 'string' || typeof ttl !== 'number') {
      Promise.reject('Invalid argument(s)')
   }
   const expireAt = new Date().getTime() + ttl * 1e3
   await Storage.set(`cache.${key}`, {
      value,
      expireAt,
   })
}

const fetch = async (url: string, ttl: number): Promise<any> => {
   let data = get(`fetch:${url}`)
   if (data) {
      return data
   }
   const response = await window.fetch(url)
   data = await response.json()
   await set(`fetch:${url}`, data, ttl)
   return data
}

export default {
   get,
   set,
   fetch,
}
