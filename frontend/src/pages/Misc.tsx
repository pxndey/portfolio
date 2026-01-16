import './Misc.css'
import serverImage from '../assets/server.heic'

function Misc() {
  return (
    <div className="misc-container">
      <h1 className="misc-title">Behind the Curtain</h1>

      <div className="server-section">
        <div className="server-image-container">
          <img src={serverImage} alt="The Server" className="server-image" />
        </div>

        <div className="server-writeup">
          <p>
            Most people think <span className="highlight">"the cloud"</span> is some magical place where code lives.
            Plot twist: <span className="highlight">YOU</span> get to see the actual server! That MacBook Air above?
            It's hosting this portfolio right now. :)
          </p>

          <p className="ascii-art">¯\_(ツ)_/¯</p>

          <p>
            No fancy data center, no enterprise hardware—just a trusty old laptop that refuses to retire,
            running 24/7 (well, mostly) from my desk.
          </p>
        </div>

        <div className="other-services">
          <p className="services-title">Other stuff hosted on this:</p>
          <div className="services-links">
            <a href="https://social.pxndey.com" target="_blank" rel="noopener noreferrer" className="service-link">
              Mastodon
            </a>
            <a href="https://pixelfed.pxndey.com" target="_blank" rel="noopener noreferrer" className="service-link">
              Pixelfed
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Misc