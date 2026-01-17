import './Home.css'
import { FaGithub, FaLinkedin, FaFileAlt } from 'react-icons/fa'
import ResumePDF from '../../Resume.pdf'

function Home() {
  return (
    <div className="home-container">
      <h1 className="home-title">Anushk Pandey</h1>
      <p className="home-subheading">CS @ NYU</p>

      <h2 className="home-subtitle">
      Developer & Researcher

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
      I grew up to dinner table conversations about melanomas and sarcomas and whatnot, so when I decided that Computer Science was the field i wanted to go to, I wanted to make an impact. Today, I am pursuing an Masters in Computer Science at New York University with a focus on Computer Vision, AI, and how healthcare can benefit from its applications. 
      </p>

      <p className="home-paragraph">
	I have coded, developed, and researched innovations in healthcare and vision models to take a step at (trying to) make life better for everyone. I have organized technical workshops, hackathons, and mentored outreach teams, conducting awareness programs for underprivileged high school students. 
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
          href={ResumePDF}
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
