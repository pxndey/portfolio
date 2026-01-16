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


function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/academics" element={<Academics />} />
            <Route path="/experience" element={<Experience />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/research" element={<Research />} />
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
