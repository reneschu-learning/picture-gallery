// @vitest-environment node
import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { createApp } from './server.mjs'

describe('frontend server startup delay', () => {
  afterEach(() => {
    delete process.env.FRONTEND_BASE_PATH
    delete process.env.BASE_PATH
  })

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

  it('returns 503 for regular routes when unhealthy and allows recovery through toggle endpoint', async () => {
    let nowMs = 0
    const app = createApp({ startupDelayMs: 30_000, now: () => nowMs })
    nowMs = 30_000

    const setUnhealthyResponse = await request(app)
      .post('/api/health-state')
      .send({ isUnhealthy: true })
    expect(setUnhealthyResponse.status).toBe(200)
    expect(setUnhealthyResponse.body).toEqual({ isUnhealthy: true })

    const runtimeConfigWhenUnhealthy = await request(app).get('/api/runtime-config')
    expect(runtimeConfigWhenUnhealthy.status).toBe(503)
    expect(runtimeConfigWhenUnhealthy.body).toEqual({ error: 'Frontend server is unhealthy' })

    const healthWhenUnhealthy = await request(app).get('/health')
    expect(healthWhenUnhealthy.status).toBe(503)

    const setHealthyResponse = await request(app)
      .post('/api/health-state')
      .send({ isUnhealthy: false })
    expect(setHealthyResponse.status).toBe(200)
    expect(setHealthyResponse.body).toEqual({ isUnhealthy: false })

    const runtimeConfigWhenRecovered = await request(app).get('/api/runtime-config')
    expect(runtimeConfigWhenRecovered.status).toBe(200)
  })

  it('serves API and SPA routes under configured frontend base path', async () => {
    process.env.FRONTEND_BASE_PATH = '/v4'

    let nowMs = 0
    const app = createApp({ startupDelayMs: 30_000, now: () => nowMs })
    nowMs = 30_000

    const prefixedRuntimeConfig = await request(app).get('/v4/api/runtime-config')
    expect(prefixedRuntimeConfig.status).toBe(200)

    const prefixedHealth = await request(app).get('/v4/health')
    expect(prefixedHealth.status).toBe(200)

    const spaResponse = await request(app).get('/v4/about')
    expect(spaResponse.status).toBe(200)
    expect(spaResponse.text).toContain('window.__APP_BASE_PATH__="/v4"')
  })
})
