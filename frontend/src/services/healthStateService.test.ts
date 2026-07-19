import {
  DEFAULT_FRONTEND_HEALTH_STATE,
  getFrontendHealthState,
  setFrontendHealthState,
} from './healthStateService'

function createJsonResponse(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

describe('healthStateService', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('reads current frontend health state', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(createJsonResponse({ isUnhealthy: true }))

    await expect(getFrontendHealthState()).resolves.toEqual({ isUnhealthy: true })

    expect(globalThis.fetch).toHaveBeenCalledWith('/api/health-state', { method: 'GET' })
  })

  it('returns default state when read request fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('offline'))

    await expect(getFrontendHealthState()).resolves.toEqual(DEFAULT_FRONTEND_HEALTH_STATE)
  })

  it('posts and returns updated frontend health state', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(createJsonResponse({ isUnhealthy: true }))

    const nextState = await setFrontendHealthState(true)

    expect(nextState).toEqual({ isUnhealthy: true })
    expect(globalThis.fetch).toHaveBeenCalledWith(
      '/api/health-state',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }),
    )

    const [, init] = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0]
    expect(JSON.parse((init as RequestInit).body as string)).toEqual({ isUnhealthy: true })
  })

  it('returns null when update request is rejected by API', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(createJsonResponse({}, 400))

    await expect(setFrontendHealthState(true)).resolves.toBeNull()
  })
})
