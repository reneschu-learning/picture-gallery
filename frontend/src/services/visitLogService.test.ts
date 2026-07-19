import { sendPageVisitLog } from './visitLogService'

describe('sendPageVisitLog', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('posts route visit payload to visit-log endpoint', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{}', { status: 200 }))

    await sendPageVisitLog('home')

    expect(globalThis.fetch).toHaveBeenCalledWith(
      '/api/visit-log',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }),
    )

    const [, init] = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0]
    const payload = JSON.parse((init as RequestInit).body as string)
    expect(payload.page).toBe('home')
    expect(typeof payload.userAgent).toBe('string')
    expect(typeof payload.timestamp).toBe('string')
  })

  it('swallows network failures', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('offline'))

    await expect(sendPageVisitLog('about')).resolves.toBeUndefined()
  })
})
