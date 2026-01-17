import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import './Music.css'

interface Artist {
  name: string
  playcount: string
  url: string
}

interface RecentTrack {
  name: string
  artist: {
    '#text': string
    mbid: string
  }
  album: {
    '#text': string
    mbid: string
  }
  url: string
  date?: {
    uts: string
    '#text': string
  }
  '@attr'?: {
    nowplaying: string
  }
  image?: Array<{
    '#text': string
    size: string
  }>
}

interface Track {
  name: string
  playcount: string
  artist: {
    name: string
  }
  url: string
}

interface UserInfo {
  playcount: string
  artist_count: string
  album_count: string
  track_count: string
  url: string
  name: string
}

interface MusicData {
  userInfo: {
    user: UserInfo
  }
  topArtists: {
    topartists: {
      artist: Artist[]
    }
  }
  recentTracks: {
    recenttracks: {
      track: RecentTrack[]
    }
  }
  topTracks: {
    toptracks: {
      track: Track[]
    }
  }
}

function Music() {
  const [data, setData] = useState<MusicData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchMusicData()
  }, [])

  const fetchMusicData = async () => {
    try {
      const response = await fetch('/api/music')
      if (!response.ok) {
        throw new Error('Failed to fetch music data')
      }
      const jsonData = await response.json()
      setData(jsonData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load music data')
      console.error('Error fetching music data:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="music-container">
        <h1>Music</h1>
        <p>Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="music-container">
        <h1>Music</h1>
        <p>Error: {error}</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="music-container">
        <h1>Music</h1>
        <p>No data available</p>
      </div>
    )
  }

  const userInfo = data.userInfo.user
  const artists = Array.isArray(data.topArtists.topartists.artist)
    ? data.topArtists.topartists.artist
    : [data.topArtists.topartists.artist]
  const recentTracksData = Array.isArray(data.recentTracks.recenttracks.track)
    ? data.recentTracks.recenttracks.track
    : [data.recentTracks.recenttracks.track]
  const tracks = Array.isArray(data.topTracks.toptracks.track)
    ? data.topTracks.toptracks.track
    : [data.topTracks.toptracks.track]

  // Prepare chart data
  const artistChartData = artists.slice(0, 10).map(artist => ({
    name: artist.name.length > 15 ? artist.name.substring(0, 15) + '...' : artist.name,
    fullName: artist.name,
    playcount: parseInt(artist.playcount)
  }))

  // Get the most recent track
  const mostRecentTrack = recentTracksData[0]
  const isNowPlaying = mostRecentTrack?.['@attr']?.nowplaying === 'true'
  const isRecentlyPlayed = mostRecentTrack?.date
    ? (Date.now() / 1000 - parseInt(mostRecentTrack.date.uts)) < 180 // Less than 3 minutes (180 seconds)
    : false

  return (
    <div className="music-container">
      <h1>
        <a href={userInfo.url} target="_blank" rel="noopener noreferrer" className="music-title-link">
          Music
        </a>
      </h1>

      {/* Stats Row */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-value">{parseInt(userInfo.playcount).toLocaleString()}</div>
          <div className="stat-label">Scrobbles</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{parseInt(userInfo.artist_count).toLocaleString()}</div>
          <div className="stat-label">Artists</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{parseInt(userInfo.album_count).toLocaleString()}</div>
          <div className="stat-label">Albums</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{parseInt(userInfo.track_count).toLocaleString()}</div>
          <div className="stat-label">Tracks</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="charts-row">
        <div className="chart-container">
          <h2>Top Artists (All Time)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={artistChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="name" hide />
              <YAxis stroke="#888" tick={{ fill: '#888' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#2a2a2a', border: '1px solid #444', borderRadius: '4px' }}
                labelStyle={{ color: '#e0e0e0' }}
                itemStyle={{ color: '#e0e0e0' }}
                labelFormatter={(label: string, payload: any[]) => {
                  if (payload && payload.length > 0) {
                    return payload[0].payload.fullName
                  }
                  return label
                }}
                formatter={(value: number) => [value.toLocaleString(), '']}
              />
              <Bar dataKey="playcount" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h2>{isNowPlaying || isRecentlyPlayed ? 'Now Playing' : 'Last Played'}</h2>
          {mostRecentTrack && (
            <div className="now-playing-container">
              {mostRecentTrack.image && mostRecentTrack.image[3] && (
                <img
                  src={mostRecentTrack.image[3]['#text']}
                  alt={mostRecentTrack.name}
                  className="album-image"
                />
              )}
              <div className="track-details">
                <a
                  href={mostRecentTrack.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="track-detail-link"
                >
                  {mostRecentTrack.name}
                </a>
                <div className="track-detail-artist">
                  {mostRecentTrack.artist['#text']}
                </div>
                {mostRecentTrack.album['#text'] && (
                  <div className="track-detail-album">
                    {mostRecentTrack.album['#text']}
                  </div>
                )}
                {!isNowPlaying && mostRecentTrack.date && (
                  <div className="track-detail-date">
                    {mostRecentTrack.date['#text']}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Top Tracks Row */}
      <h2 className="top-tracks-header">Top Tracks</h2>
      <div className="tracks-row">
        <div className="tracks-column">
          {tracks.slice(0, 5).map((track, index) => (
            <div key={index} className="track-item">
              <div className="track-rank">#{index + 1}</div>
              <div className="track-info">
                <a href={track.url} target="_blank" rel="noopener noreferrer" className="track-name">
                  {track.name}
                </a>
                <div className="track-artist">{track.artist.name}</div>
              </div>
              <div className="track-playcount">{track.playcount} plays</div>
            </div>
          ))}
        </div>

        <div className="tracks-column">
          {tracks.slice(5, 10).map((track, index) => (
            <div key={index} className="track-item">
              <div className="track-rank">#{index + 6}</div>
              <div className="track-info">
                <a href={track.url} target="_blank" rel="noopener noreferrer" className="track-name">
                  {track.name}
                </a>
                <div className="track-artist">{track.artist.name}</div>
              </div>
              <div className="track-playcount">{track.playcount} plays</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Music
