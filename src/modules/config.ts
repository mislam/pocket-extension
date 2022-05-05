import { DEFAULT_BASE_FEE } from '@packages/pocketjs/transaction-builder'

const Config: any = {
   ENCRYPTED_EXTENSION_ID: import.meta.env._ENCRYPTED_EXTENSION_ID,
   ENCRYPTION_KEY: import.meta.env._ENCRYPTION_KEY,
   MAINNET_RPC_URL: import.meta.env._MAINNET_RPC_URL,
   TESTNET_RPC_URL: import.meta.env._TESTNET_RPC_URL,
   PRICE_URL: import.meta.env._PRICE_URL,
   BALANCE_TTL: Number(import.meta.env._BALANCE_TTL),
   PRICE_TTL: Number(import.meta.env._PRICE_TTL),
   TX_CONF_ETA: Number(import.meta.env._TX_CONF_ETA),
   DEFAULT_BASE_FEE,
}

Config.getRpcUrl = (network: string): string => {
   switch (network) {
      case 'testnet':
         return Config.TESTNET_RPC_URL
      case 'mainnet':
      default:
         return Config.MAINNET_RPC_URL
   }
}

export default Config
