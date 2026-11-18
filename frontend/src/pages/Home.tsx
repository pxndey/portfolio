import './Home.css'
import { FaGithub, FaLinkedin, FaFileAlt } from 'react-icons/fa'
import ResumePDF from '../../Resume.pdf'

function Home() {
  return (
    <div className="home-container">
      <header className="home-hero">
        <h1 className="home-title">ML researcher &amp; software engineer.</h1>
        <p className="home-subtitle">
          Computer vision, neural data, and the infrastructure behind them.
        </p>
        <p className="home-meta">
          <span className="home-meta-item">MS CS @ NYU</span>
          <span className="home-meta-sep" aria-hidden="true">
            ·
          </span>
          <span className="home-meta-item home-meta-open">
            <span className="open-dot" aria-hidden="true" />
            looking for spring &apos;27 intern/ft and summer &apos;27 ft roles
          </span>
        </p>
      </header>

      <blockquote className="home-quote">
        <div>
          It takes a long time to realize how truly miserable you are, and even longer to see that it doesn't have to be that way.
        </div>
        <div className="quote-author">— Cuddlywhiskers, Bojack Horseman</div>
      </blockquote>

      <p className="home-paragraph">
        I'm pursuing an M.S. in Computer Science at NYU, where I work in the
        Neuroinformatics Lab on self-supervised spike localization and drift correction.
        The work sits at the intersection of deep learning, computer vision, and neuroscience:
        finding structure in biological signals that are messy by nature.
      </p>

      <p className="home-paragraph">
        Outside the lab, I teach computer vision and build software people actually use —
        a collaborative job tracker, the self-hosted stack that keeps it running, and the
        occasional F1 side project. Before New York, I organized hackathons and science
        outreach in Vellore.
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
