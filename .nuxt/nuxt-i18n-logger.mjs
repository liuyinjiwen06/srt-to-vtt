
import { createConsola } from 'consola'
const debugLogger = createConsola({ level: 4 }).withTag('i18n')
export function createLogger(label) {
  return debugLogger.withTag(label)
}