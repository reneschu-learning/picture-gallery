import type { FrontendHealthState } from '../types'
import { withBasePath } from './basePath'

export const DEFAULT_FRONTEND_HEALTH_STATE: FrontendHealthState = {
  isUnhealthy: false,
}

function normalizeHealthState(payload: unknown): FrontendHealthState {
  if (!payload || typeof payload !== 'object') {
    return DEFAULT_FRONTEND_HEALTH_STATE
  }

  const value = payload as Record<string, unknown>
  return {
    isUnhealthy: value.isUnhealthy === true,
  }
}

export async function getFrontendHealthState(): Promise<FrontendHealthState> {
  try {
    const response = await fetch(withBasePath('/api/health-state'), { method: 'GET' })
    if (!response.ok) {
      return DEFAULT_FRONTEND_HEALTH_STATE
    }

    const payload = (await response.json()) as unknown
    return normalizeHealthState(payload)
  } catch {
    return DEFAULT_FRONTEND_HEALTH_STATE
  }
}

export async function setFrontendHealthState(
  isUnhealthy: boolean,
): Promise<FrontendHealthState | null> {
  try {
    const response = await fetch(withBasePath('/api/health-state'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isUnhealthy }),
    })

    if (!response.ok) {
      return null
    }

    const payload = (await response.json()) as unknown
    return normalizeHealthState(payload)
  } catch {
    return null
  }
}
