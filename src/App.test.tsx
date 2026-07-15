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
  it('renders the header, menu, and five images on home', () => {
    renderApp('/')

    expect(screen.getByRole('heading', { name: /my picture gallery/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument()
    expect(screen.getAllByRole('img')).toHaveLength(5)
  })

  it('navigates to the about page from the menu', async () => {
    const user = userEvent.setup()
    renderApp('/')

    await user.click(screen.getByRole('link', { name: /about/i }))

    expect(screen.getByRole('heading', { name: /about/i })).toBeInTheDocument()
    expect(screen.getByText(/demo application/i)).toBeInTheDocument()
    expect(screen.getByText(/microsoft/i)).toBeInTheDocument()
    expect(screen.getByText(/1.0.0/i)).toBeInTheDocument()
  })
})
