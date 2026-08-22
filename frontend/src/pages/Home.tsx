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
          <span className="terminal-title">anushk@nyu ~ %</span>
        </div>
        <div className="terminal-body">
          <p className="terminal-line">
            <span className="terminal-prompt">$</span> whoami
          </p>
          <p className="terminal-output">anushk pandey</p>
        </div>
      </div>

      <header className="home-hero">
        <div className="home-meta">
          <span className="home-badge">MS CS @ NYU</span>
          <span className="home-badge home-badge-open">
            <span className="open-dot" aria-hidden="true" />
            looking for spring '27 intern + summer '27 FTE
          </span>
        </div>
        <h1 className="home-title">i break prod — and i'm the one you call when someone else does.</h1>
        <p className="home-subtitle">Developer and researcher — vision models, neural recordings, and the machines they run on.</p>
      </header>

      <blockquote className="home-quote">
        <div>
          It takes a long time to realize how truly miserable you are, and even longer to see that it doesn't have to be that way. Only after you give up everything can you begin to find a way to truly, be happy.
        </div>
        <div className="quote-author">— Cuddlywhiskers, Bojack Horseman</div>
      </blockquote>

      <p className="home-paragraph">
        I grew up to dinner table conversations about melanomas and sarcomas and whatnot, so when I picked computer science I wanted it to do something. I am at <mark>NYU</mark> for a Masters in CS, working on <mark>computer vision</mark> and <mark>self-supervised localization in neural recordings</mark> — still in the business of trying to make sense of messy biological signal.
      </p>

      <p className="home-paragraph">
        I am a research assistant in the Neuroinformatics Lab, a TA for Computer Vision, and I ship software people actually use: a collaborative job tracker, a homelab that hosts it, and whatever F1-related thing I get distracted by. Before that I organized hackathons and science outreach back in Vellore.
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
