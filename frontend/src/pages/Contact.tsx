import './Contact.css'
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa'

function Contact() {
  return (
    <div className="contact-container">
      <h1 className="contact-title">Get in Touch</h1>

      <div className="contact-section">
        <h2 className="section-heading">Email</h2>
        <div className="email-list">
          <a href="mailto:anushkpandey@proton.me" className="email-link">
            anushkpandey@proton.me
          </a>
          <a href="mailto:anushk@pxndey.com" className="email-link">
            anushk@pxndey.com
          </a>
        </div>
      </div>

      <div className="contact-section">
        <h2 className="section-heading">Social</h2>
        <div className="social-list">
          <a
            href="https://github.com/pxndey"
            target="_blank"
            rel="noopener noreferrer"
            className="social-row"
          >
            <div className="social-icon">
              <FaGithub size={48} />
            </div>
            <div className="social-info">
              <div className="social-name">GitHub</div>
              <div className="social-username">@pxndey</div>
            </div>
          </a>

          <a
            href="https://www.linkedin.com/in/pandeyanushk/"
            target="_blank"
            rel="noopener noreferrer"
            className="social-row"
          >
            <div className="social-icon">
              <FaLinkedin size={48} />
            </div>
            <div className="social-info">
              <div className="social-name">LinkedIn</div>
              <div className="social-username">@pandeyanushk</div>
            </div>
          </a>

          <a
            href="https://twitter.com/pxndey"
            target="_blank"
            rel="noopener noreferrer"
            className="social-row"
          >
            <div className="social-icon">
              <FaTwitter size={48} />
            </div>
            <div className="social-info">
              <div className="social-name">Twitter</div>
              <div className="social-username">@pxndey</div>
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}

export default Contact
