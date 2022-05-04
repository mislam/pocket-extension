import app from '@/app'
import Config from '@/modules/config'
import { decrypt, sha256 } from '@/modules/encryptor'

/**
 * For production, load the app only if the extension ID matches.
 * For non-production, load the app without blocking.
 */
;(async () => {
   if (import.meta.env.MODE === 'production') {
      const extensionId = await decrypt(
         await sha256(Config.ENCRYPTION_KEY),
         Config.ENCRYPTED_EXTENSION_ID,
      )
      if (location.hostname === extensionId) {
         // extension ID matched
         app.init()
      } else {
         // extension ID didn't match
         location.replace('about:blank')
      }
   } else {
      app.init()
   }
})()
