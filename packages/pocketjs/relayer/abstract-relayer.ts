import { AbstractSigner, KeyManager } from '../signer'
import { AbstractProvider } from '../abstract-provider'
import { HTTPMethod, Node, PocketAAT, RelayHeaders, Session } from '../types'

export abstract class AbstractRelayer {
   readonly keyManager: KeyManager | AbstractSigner
   readonly provider: AbstractProvider
   readonly dispatchers: string[]

   constructor({ keyManager, provider, dispatchers }) {
      this.keyManager = keyManager
      this.provider = provider
      this.dispatchers = dispatchers
   }

   abstract getNewSession({
      pocketAAT,
      chain,
      options,
   }: {
      pocketAAT: PocketAAT
      chain: string
      options?: { retryAttempts: number; rejectSelfSignedCertificates: boolean }
   }): Promise<Session>

   abstract relay({
      data,
      blockchain,
      pocketAAT,
      headers,
      method,
      session,
      node,
      path,
   }: {
      data: string
      blockchain: string
      pocketAAT: PocketAAT
      headers: RelayHeaders
      method: HTTPMethod
      session: Session
      node: Node
      path: string
   }): void
}
