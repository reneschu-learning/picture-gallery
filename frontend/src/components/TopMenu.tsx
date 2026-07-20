import { useState } from 'react'
import type { ChangeEvent } from 'react'
import { NavLink } from 'react-router-dom'
import { getCurrentTheme, setTheme, THEME_OPTIONS } from '../services/themeService'
import type { ThemeName } from '../types'

const getNavClassName = ({ isActive }: { isActive: boolean }): string =>
  isActive ? 'menu-link is-active' : 'menu-link'

function TopMenu() {
  const [theme, setThemeName] = useState<ThemeName>(() => getCurrentTheme())

  function onThemeChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextTheme = event.target.value as ThemeName
    setTheme(nextTheme)
    setThemeName(nextTheme)
  }

  return (
    <nav className="top-menu" aria-label="Main menu">
      <NavLink to="/" end className={getNavClassName}>
        Home
      </NavLink>
      <NavLink to="/about" className={getNavClassName}>
        About
      </NavLink>
      <NavLink to="/config" className={getNavClassName}>
        Config
      </NavLink>
      <label className="theme-picker" htmlFor="theme-selector">
        Theme
      </label>
      <select
        id="theme-selector"
        className="theme-select"
        value={theme}
        onChange={onThemeChange}
        aria-label="Select theme"
      >
        {THEME_OPTIONS.map((themeOption) => (
          <option key={themeOption} value={themeOption}>
            {themeOption.charAt(0).toUpperCase() + themeOption.slice(1)}
          </option>
        ))}
      </select>
    </nav>
  )
}

export default TopMenu
