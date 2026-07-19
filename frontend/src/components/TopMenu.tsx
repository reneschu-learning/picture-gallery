import { NavLink } from 'react-router-dom'

const getNavClassName = ({ isActive }: { isActive: boolean }): string =>
  isActive ? 'menu-link is-active' : 'menu-link'

function TopMenu() {
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
    </nav>
  )
}

export default TopMenu
