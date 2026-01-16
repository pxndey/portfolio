import { useState, useEffect } from 'react'

interface Track {
  rank: string
  artist: string
  artistMbid: string
  name: string
  mbid: string
  playcount: string
  url: string
}

interface LastFmData {
  user: string
  from: string
  to: string
  tracks: Track[]
}

function Music() {
  const [data, setData] = useState<LastFmData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchLastFmData()
  }, [])

  const fetchLastFmData = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/lastfm')
      if (!response.ok) {
        throw new Error('Failed to fetch Last.fm data')
      }
      const xmlText = await response.text()
      const parsedData = parseLastFmXml(xmlText)
      setData(parsedData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load music data')
      console.error('Error fetching Last.fm data:', err)
    } finally {
      setLoading(false)
    }
  }

  const parseLastFmXml = (xmlText: string): LastFmData => {
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml')

    const chartElement = xmlDoc.querySelector('weeklytrackchart')
    const user = chartElement?.getAttribute('user') || ''
    const from = chartElement?.getAttribute('from') || ''
    const to = chartElement?.getAttribute('to') || ''

    const trackElements = xmlDoc.querySelectorAll('track')
    const tracks: Track[] = Array.from(trackElements).map(track => ({
      rank: track.getAttribute('rank') || '',
      artist: track.querySelector('artist')?.textContent || '',
      artistMbid: track.querySelector('artist')?.getAttribute('mbid') || '',
      name: track.querySelector('name')?.textContent || '',
      mbid: track.querySelector('mbid')?.textContent || '',
      playcount: track.querySelector('playcount')?.textContent || '',
      url: track.querySelector('url')?.textContent || ''
    }))

    return { user, from, to, tracks }
  }

  if (loading) {
    return (
      <div>
        <h1>Music</h1>
        <p>Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <h1>Music</h1>
        <p>Error: {error}</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div>
        <h1>Music</h1>
        <p>No data available</p>
      </div>
    )
  }

  return (
    <div>
      <h1>Music</h1>
      <h2>Weekly Track Chart for {data.user}</h2>
      <p>From: {new Date(parseInt(data.from) * 1000).toLocaleDateString()} - To: {new Date(parseInt(data.to) * 1000).toLocaleDateString()}</p>

      <div>
        {data.tracks.map((track) => (
          <div key={`${track.rank}-${track.name}`} style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
            <div><strong>#{track.rank}</strong></div>
            <div><strong>{track.name}</strong></div>
            <div>Artist: {track.artist}</div>
            <div>Play count: {track.playcount}</div>
            <div>
              <a href={track.url} target="_blank" rel="noopener noreferrer">
                View on Last.fm
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Music