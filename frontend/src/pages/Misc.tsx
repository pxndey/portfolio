import './Misc.css'
import { useState } from 'react'

import omenImage from '../assets/server-images/Omen.jpeg'
import innovaImage from '../assets/server-images/new-innova.webp'
import camcorderImage from '../assets/server-images/baby.webp'

const gallery = [
  {
    src: omenImage,
    alt: 'A closed black HP Omen laptop covered in stickers, sitting on a desk with cables. This is the machine that hosts this site.',
  },
  {
    src: innovaImage,
    alt: 'A grey 2016 Toyota Innova Crysta parked on a dirt lot, with a No Peeking plate on the grille.',
  },
  {
    src: camcorderImage,
    alt: 'Me as a kid sitting in a garden, holding a camcorder up to my eye.',
  },
]

function Misc() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % gallery.length)
  }

  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + gallery.length) % gallery.length)
  }

  const goToImage = (index: number) => {
    setCurrentIndex(index)
  }

  const current = gallery[currentIndex]

  return (
    <div className="misc-container">
      <p className="page-eyebrow">Not the resume</p>
      <h1>Behind the Curtain</h1>
      <p className="page-desc">
        The laptop this runs on, the car I learned to drive in, and how cameras
        got me into computer vision.
      </p>

      <div className="server-section">
        <div className="server-image-container">
          <img
            src={current.src}
            alt={current.alt}
            className="server-image"
            loading="lazy"
            decoding="async"
          />

          {gallery.length > 1 && (
            <>
              <button onClick={prevImage} className="carousel-button carousel-button-prev" aria-label="Previous image">
                ‹
              </button>
              <button onClick={nextImage} className="carousel-button carousel-button-next" aria-label="Next image">
                ›
              </button>
              <div className="carousel-dots">
                {gallery.map((image, index) => (
                  <button
                    key={image.alt}
                    className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
                    onClick={() => goToImage(index)}
                    aria-label={`Show image ${index + 1}`}
                    aria-current={index === currentIndex ? 'true' : undefined}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="server-writeup">
          <p>
            I have a few things I affectionately call my "<mark>sh*tboxes</mark>", and this site is one of them.
            You're looking at it being served off the laptop that got me through undergrad, a <mark>2021 HP Omen</mark>.
          </p>

          <p>
            Another is my car, a 2016 <mark>Innova Crysta</mark> — the original sh*tbox. I learned to drive on it,
            and I had to leave it behind when I moved to the US. Before that I'd put more than{' '}
            <mark>1,600 kilometers on New Zealand roads</mark> and over <mark>1,200 miles in 2025 alone</mark>. (and 800 miles in 2026!)
          </p>

          <p>
            A lot of my hobbies rubbed off from my dad. He loved to drive. I'd sit on his lap in a Maruti 800
            listening to Pink Floyd CDs, and we'd walk around with cameras in hand.
          </p>

          <p>
            I've had a camera since I was six or seven (that's me with a camcorder I could barely hold.)
            It's also how I ended up in computer vision: these small boxes with a mirror inside can focus, capture,
            and tag birds, buildings, and skies. I still want to understand how they actually do that.
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
