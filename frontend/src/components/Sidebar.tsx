import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState, type ComponentType } from 'react'
import { flushSync } from 'react-dom'
import { FiActivity, FiGlobe, FiMoon, FiMusic, FiSun, FiTool } from 'react-icons/fi'
import './Sidebar.css'

interface PortfolioData {
  workExperience: any[]
  education: any[]
  publications: any[]
  projects: any[]
  toolGroups?: any[]
  statusItems?: any[]
}

interface SidebarProps {
  portfolioData: PortfolioData
}

interface NavItem {
  path: string
  label: string
  key: string
  alwaysShow?: boolean
  dimmed?: boolean
  dataKey?: keyof PortfolioData
  icon?: ComponentType
  number?: number
  shortcut?: string
}

function getInitialMode(): 'light' | 'dark' {
  const saved = localStorage.getItem('theme-mode')
  if (saved === 'light' || saved === 'dark') return saved
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

function Sidebar({ portfolioData }: SidebarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mode, setMode] = useState<'light' | 'dark'>(getInitialMode)
  const [showHelp, setShowHelp] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode)
    localStorage.setItem('theme-mode', mode)
  }, [mode])

  const toggleMode = () => {
    const next = mode === 'light' ? 'dark' : 'light'
    const doc = document as Document & {
      startViewTransition?: (callback: () => void) => unknown
    }
    if (doc.startViewTransition) {
      doc.startViewTransition(() => {
        document.documentElement.setAttribute('data-theme', next)
        flushSync(() => setMode(next))
      })
    } else {
      setMode(next)
    }
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const meNavItems: NavItem[] = [
    { path: '/', label: 'About Me', key: 'home', alwaysShow: true },
    { path: '/academics', label: 'Academics', key: 'academics', dataKey: 'education' },
    { path: '/experience', label: 'Experience', key: 'experience', dataKey: 'workExperience' },
    { path: '/projects', label: 'Projects', key: 'projects', dataKey: 'projects' },
    { path: '/research', label: 'Research', key: 'research', dataKey: 'publications' },
    { path: '/contact', label: 'Connect', key: 'contact', alwaysShow: true },
  ]

  const lifeNavItems: NavItem[] = [
    { path: '/tools', label: 'Tools', key: 'tools', dataKey: 'toolGroups', icon: FiTool },
    { path: '/status', label: 'Systems', key: 'status', dataKey: 'statusItems', icon: FiActivity },
    { path: '/music', label: 'Music', key: 'music', alwaysShow: true, dimmed: true, icon: FiMusic },
    { path: '/misc', label: 'Misc', key: 'misc', alwaysShow: true, dimmed: true, icon: FiGlobe },
  ]

  const filterItems = (items: NavItem[]) =>
    items.filter(item => {
      if (item.alwaysShow) return true
      if (item.dataKey) {
        const data = portfolioData[item.dataKey]
        return data && data.length > 0
      }
      return true
    })

  const meItems = filterItems(meNavItems).map((item, index) => ({
    ...item,
    number: index + 1,
    shortcut: ['a', 's', 'd', 'f', 'g', 'h'][index],
  }))
  const lifeItems = filterItems(lifeNavItems).map((item, index) => ({
    ...item,
    shortcut: ['j', 'k', 'l', ';'][index],
  }))

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return
      if (e.metaKey || e.ctrlKey || e.altKey) return

      if (e.key === '?') {
        e.preventDefault()
        setShowHelp((v) => !v)
        return
      }
      if (e.key === 'Escape') {
        setShowHelp(false)
        setIsMenuOpen(false)
        return
      }
      if (e.key.toLowerCase() === 't') {
        e.preventDefault()
        toggleMode()
        return
      }
      if (e.key.toLowerCase() === 'm') {
        setIsMenuOpen((v) => !v)
        return
      }

      const meKey = ['a', 's', 'd', 'f', 'g', 'h'].indexOf(e.key.toLowerCase())
      if (meKey !== -1 && meItems[meKey]) {
        navigate(meItems[meKey].path)
        return
      }

      const lifeKey = ['j', 'k', 'l', ';'].indexOf(e.key.toLowerCase())
      if (lifeKey !== -1 && lifeItems[lifeKey]) {
        navigate(lifeItems[lifeKey].path)
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [meItems, lifeItems, mode, navigate])

  const renderNavItem = (item: NavItem & { number?: number }) => {
    const Icon = item.icon
    return (
      <Link
        key={item.path}
        to={item.path}
        className={`nav-item ${location.pathname === item.path ? 'active' : ''} ${item.dimmed ? 'dimmed' : ''}`}
        onClick={closeMenu}
      >
        {Icon ? (
          <span className="nav-icon">
            <Icon aria-hidden="true" />
          </span>
        ) : (
          <span className="nav-number">{item.number}</span>
        )}
        <span className="nav-label">{item.label}</span>
        {item.shortcut && <kbd className="nav-shortcut" aria-hidden="true">{item.shortcut}</kbd>}
      </Link>
    )
  }

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
          <div className="nav-section">
            <span className="nav-section-label">Me:</span>
            {meItems.map(renderNavItem)}
          </div>

          <div className="nav-section nav-section-life">
            <span className="nav-section-label">My Life:</span>
            {lifeItems.map(renderNavItem)}
          </div>
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

      {showHelp && (
        <div className="kbd-help-overlay" role="dialog" aria-label="Keyboard shortcuts" onClick={() => setShowHelp(false)}>
          <div className="kbd-help" onClick={(e) => e.stopPropagation()}>
            <div className="kbd-help-header">
              <span>Keyboard shortcuts</span>
              <button className="kbd-help-close" onClick={() => setShowHelp(false)} aria-label="Close shortcuts">
                ×
              </button>
            </div>
            <div className="kbd-help-body">
              <div className="kbd-help-row">
                <span>Navigate pages</span>
                <span className="kbd-help-keys">
                  {meItems.map((item) => (
                    <kbd key={item.path}>{item.shortcut}</kbd>
                  ))}
                </span>
              </div>
              {lifeItems.filter((i) => i.shortcut).length > 0 && (
                <div className="kbd-help-row">
                  <span>Life pages</span>
                  <span className="kbd-help-keys">
                    {lifeItems
                      .filter((i) => i.shortcut)
                      .map((item) => (
                        <kbd key={item.path}>{item.shortcut}</kbd>
                      ))}
                  </span>
                </div>
              )}
              <div className="kbd-help-row">
                <span>Play / pause music</span>
                <span className="kbd-help-keys">
                  <kbd>p</kbd>
                </span>
              </div>
              <div className="kbd-help-row">
                <span>Toggle theme</span>
                <span className="kbd-help-keys">
                  <kbd>t</kbd>
                </span>
              </div>
              <div className="kbd-help-row">
                <span>Toggle menu (mobile)</span>
                <span className="kbd-help-keys">
                  <kbd>m</kbd>
                </span>
              </div>
              <div className="kbd-help-row">
                <span>Close overlay / menu</span>
                <span className="kbd-help-keys">
                  <kbd>esc</kbd>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Sidebar
