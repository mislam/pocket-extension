const keys: any = {
   STORAGE_ENCRYPTION_KEY: String,
   RPC_URL: String,
   PRICE_URL: String,
   BALANCE_TTL: Number,
   PRICE_TTL: Number,
}

const Config: any = {}

for (const key in keys) {
   Config[key] = keys[key](import.meta.env[`VITE_${key}`])
}

export default Config
