import Hashids from 'hashids'
import { obfuscator } from 'rollup-obfuscator'
import replace from '@rollup/plugin-replace'

const config: any = {}

config.obfuscator = {
   compact: true,
   controlFlowFlattening: false,
   deadCodeInjection: false,
   debugProtection: false,
   debugProtectionInterval: 0,
   disableConsoleOutput: false,
   identifierNamesGenerator: 'mangled-shuffled',
   log: false,
   numbersToExpressions: false,
   renameGlobals: false,
   selfDefending: false,
   simplify: true,
   splitStrings: false,
   stringArray: true,
   stringArrayCallsTransform: false,
   stringArrayCallsTransformThreshold: 0.5,
   stringArrayEncoding: [],
   stringArrayIndexShift: true,
   stringArrayRotate: true,
   stringArrayShuffle: true,
   stringArrayWrappersCount: 1,
   stringArrayWrappersChainedCalls: true,
   stringArrayWrappersParametersMaxCount: 2,
   stringArrayWrappersType: 'variable',
   stringArrayThreshold: 0.75,
   unicodeEscapeSequence: false,
}

// List all sensitive strings from production code
const keywords = [
   'ENCRYPTED_EXTENSION_ID',
   'ENCRYPTION_KEY',
   'MAINNET_RPC_URL',
   'TESTNET_RPC_URL',
   'PRICE_URL',
   'BALANCE_TTL',
   'PRICE_TTL',
   'DEFAULT_BASE_FEE',
   'TX_CONF_ETA',
]
config.replace = {
   preventAssignment: true,
   values: {},
}
var hashids = new Hashids('Pocket')
Object.entries(keywords).forEach(([index, keyword]) => {
   config.replace.values[keyword] = 'e' + hashids.encode(1e3 + index)
   config.replace.values[`_${keyword}`] = '_e' + hashids.encode(1e3 + index)
})

const rollupPlugins = []

rollupPlugins.push(replace(config.replace))
rollupPlugins.push(obfuscator(config.obfuscator))

export { rollupPlugins }
