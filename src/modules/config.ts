const keys: any = {
   STORAGE_ENCRYPTION_KEY: String,
   MAINNET_RPC_URL: String,
   TESTNET_RPC_URL: String,
   PRICE_URL: String,
   BALANCE_TTL: Number,
   PRICE_TTL: Number,
   DEFAULT_BASE_FEE: Number,
   TX_CONF_ETA: Number,
}

const Config: any = {}

for (const key in keys) {
   Config[key] = keys[key](import.meta.env[`VITE_${key}`])
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
