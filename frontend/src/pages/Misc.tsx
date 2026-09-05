import './Misc.css'
import { useState } from 'react'

// Import all server images - add more imports as you add images to the directory
import serverImage1 from '../assets/server-images/Omen.jpeg'
import innovaImage from '../assets/server-images/new-innova.webp'
import babyImage from '../assets/server-images/baby.webp'
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
                </>
              )}
            </>
          )}
        </div>

        <div className="server-writeup">
          <p>
        	I have a few things I affectionately call my "<mark>sh*tboxes</mark>", and this site is one of them. You're looking at it being served off the laptop that got me through undergrad, a <mark>2021 HP Omen</mark>.
          </p>

          <p>
            Another is my car, a 2016 <mark>Innova Crysta</mark> (the original sh*tbox). I learned to drive on it, and I had to say goodbye when I moved to the US. I've put in more than <mark>1,600 kilometers in New Zealand</mark> and over <mark>1,200 miles in 2025 alone</mark>.
          </p>

          <p>
           A lot of my hobbies rubbed off from my dad. He loved to drive. I'd sit on his lap in a Maruti 800 listening to Pink Floyd CDs, and we'd walk around with cameras in hand.
          </p>

          <p>
            I also love photography. I've had a camera in my hands since I was six or seven. It's actually what first got me into computer vision: these small boxes with a mirror inside can focus, capture, and tag birds, buildings, and skies. The inner workings of a camera are fascinating, and I want to read more about how they actually work.
          </p>
        </div>

        <div className="other-services">
          <p className="services-title">Other stuff</p>
          <div className="services-links">
            <a href="https://www.goodreads.com/user/show/184758087" target="_blank" rel="noopener noreferrer" className="service-link">
              Goodreads
            </a>
            <a href="https://letterboxd.com/pxndey/" target="_blank" rel="noopener noreferrer" className="service-link">
              Letterboxd
            </a>
            <a href="https://vsco.co/pxndey" target="_blank" rel="noopener noreferrer" className="service-link">
              VSCO
            </a>
            <a href="https://anilist.co/user/pxndey/" target="_blank" rel="noopener noreferrer" className="service-link">
              AniList
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Misc
