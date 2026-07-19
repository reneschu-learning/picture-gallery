import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import App from './App'

function renderApp(initialPath = '/') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <App />
    </MemoryRouter>,
  )
}

describe('App', () => {
  beforeEach(() => {
    delete window.__RUNTIME_CONFIG__
  })

  it('renders the header, menu, and five images on home', () => {
    renderApp('/')

    expect(screen.getByRole('heading', { name: /my picture gallery/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /config/i })).toBeInTheDocument()
    expect(screen.getAllByRole('img')).toHaveLength(5)
  })

  it('navigates to the about page from the menu', async () => {
    const user = userEvent.setup()
    renderApp('/')

    await user.click(screen.getByRole('link', { name: /about/i }))

    expect(screen.getByRole('heading', { name: /about/i })).toBeInTheDocument()
    expect(screen.getByText(/demo application/i)).toBeInTheDocument()
    expect(screen.getByText(/microsoft/i)).toBeInTheDocument()
    expect(screen.getByText(/1.3.1/i)).toBeInTheDocument()
  })

  it('shows N/A values on config page when runtime config is missing', async () => {
    const user = userEvent.setup()
    renderApp('/')

    await user.click(screen.getByRole('link', { name: /config/i }))

    expect(screen.getByRole('heading', { name: /config/i })).toBeInTheDocument()
    expect(screen.getByText('CONFIG_VAR1')).toBeInTheDocument()
    expect(screen.getByText('SECRET1')).toBeInTheDocument()
    expect(screen.getAllByText('N/A')).toHaveLength(6)
  })

  it('shows configured runtime values and missing file errors on config page', async () => {
    window.__RUNTIME_CONFIG__ = {
      CONFIG_VAR1: 'example-config',
      SECRET1: 'example-secret',
      CONFIG_FILE: '/etc/config/app.conf',
      CONFIG_FILE_CONTENT: 'ERROR: File does not exist',
      CONFIG_FILE_VOL: '/mnt/secrets/vol.conf',
      CONFIG_FILE_VOL_CONTENT: {
        greeting: 'hello',
        nested: {
          quote: 'value with "quotes"',
        },
      },
    }

    const user = userEvent.setup()
    renderApp('/')

    await user.click(screen.getByRole('link', { name: /config/i }))

    expect(screen.getByText('example-config')).toBeInTheDocument()
    expect(screen.getByText('example-secret')).toBeInTheDocument()
    expect(screen.getByText('/etc/config/app.conf')).toBeInTheDocument()
    expect(screen.getByText('ERROR: File does not exist')).toBeInTheDocument()
    expect(screen.getByText('/mnt/secrets/vol.conf')).toBeInTheDocument()
    expect(screen.getByText(/"greeting": "hello"/i)).toBeInTheDocument()
    expect(screen.getByText(/"quote": "value with \\"quotes\\""/i)).toBeInTheDocument()
  })
})
