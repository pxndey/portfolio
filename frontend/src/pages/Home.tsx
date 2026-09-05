import './Home.css'
import { FaGithub, FaLinkedin, FaFileAlt } from 'react-icons/fa'
import ResumePDF from '../../Resume.pdf'

function Home() {
  return (
    <div className="home-container">
      <div className="home-terminal" aria-label="Terminal prompt">
        <div className="terminal-bar">
          <span className="terminal-dot red" />
          <span className="terminal-dot yellow" />
          <span className="terminal-dot green" />
          <span className="terminal-title">anushk@nyc ~ %</span>
        </div>
        <div className="terminal-body">
          <p className="terminal-line">
            <span className="terminal-prompt">$</span> whoami
          </p>
        </div>
      </div>

      <header className="home-hero">
        <h1 className="home-title">I build systems that make noisy data useful.</h1>
        <p className="home-subtitle">
          ML researcher and software engineer working across computer vision, neural data,
          and the infrastructure behind them.
        </p>
        <div className="home-meta">
          <span className="home-badge">MS CS @ NYU</span>
          <span className="home-badge home-badge-open">
            <span className="open-dot" aria-hidden="true" />
            seeking spring '27 internships + summer '27 roles
          </span>
        </div>
      </header>

      <blockquote className="home-quote">
        <div>
          It takes a long time to realize how truly miserable you are, and even longer to see that it doesn't have to be that way.
        </div>
        <div className="quote-author">— Cuddlywhiskers, Bojack Horseman</div>
      </blockquote>

      <p className="home-paragraph">
        I'm pursuing an M.S. in Computer Science at <mark>NYU</mark>, where I work in the
        Neuroinformatics Lab on <mark>self-supervised spike localization and drift correction</mark>.
        The work sits at the intersection of deep learning, computer vision, and neuroscience:
        finding structure in biological signals that are messy by nature.
      </p>

      <p className="home-paragraph">
        Outside the lab, I teach computer vision and build dependable software for real people.
        That includes a collaborative job tracker, the self-hosted infrastructure that keeps it
        running, and the occasional F1 side project. Before New York, I organized hackathons and
        science outreach in Vellore.
      </p>

      <div className="home-links">
        <a href="https://github.com/pxndey" target="_blank" rel="noopener noreferrer" className="social-link">
          <FaGithub />
          GitHub
        </a>
        <a href="https://www.linkedin.com/in/pandeyanushk/" target="_blank" rel="noopener noreferrer" className="social-link">
          <FaLinkedin />
          LinkedIn
        </a>
        <a href={ResumePDF} target="_blank" rel="noopener noreferrer" className="social-link">
          <FaFileAlt />
          Resume
        </a>
      </div>
    </div>
  )
}

export default Home
