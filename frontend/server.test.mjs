// @vitest-environment node
import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { createApp } from './server.mjs'

describe('frontend server startup delay', () => {
  it('returns 500 on /health and blocks regular routes during first 30 seconds', async () => {
    let nowMs = 0
    const app = createApp({ startupDelayMs: 30_000, now: () => nowMs })

    const healthResponse = await request(app).get('/health')
    expect(healthResponse.status).toBe(500)

    const runtimeConfigResponse = await request(app).get('/api/runtime-config')
    expect(runtimeConfigResponse.status).toBe(503)
    expect(runtimeConfigResponse.body).toEqual({ error: 'Frontend server is starting up' })
  })

  it('serves routes and returns 200 on /health after startup delay', async () => {
    let nowMs = 0
    const app = createApp({ startupDelayMs: 30_000, now: () => nowMs })

    nowMs = 30_000

    const healthResponse = await request(app).get('/health')
    expect(healthResponse.status).toBe(200)

    const healthStateResponse = await request(app).get('/api/health-state')
    expect(healthStateResponse.status).toBe(200)
    expect(healthStateResponse.body).toEqual({ isUnhealthy: false })
  })
})
