import { Buffer } from 'buffer'

interface EncryptionResult {
   data: Uint8Array
   iv: Uint8Array
   salt: Uint8Array
}

/**
 * Encrypts a data object that can be any serializable value using
 * a provided password.
 *
 * @param {string} password - password to use for encryption
 * @param {R} dataObj - data to encrypt
 * @returns {Promise<string>} cypher text
 */
const encrypt = async <R>(password: string, dataObj: R): Promise<string> => {
   const salt = generateSalt()
   const passwordDerivedKey = await keyFromPassword(password, salt)
   const payload = await encryptWithKey(passwordDerivedKey, dataObj)
   payload.salt = salt
   return Buffer.concat([payload.salt, payload.iv, payload.data]).toString('base64')
}

/**
 * Encrypts the provided serializable javascript object using the
 * provided CryptoKey and returns an object containing the cypher text and
 * the initialization vector used.
 * @param {CryptoKey} key - CryptoKey to encrypt with
 * @param {R} dataObj - Serializable javascript object to encrypt
 * @returns {EncryptionResult}
 */
const encryptWithKey = async <R>(key: CryptoKey, dataObj: R): Promise<EncryptionResult> => {
   const data = JSON.stringify(dataObj)
   const dataBuffer = Buffer.from(data, 'utf-8')
   const vector = crypto.getRandomValues(new Uint8Array(16))
   const buf = await crypto.subtle.encrypt(
      {
         name: 'AES-GCM',
         iv: vector,
      },
      key,
      dataBuffer,
   )
   const buffer = new Uint8Array(buf)
   return {
      data: buffer,
      iv: vector,
      salt: new Uint8Array(),
   }
}

/**
 * Given a password and the encrypted data, decrypts the text and returns
 * the resulting value
 * @param {string} password - password to decrypt with
 * @param {string} text - cypher text to decrypt
 */
const decrypt = async <R>(password: string, text: string): Promise<R> => {
   const dataBuffer = Buffer.from(text, 'base64')
   const payload = {
      salt: dataBuffer.slice(0, 32),
      iv: dataBuffer.slice(32, 48),
      data: dataBuffer.slice(48),
   }
   const key = await keyFromPassword(password, payload.salt)
   return await decryptWithKey(key, payload)
}

/**
 * Given a CryptoKey and an EncryptionResult object containing the initialization
 * vector (iv) and data to decrypt, return the resulting decrypted value.
 * @param {CryptoKey} key - CryptoKey to decrypt with
 * @param {EncryptionResult} payload - payload returned from an encryption method
 */
const decryptWithKey = async <R>(key: CryptoKey, payload: EncryptionResult): Promise<R> => {
   const encryptedData = Buffer.from(payload.data)
   const vector = payload.iv
   try {
      const result = await crypto.subtle.decrypt(
         { name: 'AES-GCM', iv: vector },
         key,
         encryptedData,
      )
      const decryptedData = new Uint8Array(result)
      const decryptedStr = Buffer.from(decryptedData).toString('utf-8')
      const decryptedObj = JSON.parse(decryptedStr)
      return decryptedObj
   } catch (_error) {
      throw new Error('Incorrect password')
   }
}

/**
 * Generate a CryptoKey from a password and random salt
 * @param {string} password - The password to use to generate key
 * @param {Uint8Array} salt - The salt to use in key derivation
 */
const keyFromPassword = async (password: string, salt: Uint8Array): Promise<CryptoKey> => {
   const passBuffer = Buffer.from(password, 'utf-8')
   const saltBuffer = Buffer.from(salt)

   const key = await crypto.subtle.importKey('raw', passBuffer, { name: 'PBKDF2' }, false, [
      'deriveBits',
      'deriveKey',
   ])
   return await crypto.subtle.deriveKey(
      {
         name: 'PBKDF2',
         salt: saltBuffer,
         iterations: 10000,
         hash: 'SHA-256',
      },
      key,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt'],
   )
}

/**
 * Converts a hex string into a buffer.
 * @param {string} str - hex encoded string
 * @returns {Uint8Array}
 */
const serializeBufferFromStorage = (str: string): Uint8Array => {
   const stripStr = str.slice(0, 2) === '0x' ? str.slice(2) : str
   const buf = new Uint8Array(stripStr.length / 2)
   for (let i = 0; i < stripStr.length; i += 2) {
      const seg = stripStr.substr(i, 2)
      buf[i / 2] = parseInt(seg, 16)
   }
   return buf
}

/**
 * Converts a buffer into a hex string ready for storage
 * @param {Uint8Array} buffer - Buffer to serialize
 * @returns {string} hex encoded string
 */
const serializeBufferForStorage = (buffer: Uint8Array): string => {
   let result = ''
   const len = buffer.length || buffer.byteLength
   for (let i = 0; i < len; i++) {
      result += unprefixedHex(buffer[i])
   }
   return result
}

/**
 * Converts a number into hex value, and ensures proper leading 0
 * for single characters strings.
 * @param {number} num - Number to convert to string
 * @returns {string} Hex string
 */
const unprefixedHex = (num: number): string => {
   let hex = num.toString(16)
   while (hex.length < 2) {
      hex = `0${hex}`
   }
   return hex
}

/**
 * Generates a random string for use as a salt in CryptoKey generation
 * @param {number} byteCount - Number of bytes to generate
 * @returns {Uint8Array} Randomly generated salt
 */
const generateSalt = (byteCount: number = 32): Uint8Array => {
   return crypto.getRandomValues(new Uint8Array(byteCount))
}

/**
 * Get SHA-256 digest from a message.
 * @param {string} message - Target message
 * @returns {string} SHA-256 digest from the message
 */
const sha256 = async (message: string): Promise<string> => {
   return serializeBufferForStorage(
      new Uint8Array(await crypto.subtle.digest('SHA-256', Buffer.from(message, 'utf-8'))),
   )
}

export { encrypt, decrypt, sha256 }
