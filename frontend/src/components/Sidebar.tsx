import { Link, useLocation } from 'react-router-dom'
import './Sidebar.css'

function Sidebar() {
  const location = useLocation()

  const navItems = [
    { path: '/about', label: 'About', number: 1 },
    { path: '/academics', label: 'Academics', number: 2 },
    { path: '/experience', label: 'Experience', number: 3 },
    { path: '/contact', label: 'Contact', number: 4 },
    { path: '/music', label: 'Music', number: 5, dimmed: true },
    { path: '/misc', label: 'Misc', number: 6, dimmed: true },
  ]

  return (
    <div className="sidebar closed">
      <div className="sidebar-header">
        <Link to="/" className="sidebar-title-collapsed">
          <h1>AP</h1>
        </Link>
        <Link to="/" className="sidebar-title">
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
          >
            <span className="nav-number">{item.number}</span>
            <span className="nav-label">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}

export default Sidebar