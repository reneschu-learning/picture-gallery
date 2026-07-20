import type { ThemeName } from '../types'

const THEME_STORAGE_KEY = 'picture-gallery-theme'
const DEFAULT_THEME: ThemeName = 'light'

const THEME_NAMES: ReadonlySet<ThemeName> = new Set(['light', 'dark', 'colorful'])

function isThemeName(value: string | null): value is ThemeName {
  return value !== null && THEME_NAMES.has(value as ThemeName)
}

export function getStoredTheme(): ThemeName {
  const value = globalThis.localStorage.getItem(THEME_STORAGE_KEY)
  return isThemeName(value) ? value : DEFAULT_THEME
}

export function getCurrentTheme(): ThemeName {
  const value = document.documentElement.getAttribute('data-theme')
  return isThemeName(value) ? value : DEFAULT_THEME
}

export function applyTheme(theme: ThemeName): void {
  document.documentElement.setAttribute('data-theme', theme)
}

export function setTheme(theme: ThemeName): void {
  applyTheme(theme)
  globalThis.localStorage.setItem(THEME_STORAGE_KEY, theme)
}

export function initializeTheme(): ThemeName {
  const initialTheme = getStoredTheme()
  applyTheme(initialTheme)
  return initialTheme
}

export const THEME_OPTIONS: readonly ThemeName[] = ['light', 'dark', 'colorful']
