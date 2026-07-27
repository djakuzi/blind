export function createLogConfig() {
  return import.meta.env.LOG_ENABLED === 'true'
}
