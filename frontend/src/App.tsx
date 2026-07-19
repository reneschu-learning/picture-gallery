import { Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import TopMenu from './components/TopMenu'
import About from './views/About'
import Config from './views/Config'
import Home from './views/Home'

function App() {
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
