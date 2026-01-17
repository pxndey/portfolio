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
import './components/Sidebar.css'
import portfolioData from './data/portfolioData.generated'
import themes from './data/themes.generated'
import { useEffect } from 'react'

function App() {
  useEffect(() => {
    // Pick a random theme on load
    const randomTheme = themes.item[Math.floor(Math.random() * themes.item.length)]

    // Function to calculate relative luminance
    const getLuminance = (hexColor: string): number => {
      const hex = hexColor.replace('#', '')
      const r = parseInt(hex.substring(0, 2), 16) / 255
      const g = parseInt(hex.substring(2, 4), 16) / 255
      const b = parseInt(hex.substring(4, 6), 16) / 255

      const [rs, gs, bs] = [r, g, b].map(c =>
        c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
      )

      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
    }

    // Determine if background is light or dark
    const luminance = getLuminance(randomTheme.primary_color)
    const isLight = luminance > 0.5

    // Apply theme colors as CSS variables
    document.documentElement.style.setProperty('--primary-color', randomTheme.primary_color)
    document.documentElement.style.setProperty('--accent-color', randomTheme.accent_color)

    // Set text colors based on background brightness
    if (isLight) {
      // Light background - use dark text
      document.documentElement.style.setProperty('--text-primary', '#1a1a1a')
      document.documentElement.style.setProperty('--text-secondary', '#4a4a4a')
      document.documentElement.style.setProperty('--text-tertiary', '#666666')
      document.documentElement.style.setProperty('--text-muted', '#888888')
      document.documentElement.style.setProperty('--border-color', '#d0d0d0')
      document.documentElement.style.setProperty('--card-overlay', 'rgba(0, 0, 0, 0.05)')
    } else {
      // Dark background - use light text
      document.documentElement.style.setProperty('--text-primary', '#ffffff')
      document.documentElement.style.setProperty('--text-secondary', '#cccccc')
      document.documentElement.style.setProperty('--text-tertiary', '#999999')
      document.documentElement.style.setProperty('--text-muted', '#888888')
      document.documentElement.style.setProperty('--border-color', '#4a4a4a')
      document.documentElement.style.setProperty('--card-overlay', 'rgba(255, 255, 255, 0.05)')
    }
  }, [])

  return (
    <BrowserRouter>
      <div className="app-container">
        <Sidebar portfolioData={portfolioData} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/academics" element={<Academics portfolioData={portfolioData} />} />
            <Route path="/experience" element={<Projects portfolioData={portfolioData} />} />
            <Route path="/research" element={<Research portfolioData={portfolioData} />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/music" element={<Music />} />
            <Route path="/misc" element={<Misc />} />
          </Routes>
        </main>
        <MusicPlayer />
      </div>
    </BrowserRouter>
  )
}

export default App  
