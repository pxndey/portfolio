import './Contact.css'
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa'

function Contact() {
  return (
    <div className="contact-container">
      <p className="page-eyebrow">Two inboxes</p>
      <h1>Get in Touch</h1>
      <p className="page-desc">
        Based in New York. Professional inquiries to the NYU address, everything
        else to pxndey.com.
      </p>

      <div className="contact-section">
        <h2 className="section-heading">Email</h2>
        <div className="email-list">
          <a href="mailto:pandeyanushk@nyu.edu" className="email-link">
            <div className="email-icon">
              <FaEnvelope size={18} />
            </div>
            <div className="email-content">
              <div className="email-address">pandeyanushk@nyu.edu</div>
              <div className="email-description">Professional inquiries</div>
            </div>
          </a>
          <a href="mailto:anushk@pxndey.com" className="email-link">
            <div className="email-icon">
              <FaEnvelope size={18} />
            </div>
            <div className="email-content">
              <div className="email-address">anushk@pxndey.com</div>
              <div className="email-description">Personal inbox</div>
            </div>
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
              <FaGithub size={22} />
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
              <FaLinkedin size={22} />
            </div>
            <div className="social-info">
              <div className="social-name">LinkedIn</div>
              <div className="social-username">@pandeyanushk</div>
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}

export default Contact
