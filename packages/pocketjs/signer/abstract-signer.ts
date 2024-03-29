import { AbstractProvider } from '../abstract-provider'
import { TransactionResponse } from '../types'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TransactionRequest {}

/**
 * An abstract signer describes a to-be-implemented signer.
 * Useful for creating custom signers, if ever needed.
 * */
export abstract class AbstractSigner {
   readonly provider?: AbstractProvider // Provider that will send all calls
   readonly _isSigner: boolean // mark signer as a proper signer (useful for non-writable signers)

   constructor() {
      // Assume it's a void/readonly signer by default
      this._isSigner = false
   }

   abstract getAddress(): Promise<string>
   abstract getBalance(address: string | Promise<string>): Promise<bigint>
   abstract getTransactionCount(address: string | Promise<string>): Promise<number>
   // Txs
   abstract sendTransaction(
      signedTransaction: string | Promise<string>,
   ): Promise<TransactionResponse>
   abstract sign(payload: string): Promise<string>
   abstract signTransaction(transaction: TransactionRequest): Promise<string>
}
