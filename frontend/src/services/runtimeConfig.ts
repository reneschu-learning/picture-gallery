import type { RuntimeConfig, RuntimeConfigFileContent } from '../types'

const NOT_AVAILABLE = 'N/A'

declare global {
  interface Window {
    __RUNTIME_CONFIG__?: Partial<RuntimeConfig>
  }
}

const DEFAULT_CONFIG: RuntimeConfig = {
  CONFIG_VAR1: NOT_AVAILABLE,
  SECRET1: NOT_AVAILABLE,
  CONFIG_FILE: NOT_AVAILABLE,
  CONFIG_FILE_CONTENT: NOT_AVAILABLE,
  CONFIG_FILE_VOL: NOT_AVAILABLE,
  CONFIG_FILE_VOL_CONTENT: NOT_AVAILABLE,
}

function valueOrDefault(value: string | undefined): string {
  return value ?? NOT_AVAILABLE
}

function fileContentOrDefault(
  value: RuntimeConfigFileContent | undefined,
): RuntimeConfigFileContent {
  return value ?? NOT_AVAILABLE
}

export function getRuntimeConfig(): RuntimeConfig {
  const config = window.__RUNTIME_CONFIG__

  if (!config) {
    return DEFAULT_CONFIG
  }

  return {
    CONFIG_VAR1: valueOrDefault(config.CONFIG_VAR1),
    SECRET1: valueOrDefault(config.SECRET1),
    CONFIG_FILE: valueOrDefault(config.CONFIG_FILE),
    CONFIG_FILE_CONTENT: fileContentOrDefault(config.CONFIG_FILE_CONTENT),
    CONFIG_FILE_VOL: valueOrDefault(config.CONFIG_FILE_VOL),
    CONFIG_FILE_VOL_CONTENT: fileContentOrDefault(config.CONFIG_FILE_VOL_CONTENT),
  }
}
