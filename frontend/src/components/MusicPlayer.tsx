import { useState, useEffect, useRef } from 'react'
import { HiSpeakerWave, HiSpeakerXMark } from 'react-icons/hi2'
import './MusicPlayer.css'

interface MusicData {
  audioUrl: string
  artist: string
  songName: string
}

function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [musicData, setMusicData] = useState<MusicData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const hasSetInitialPosition = useRef(false)

  useEffect(() => {
    fetchMusic()
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.01
    }
  }, [musicData])

  const fetchMusic = async () => {
    try {
      const response = await fetch('/api/audio')
      if (!response.ok) {
        throw new Error('Failed to fetch music')
      }
      const data = await response.json()

      // Parse filename to extract artist and song name
      // Expected format: "Artist - Song Name.mp3"
      const filename = data.filename.replace('.mp3', '')
      const [artist, songName] = filename.split(' - ').map((s: string) => s.trim())

      setMusicData({
        audioUrl: `/api${data.url}`,
        artist: artist || 'Unknown Artist',
        songName: songName || filename
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load music')
      console.error('Error fetching music:', err)
    }
  }

  const setRandomStartPosition = () => {
    if (!audioRef.current || hasSetInitialPosition.current) return

    const duration = audioRef.current.duration
    if (isNaN(duration) || duration <= 0) return

    // Set random position between 25% and 75% of duration
    const minPosition = duration * 0.25
    const maxPosition = duration * 0.75
    const randomPosition = minPosition + Math.random() * (maxPosition - minPosition)
    audioRef.current.currentTime = randomPosition
    hasSetInitialPosition.current = true
  }

  const togglePlay = () => {
    if (!audioRef.current || !musicData) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      // Set random start position on first play only
      if (!hasSetInitialPosition.current) {
        const duration = audioRef.current.duration

        if (!isNaN(duration) && duration > 0) {
          setRandomStartPosition()
        } else {
          // Metadata not loaded yet, wait for it
          audioRef.current.addEventListener('loadedmetadata', setRandomStartPosition, { once: true })
        }
      }

      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  if (error || !musicData) {
    return null
  }

  return (
    <>
      <audio
        ref={audioRef}
        src={musicData.audioUrl}
        loop
        onEnded={() => setIsPlaying(false)}
      />
      <button
        className={`music-player-button ${isPlaying ? 'playing' : ''}`}
        onClick={togglePlay}
        title={`${musicData.artist} - ${musicData.songName}`}
      >
        <span className="music-info">
          <div className="music-artist">{musicData.artist}</div>
          <div className="music-song">{musicData.songName}</div>
        </span>
        <span className="music-icon-wrapper">
          {isPlaying ? (
            <HiSpeakerWave className="music-icon" />
          ) : (
            <HiSpeakerXMark className="music-icon" />
          )}
        </span>
      </button>
    </>
  )
}

export default MusicPlayer
