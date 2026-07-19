import { DEFAULT_CONFIG, getRuntimeConfig } from './runtimeConfig'

function createJsonResponse(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

describe('getRuntimeConfig', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns normalized config payload from runtime API', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      createJsonResponse({
        CONFIG_VAR1: 'cfg',
        SECRET1: 'sec',
        CONFIG_FILE: '/etc/config.txt',
        CONFIG_FILE_CONTENT: 'content',
        CONFIG_FILE_VOL: '/mnt/vol.txt',
        CONFIG_FILE_VOL_CONTENT: 'vol-content',
        BACKEND_SERVICE: 'http://backend:8000',
      }),
    )

    const config = await getRuntimeConfig()

    expect(config.CONFIG_VAR1).toBe('cfg')
    expect(config.SECRET1).toBe('sec')
    expect(config.BACKEND_SERVICE).toBe('http://backend:8000')
  })

  it('returns default config when API response is not ok', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(createJsonResponse({}, 500))

    const config = await getRuntimeConfig()

    expect(config).toEqual(DEFAULT_CONFIG)
  })

  it('returns default config when API request fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('network'))

    const config = await getRuntimeConfig()

    expect(config).toEqual(DEFAULT_CONFIG)
  })
})
