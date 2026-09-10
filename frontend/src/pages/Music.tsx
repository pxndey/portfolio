import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { FiDisc } from 'react-icons/fi'
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

interface ArtistChartPoint {
  fullName: string
  playcount: number
}

function ArtistTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: Array<{ payload: ArtistChartPoint }>
}) {
  if (!active || !payload?.length) return null
  const point = payload[0].payload
  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip-label">{point.fullName}</div>
      <div className="chart-tooltip-value">{point.playcount.toLocaleString()} plays</div>
    </div>
  )
}

function MusicHero({ href }: { href?: string }) {
  return (
    <>
      <p className="page-eyebrow">On repeat</p>
      <h1>
        {href ? (
          <a href={href} target="_blank" rel="noopener noreferrer" className="music-title-link">
            Music
          </a>
        ) : (
          'Music'
        )}
      </h1>
      <p className="page-desc">
        What I've been playing. Scrobbles, top artists, and whatever is on right now.
      </p>
    </>
  )
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
        <MusicHero />
        <p className="music-status">Loading scrobbles…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="music-container">
        <MusicHero />
        <p className="music-status">Could not load Last.fm: {error}</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="music-container">
        <MusicHero />
        <p className="music-status">No scrobble data yet.</p>
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

  // Last.fm recent tracks only return small/medium/large images, never index 3.
  // Grab the largest one that exists instead of assuming a fixed position.
  const albumArt = (mostRecentTrack?.image ?? [])
    .map((img) => img['#text'])
    .filter(Boolean)
    .pop()

  // Format date to Eastern Time
  const formatDateET = (utcTimestamp: string) => {
    const date = new Date(parseInt(utcTimestamp) * 1000)
    return date.toLocaleString('en-US', {
      timeZone: 'America/New_York',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  return (
    <div className="music-container">
      <MusicHero href={userInfo.url} />

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
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="name" hide />
              <YAxis stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)' }} />
              <Tooltip
                cursor={{ fill: 'var(--accent-muted)' }}
                content={<ArtistTooltip />}
              />
              <Bar dataKey="playcount" fill="var(--accent-color)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <div className="chart-header">
            <h2>{isNowPlaying ? 'Now Playing' : 'Last Played'}</h2>
            {isNowPlaying && (
              <div className="equalizer" aria-hidden="true">
                <span style={{ animationDelay: '0ms' }} />
                <span style={{ animationDelay: '150ms' }} />
                <span style={{ animationDelay: '300ms' }} />
                <span style={{ animationDelay: '450ms' }} />
              </div>
            )}
          </div>
          {mostRecentTrack && (
            <div className="now-playing-container">
              <a
                href={mostRecentTrack.url}
                target="_blank"
                rel="noopener noreferrer"
                className="album-art-link"
              >
                {albumArt ? (
                  <>
                    <img
                      src={albumArt}
                      alt=""
                      aria-hidden="true"
                      className="album-image-reflection"
                    />
                    <img
                      src={albumArt}
                      alt={mostRecentTrack.name}
                      className="album-image"
                    />
                  </>
                ) : (
                  <div className="album-art-fallback">
                    <FiDisc aria-hidden="true" />
                  </div>
                )}
              </a>
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
                <div className="track-detail-date">
                  {isNowPlaying
                    ? 'scrobbling now'
                    : mostRecentTrack.date
                      ? formatDateET(mostRecentTrack.date.uts)
                      : ''}
                </div>
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
