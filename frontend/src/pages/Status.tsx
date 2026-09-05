import './Status.css'
import { useEffect, useMemo, useState } from 'react'
import { FiRefreshCw, FiExternalLink } from 'react-icons/fi'

interface StatusItem {
  name: string
  url: string
}

interface ServiceStatus {
  name: string
  url: string
  up: boolean
  status: number
  latencyMS?: number
  error?: string
  checkedAt: string
}

interface StatusResponse {
  checkedAt: string
  services: ServiceStatus[]
}

interface StatusProps {
  portfolioData: {
    statusItems: StatusItem[]
  }
}

const REFRESH_INTERVAL_MS = 60_000

function Status({ portfolioData }: StatusProps) {
  const items = portfolioData.statusItems ?? []
  const [services, setServices] = useState<ServiceStatus[] | null>(null)
  const [lastCheckedAt, setLastCheckedAt] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const query = useMemo(
    () =>
      items
        .map((item) => `${encodeURIComponent(item.name)}|${encodeURIComponent(item.url)}`)
        .join(','),
    [items],
  )

  const fetchStatus = () => {
    setLoading(true)
    fetch(`/api/status?url=${encodeURIComponent(query)}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Status endpoint responded ${res.status}`)
        return res.json()
      })
      .then((data: StatusResponse) => {
        setServices(data.services)
        setLastCheckedAt(data.checkedAt)
        setError(null)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (!query) return
    fetchStatus()
    const interval = setInterval(fetchStatus, REFRESH_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [query])

  const upCount = services?.filter((s) => s.up).length ?? 0
  const total = services?.length ?? items.length
  const formatCheckedAt = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleString('en-US', {
      timeZone: 'America/New_York',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    })
  }

  return (
    <div className="status-page">
      <p className="page-eyebrow">Uptime</p>
      <h1>Status</h1>
      <p className="page-desc">
        Live check of the services running off the homelab. Each is probed from
        the backend every {REFRESH_INTERVAL_MS / 1000}s.
      </p>

      <div className="status-summary">
        <div className="status-summary-dot" data-live={upCount === total && total > 0} />
        <span className="status-summary-text">
          {loading && !services ? 'checking…' : `${upCount} / ${total} up`}
        </span>
      </div>

      {error && <p className="status-error">Status check failed: {error}</p>}

      <div className="status-list">
        {(services ?? items.map((i) => ({ name: i.name, url: i.url, up: false, status: 0, checkedAt: '' }))).map(
          (svc) => (
            <div key={svc.url} className="status-card">
              <span
                className="status-dot"
                data-state={svc.up ? 'live' : svc.status === 0 ? 'checking' : 'offline'}
                aria-hidden="true"
              />
              <div className="status-card-info">
                <div className="status-card-name">{svc.name}</div>
                <a
                  className="status-card-url"
                  href={svc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {svc.url.replace(/^https?:\/\//, '')}
                  <FiExternalLink size={11} />
                </a>
              </div>
              <div className="status-card-meta">
                {svc.error ? (
                  <span className="status-card-error">{svc.error}</span>
                ) : (
                  <>
                    <span className="status-card-latency">{svc.latencyMS ?? '—'} ms</span>
                    <span className="status-card-code">{svc.status || '…'}</span>
                  </>
                )}
              </div>
            </div>
          ),
        )}
      </div>

      <div className="status-footer">
        <span className="status-checked-at">
          last checked {lastCheckedAt ? formatCheckedAt(lastCheckedAt) : loading ? '…' : '—'}
        </span>
        <button className="status-refresh" onClick={fetchStatus} disabled={loading}>
          <FiRefreshCw className={loading ? 'spin' : ''} size={13} />
          refresh
        </button>
      </div>
    </div>
  )
}

export default Status