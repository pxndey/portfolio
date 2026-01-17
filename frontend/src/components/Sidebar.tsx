import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
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

function Sidebar({ portfolioData }: SidebarProps) {
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const allNavItems = [
    { path: '/', label: 'About Me', key: 'home', alwaysShow: true },
    { path: '/academics', label: 'Academics', key: 'academics', dataKey: 'education' as keyof PortfolioData },
    { path: '/experience', label: 'Experience', key: 'experience', dataKey: 'projects' as keyof PortfolioData },
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
            <h1>AP</h1>
          </Link>
          <Link to="/" className="sidebar-title" onClick={closeMenu}>
            <h1>ANUSHK</h1>
          </Link>
        </div>

        <div className="progress-bar">
          <div className="progress-fill"></div>
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
          <span className="footer-text">theme changes on reload</span>
        </div>
      </div>
    </>
  )
}

export default Sidebar
