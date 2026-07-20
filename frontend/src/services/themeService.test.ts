import {
  applyTheme,
  getCurrentTheme,
  getStoredTheme,
  initializeTheme,
  setTheme,
  THEME_OPTIONS,
} from './themeService'

describe('themeService', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('data-theme')
    globalThis.localStorage.clear()
  })

  it('exports all supported themes', () => {
    expect(THEME_OPTIONS).toEqual(['light', 'dark', 'colorful'])
  })

  it('returns light when no saved theme exists', () => {
    expect(getStoredTheme()).toBe('light')
  })

  it('returns light when saved theme is invalid', () => {
    globalThis.localStorage.setItem('picture-gallery-theme', 'sepia')

    expect(getStoredTheme()).toBe('light')
  })

  it('applies and persists selected theme', () => {
    setTheme('dark')

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
    expect(globalThis.localStorage.getItem('picture-gallery-theme')).toBe('dark')
    expect(getCurrentTheme()).toBe('dark')
  })

  it('initializes from localStorage', () => {
    globalThis.localStorage.setItem('picture-gallery-theme', 'colorful')

    const initialTheme = initializeTheme()

    expect(initialTheme).toBe('colorful')
    expect(document.documentElement.getAttribute('data-theme')).toBe('colorful')
  })

  it('applyTheme writes directly to html data-theme attribute', () => {
    applyTheme('dark')

    expect(getCurrentTheme()).toBe('dark')
  })
})
