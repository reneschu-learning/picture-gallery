import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import Header from './components/Header'
import TopMenu from './components/TopMenu'
import { sendPageVisitLog } from './services/visitLogService'
import About from './views/About'
import Config from './views/Config'
import Home from './views/Home'

function toPageName(pathname: string): string {
  if (pathname === '/') {
    return 'home'
  }

  if (pathname === '/about') {
    return 'about'
  }

  if (pathname === '/config') {
    return 'config'
  }

  return pathname.replace(/^\//, '') || 'home'
}

function App() {
  const location = useLocation()

  useEffect(() => {
    void sendPageVisitLog(toPageName(location.pathname))
  }, [location.pathname])

  return (
    <div className="app-shell">
      <Header />
      <TopMenu />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/config" element={<Config />} />
      </Routes>
    </div>
  )
}

export default App
