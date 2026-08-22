import { Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { FiMoon, FiSun } from 'react-icons/fi'
import './Sidebar.css'

interface PortfolioData {
  workExperience: any[]
  education: any[]
  publications: any[]
  projects: any[]
}

interface SidebarProps {
  portfolioData: PortfolioData
}

function getInitialMode(): 'light' | 'dark' {
  const saved = localStorage.getItem('theme-mode')
  if (saved === 'light' || saved === 'dark') return saved
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

function Sidebar({ portfolioData }: SidebarProps) {
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mode, setMode] = useState<'light' | 'dark'>(getInitialMode)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode)
    localStorage.setItem('theme-mode', mode)
  }, [mode])

  const toggleMode = () => setMode(m => (m === 'light' ? 'dark' : 'light'))

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const allNavItems = [
    { path: '/', label: 'About Me', key: 'home', alwaysShow: true },
    { path: '/academics', label: 'Academics', key: 'academics', dataKey: 'education' as keyof PortfolioData },
    { path: '/experience', label: 'Experience', key: 'experience', dataKey: 'workExperience' as keyof PortfolioData },
    { path: '/projects', label: 'Projects', key: 'projects', dataKey: 'projects' as keyof PortfolioData },
    { path: '/research', label: 'Research', key: 'research', dataKey: 'publications' as keyof PortfolioData },
    { path: '/contact', label: 'Contact', key: 'contact', alwaysShow: true },
    { path: '/music', label: 'Music', key: 'music', alwaysShow: true, dimmed: true },
    { path: '/misc', label: 'Misc', key: 'misc', alwaysShow: true, dimmed: true },
  ]

  const navItems = allNavItems
    .filter(item => {
      if (item.alwaysShow) return true
      if (item.dataKey) {
        const data = portfolioData[item.dataKey]
        return data && data.length > 0
      }
      return true
    })
    .map((item, index) => ({ ...item, number: index + 1 }))

  return (
    <>
      <button className="hamburger-button" onClick={toggleMenu} aria-label="Toggle menu">
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
      </button>

      {isMenuOpen && <div className="sidebar-overlay" onClick={closeMenu}></div>}

      <div className={`sidebar ${isMenuOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <Link to="/" className="sidebar-title-collapsed" onClick={closeMenu}>
            AP
          </Link>
          <Link to="/" className="sidebar-title" onClick={closeMenu}>
            <h1>Anushk</h1>
          </Link>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''} ${item.dimmed ? 'dimmed' : ''}`}
              onClick={closeMenu}
            >
              <span className="nav-number">{item.number}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button
            className="theme-toggle"
            onClick={toggleMode}
            aria-label={mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            title={mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            <span className="theme-toggle-icon">
              {mode === 'light' ? <FiMoon /> : <FiSun />}
            </span>
            <span className="theme-toggle-label">{mode === 'light' ? 'dark mode' : 'light mode'}</span>
          </button>
          <span className="footer-text">accent changes on reload</span>
        </div>
      </div>
    </>
  )
}

export default Sidebar
