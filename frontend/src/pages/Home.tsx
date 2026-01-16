import './Home.css'
import { FaGithub, FaLinkedin, FaFileAlt } from 'react-icons/fa'

function Home() {
  return (
    <div className="home-container">
      <h1 className="home-title">Anushk Pandey</h1>

      <h2 className="home-subtitle">
        Software Engineer & Developer
      </h2>

      <blockquote className="home-quote">
        <div>
          It takes a long time to realize how truly miserable you are, and even longer to see that it doesn't have to be that way. Only after you give up everything can you begin to find a way to truly, be happy.
        </div>
        <div className="quote-author">
          - Cuddlywhiskers, Bojack Horseman
        </div>
      </blockquote>

      <br />

      <p className="home-paragraph">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
      </p>

      <p className="home-paragraph">
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt.
      </p>

      <p className="home-paragraph">
        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis.
      </p>

      <hr className="home-separator" />

      <div className="social-icons">
        <a
          href="https://github.com/pxndey"
          target="_blank"
          rel="noopener noreferrer"
          className="social-link"
        >
          <FaGithub size={40} />
        </a>

        <a
          href="https://www.linkedin.com/in/pandeyanushk/"
          target="_blank"
          rel="noopener noreferrer"
          className="social-link"
        >
          <FaLinkedin size={40} />
        </a>

        <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="social-link"
        >
          <FaFileAlt size={40} />
        </a>
      </div>
    </div>
  )
}

export default Home
