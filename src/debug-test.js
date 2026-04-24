// Debug test to check environment and mock mode
import { isMockMode } from './services/api'
import { debug } from './utils/logger'

debug('=== DEBUG TEST ===', {
  isMockMode: isMockMode(),
  VITE_USE_MOCK_DATA: import.meta.env.VITE_USE_MOCK_DATA,
  NODE_ENV: import.meta.env.MODE,
  PROD: import.meta.env.PROD,
  DEV: import.meta.env.DEV
})

console.log('=== DEBUG TEST CONSOLE ===', {
  isMockMode: isMockMode(),
  VITE_USE_MOCK_DATA: import.meta.env.VITE_USE_MOCK_DATA,
  NODE_ENV: import.meta.env.MODE,
  PROD: import.meta.env.PROD,
  DEV: import.meta.env.DEV
})

export const debugInfo = {
  isMockMode: isMockMode(),
  VITE_USE_MOCK_DATA: import.meta.env.VITE_USE_MOCK_DATA,
  NODE_ENV: import.meta.env.MODE,
  PROD: import.meta.env.PROD,
  DEV: import.meta.env.DEV
}
