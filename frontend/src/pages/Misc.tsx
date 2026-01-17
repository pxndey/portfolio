import './Misc.css'
import { useState } from 'react'

// Import all server images - add more imports as you add images to the directory
import serverImage1 from '../assets/server-images/server-1.jpg'
import innovaImage from '../assets/server-images/Innova.jpg'
import babyImage from '../assets/server-images/baby.jpg'
// import serverImage2 from '../assets/server-images/server-2.jpg'
// import serverImage3 from '../assets/server-images/server-3.jpg'

const serverImages = [
  serverImage1,
  innovaImage,
  babyImage,
  // serverImage2,
  // serverImage3,
]

function Misc() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % serverImages.length)
  }

  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + serverImages.length) % serverImages.length)
  }

  const goToImage = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <div className="misc-container">
      <h1 className="misc-title">Behind the Curtain</h1>

      <div className="server-section">
        <div className="server-image-container">
          {serverImages.length > 0 && (
            <>
              <img src={serverImages[currentIndex]} alt={`Server ${currentIndex + 1}`} className="server-image" />

              {serverImages.length > 1 && (
                <>
                  <button onClick={prevImage} className="carousel-button carousel-button-prev" aria-label="Previous image">
                    ‹
                  </button>
                  <button onClick={nextImage} className="carousel-button carousel-button-next" aria-label="Next image">
                    ›
                  </button>

                  <div className="carousel-dots">
                    {serverImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToImage(index)}
                        className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
                        aria-label={`Go to image ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>

        <div className="server-writeup">
          <p>
        	In my life, there are a lot of things I affectionately call my "<span style={{ color: '#00A3E0' }}>sh*tboxes</span>", well one of them, is this! The site you're browsing is being served off a 2011 Macbook Air i got off Facebook Marketplace!
          </p>

          <p>
            Another is my car, the 2016 <span style={{ color: '#00A3E0' }}>Innova Crysta</span> (the original sh*tbox). I learnt driving on that car, and with a heavy heart I had to say it goodbye when I came to the US. I love driving, with having driven more than 1600 kilometers in New Zealand (that's 900 miles for all the freedom people) and more than 1200 miles in 2025 alone (in India ofcourse)!
          </p>

          <p>
           A lot of my hobbies have been rubbed off on me by my dad, who loved to drive, sitting on his lap in a Maruti 800 listening to Pink Floyd CDs, and walking around the world with cameras in hand.
          </p>

          <p>
            I also love photography, being seen with a camera since I was like six or seven. Photography has been sort of the original reason of my interest in Computer Vision, these small boxes with a mirror inside, are able to focus, capture, and tag birds, buildings, skies, and even people! The inner workings of a camera are really fascinating, and I plan on reading more about the technology soon :)
          </p>
        </div>

        <div className="other-services">
          <p className="services-title">Other stuff</p>
          <div className="services-links">
            <a href="https://pixelfed.pxndey.com" target="_blank" rel="noopener noreferrer" className="service-link">
              Pixelfed
            </a>
            <a href="https://www.goodreads.com/user/show/184758087" target="_blank" rel="noopener noreferrer" className="service-link">
              Goodreads
            </a>
            <a href="https://letterboxd.com/pxndey/" target="_blank" rel="noopener noreferrer" className="service-link">
              Letterboxd
            </a>
            <a href="https://vsco.co/pxndey" target="_blank" rel="noopener noreferrer" className="service-link">
              VSCO
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Misc
