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

  useEffect(() => {
    fetchMusic()
  }, [])

  const fetchMusic = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/music')
      if (!response.ok) {
        throw new Error('Failed to fetch music')
      }
      const data = await response.json()
      setMusicData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load music')
      console.error('Error fetching music:', err)
    }
  }

  const togglePlay = () => {
    if (!audioRef.current || !musicData) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
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
        className="music-player-button"
        onClick={togglePlay}
        title={`${musicData.artist} - ${musicData.songName}`}
      >
        {isPlaying ? (
          <HiSpeakerWave className="music-icon" />
        ) : (
          <HiSpeakerXMark className="music-icon" />
        )}
        <span className="music-tooltip">
          <div className="music-artist">{musicData.artist}</div>
          <div className="music-song">{musicData.songName}</div>
        </span>
      </button>
    </>
  )
}

export default MusicPlayer
