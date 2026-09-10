import Home from './pages/Home'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import MusicPlayer from './components/MusicPlayer'
import RaceSidebar from './components/RaceSidebar'
import F1Background from './components/F1Background'
import './components/Sidebar.css'
import portfolioData from './data/portfolioData.generated'
import themes from './data/themes.generated'
import { lazy, Suspense, useEffect } from 'react'

const Academics = lazy(() => import('./pages/Academics'))
const Experience = lazy(() => import('./pages/Experience'))
const Projects = lazy(() => import('./pages/Projects'))
const Research = lazy(() => import('./pages/Research'))
const Tools = lazy(() => import('./pages/Tools'))
const Status = lazy(() => import('./pages/Status'))
const Contact = lazy(() => import('./pages/Contact'))
const Music = lazy(() => import('./pages/Music'))
const Misc = lazy(() => import('./pages/Misc'))

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
          <Suspense fallback={<div className="page-loading" aria-busy="true" />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/academics" element={<Academics portfolioData={portfolioData} />} />
              <Route path="/experience" element={<Experience portfolioData={portfolioData} />} />
              <Route path="/projects" element={<Projects portfolioData={portfolioData} />} />
              <Route path="/research" element={<Research portfolioData={portfolioData} />} />
              <Route path="/tools" element={<Tools portfolioData={portfolioData} />} />
              <Route path="/status" element={<Status portfolioData={portfolioData} />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/music" element={<Music />} />
              <Route path="/misc" element={<Misc />} />
            </Routes>
          </Suspense>
        </main>
        <RaceSidebar />
        <MusicPlayer />
      </div>
    </BrowserRouter>
  )
}

export default App  
