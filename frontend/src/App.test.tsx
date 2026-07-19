import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import App from './App'

const defaultRuntimeConfigPayload = {
  CONFIG_VAR1: 'N/A',
  SECRET1: 'N/A',
  CONFIG_FILE: 'N/A',
  CONFIG_FILE_CONTENT: 'N/A',
  CONFIG_FILE_VOL: 'N/A',
  CONFIG_FILE_VOL_CONTENT: 'N/A',
  BACKEND_SERVICE: 'N/A',
}

function createJsonResponse(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

function installFetchMock(runtimeConfigPayload = defaultRuntimeConfigPayload) {
  let isUnhealthy = false

  vi.spyOn(globalThis, 'fetch').mockImplementation(async (input, init) => {
    if (typeof input === 'string' && input === '/api/runtime-config') {
      return createJsonResponse(runtimeConfigPayload)
    }

    if (typeof input === 'string' && input === '/api/health-state') {
      const requestInit = init as RequestInit | undefined
      const method = requestInit?.method ?? 'GET'

      if (method === 'POST') {
        const payload = JSON.parse((requestInit?.body as string) ?? '{}') as Record<string, unknown>
        if (typeof payload.isUnhealthy !== 'boolean') {
          return createJsonResponse({ error: 'isUnhealthy must be a boolean' }, 400)
        }

        isUnhealthy = payload.isUnhealthy
      }

      return createJsonResponse({ isUnhealthy })
    }

    if (typeof input === 'string' && input === '/api/visit-log') {
      return createJsonResponse({ status: 'ok' })
    }

    return createJsonResponse({}, 404)
  })
}

function renderApp(initialPath = '/') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <App />
    </MemoryRouter>,
  )
}

describe('App', () => {
  beforeEach(() => {
    installFetchMock()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders the header, menu, and five images on home', () => {
    renderApp('/')

    expect(screen.getByRole('heading', { name: /my picture gallery/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /config/i })).toBeInTheDocument()
    expect(screen.getAllByRole('img')).toHaveLength(5)

    expect(globalThis.fetch).toHaveBeenCalledWith(
      '/api/visit-log',
      expect.objectContaining({ method: 'POST' }),
    )
  })

  it('navigates to the about page from the menu', async () => {
    const user = userEvent.setup()
    renderApp('/')

    await user.click(screen.getByRole('link', { name: /about/i }))

    expect(screen.getByRole('heading', { name: /about/i })).toBeInTheDocument()
    expect(screen.getByText(/demo application/i)).toBeInTheDocument()
    expect(screen.getByText(/microsoft/i)).toBeInTheDocument()
    expect(screen.getByText(/2.2.1/i)).toBeInTheDocument()

    const loggedPages = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls
      .filter(([url]) => url === '/api/visit-log')
      .map(([, init]) => JSON.parse((init as RequestInit).body as string).page)

    expect(loggedPages).toContain('about')
  })

  it('shows N/A values on config page when runtime config values are N/A', async () => {
    const user = userEvent.setup()
    renderApp('/')

    await user.click(screen.getByRole('link', { name: /config/i }))

    expect(screen.getByRole('heading', { name: /config/i })).toBeInTheDocument()
    expect(await screen.findByText('CONFIG_VAR1')).toBeInTheDocument()
    expect(screen.getByText('SECRET1')).toBeInTheDocument()
    expect(screen.getByText('BACKEND_SERVICE')).toBeInTheDocument()
    expect(screen.getAllByText('N/A')).toHaveLength(7)
  })

  it('shows configured runtime values and backend status text on config page', async () => {
    vi.restoreAllMocks()
    installFetchMock({
      CONFIG_VAR1: 'example-config',
      SECRET1: 'example-secret',
      CONFIG_FILE: '/etc/config/app.conf',
      CONFIG_FILE_CONTENT: 'ERROR: File does not exist',
      CONFIG_FILE_VOL: '/mnt/secrets/vol.conf',
      CONFIG_FILE_VOL_CONTENT: 'ERROR: Backend not configured',
      BACKEND_SERVICE: 'N/A',
    })

    const user = userEvent.setup()
    renderApp('/')

    await user.click(screen.getByRole('link', { name: /config/i }))

    expect(screen.getByText('example-config')).toBeInTheDocument()
    expect(screen.getByText('example-secret')).toBeInTheDocument()
    expect(screen.getByText('/etc/config/app.conf')).toBeInTheDocument()
    expect(screen.getByText('ERROR: File does not exist')).toBeInTheDocument()
    expect(screen.getByText('/mnt/secrets/vol.conf')).toBeInTheDocument()
    expect(screen.getByText('ERROR: Backend not configured')).toBeInTheDocument()
    expect(screen.getByText('N/A')).toBeInTheDocument()
  })

  it('toggles frontend health mode from config page', async () => {
    const user = userEvent.setup()
    renderApp('/')

    await user.click(screen.getByRole('link', { name: /config/i }))

    const toggle = screen.getByRole('checkbox', {
      name: /set frontend health endpoint to unhealthy/i,
    })

    expect(toggle).not.toBeChecked()
    expect(screen.getByText(/frontend health is healthy/i)).toBeInTheDocument()

    await user.click(toggle)

    expect(toggle).toBeChecked()
    expect(screen.getByText(/frontend health is unhealthy/i)).toBeInTheDocument()

    const healthStateCalls = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls.filter(
      ([url]) => url === '/api/health-state',
    )

    expect(healthStateCalls.length).toBeGreaterThanOrEqual(2)
    const postCall = healthStateCalls.find(([, callInit]) => (callInit as RequestInit)?.method === 'POST')
    expect(postCall).toBeDefined()

    if (!postCall) {
      return
    }

    const [, postRequest] = postCall
    expect(JSON.parse((postRequest as RequestInit).body as string)).toEqual({ isUnhealthy: true })
  })
})
