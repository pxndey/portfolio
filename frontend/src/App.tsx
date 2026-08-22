import Home from './pages/Home'
import Academics from './pages/Academics'
import Experience from './pages/Experience'
import Projects from './pages/Projects'
import Research from './pages/Research'
import Contact from './pages/Contact'
import Music from './pages/Music'
import Misc from './pages/Misc'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import MusicPlayer from './components/MusicPlayer'
import RaceSidebar from './components/RaceSidebar'
import F1Background from './components/F1Background'
import './components/Sidebar.css'
import portfolioData from './data/portfolioData.generated'
import themes from './data/themes.generated'
import { useEffect } from 'react'

function App() {
  useEffect(() => {
    const randomTheme = themes.item[Math.floor(Math.random() * themes.item.length)]
    document.documentElement.style.setProperty('--accent-color', randomTheme.accent_color)

    const saved = localStorage.getItem('theme-mode')
    const mode =
      saved === 'light' || saved === 'dark'
        ? saved
        : window.matchMedia('(prefers-color-scheme: light)').matches
          ? 'light'
          : 'dark'
    document.documentElement.setAttribute('data-theme', mode)
  }, [])

  return (
    <BrowserRouter>
      <F1Background />
      <div className="app-container">
        <Sidebar portfolioData={portfolioData} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/academics" element={<Academics portfolioData={portfolioData} />} />
            <Route path="/experience" element={<Experience portfolioData={portfolioData} />} />
            <Route path="/projects" element={<Projects portfolioData={portfolioData} />} />
            <Route path="/research" element={<Research portfolioData={portfolioData} />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/music" element={<Music />} />
            <Route path="/misc" element={<Misc />} />
          </Routes>
        </main>
        <RaceSidebar />
        <MusicPlayer />
      </div>
    </BrowserRouter>
  )
}

export default App  
