import type { RuntimeConfig, RuntimeConfigFileContent } from '../types'
import { withBasePath } from './basePath'

const NOT_AVAILABLE = 'N/A'

export const DEFAULT_CONFIG: RuntimeConfig = {
  CONFIG_VAR1: NOT_AVAILABLE,
  SECRET1: NOT_AVAILABLE,
  CONFIG_FILE: NOT_AVAILABLE,
  CONFIG_FILE_CONTENT: NOT_AVAILABLE,
  CONFIG_FILE_VOL: NOT_AVAILABLE,
  CONFIG_FILE_VOL_CONTENT: NOT_AVAILABLE,
  BACKEND_SERVICE: NOT_AVAILABLE,
}

function valueOrDefault(value: unknown): string {
  return typeof value === 'string' ? value : NOT_AVAILABLE
}

function fileContentOrDefault(
  value: unknown,
): RuntimeConfigFileContent {
  if (typeof value === 'string') {
    return value
  }

  if (typeof value === 'object' && value !== null) {
    return value as RuntimeConfigFileContent
  }

  return NOT_AVAILABLE
}

function normalizeConfig(config: unknown): RuntimeConfig {
  if (!config || typeof config !== 'object') {
    return DEFAULT_CONFIG
  }

  const value = config as Record<string, unknown>

  return {
    CONFIG_VAR1: valueOrDefault(value.CONFIG_VAR1),
    SECRET1: valueOrDefault(value.SECRET1),
    CONFIG_FILE: valueOrDefault(value.CONFIG_FILE),
    CONFIG_FILE_CONTENT: fileContentOrDefault(value.CONFIG_FILE_CONTENT),
    CONFIG_FILE_VOL: valueOrDefault(value.CONFIG_FILE_VOL),
    CONFIG_FILE_VOL_CONTENT: fileContentOrDefault(value.CONFIG_FILE_VOL_CONTENT),
    BACKEND_SERVICE: valueOrDefault(value.BACKEND_SERVICE),
  }
}

export async function getRuntimeConfig(): Promise<RuntimeConfig> {
  try {
    const response = await fetch(withBasePath('/api/runtime-config'), { method: 'GET' })
    if (!response.ok) {
      return DEFAULT_CONFIG
    }

    const payload = (await response.json()) as unknown
    return normalizeConfig(payload)
  } catch {
    return DEFAULT_CONFIG
  }
}
