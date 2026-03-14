import { useState, useEffect } from 'react'
import racesData from '../../races.json'
import './RaceSidebar.css'

interface Race {
  round: number
  name: string
  circuit: string
  datetime_utc: string
  status: string
  duration_hours?: number
}

type Countdown = { days: number; hours: number; minutes: number; seconds: number }

type RaceState =
  | { status: 'countdown'; race: Race; countdown: Countdown }
  | { status: 'live'; race: Race }
  | { status: 'done' }

const LIVE_WINDOW_MS = 3 * 60 * 60 * 1000

function computeRaceState(races: Race[]): RaceState {
  const now = Date.now()
  const active = races
    .filter(r => new Date(r.datetime_utc).getTime() + LIVE_WINDOW_MS > now)
    .sort((a, b) => new Date(a.datetime_utc).getTime() - new Date(b.datetime_utc).getTime())[0]

  if (!active) return { status: 'done' }

  const diff = new Date(active.datetime_utc).getTime() - now
  if (diff > 0) {
    return {
      status: 'countdown',
      race: active,
      countdown: {
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      },
    }
  }

  return { status: 'live', race: active }
}

function useRaceState(races: Race[]): RaceState {
  const [state, setState] = useState<RaceState>(() => computeRaceState(races))

  useEffect(() => {
    const id = setInterval(() => setState(computeRaceState(races)), 1000)
    return () => clearInterval(id)
  }, [races])

  return state
}

interface RaceCardProps {
  series: string
  races: Race[]
}

function RaceCard({ series, races }: RaceCardProps) {
  const state = useRaceState(races)

  if (state.status === 'done') {
    return (
      <div className="race-card">
        <div className="race-card-header">
          <span className="race-series">{series}</span>
        </div>
        <div className="race-card-no-race">Season complete</div>
      </div>
    )
  }

  const { race } = state

  return (
    <div className="race-card">
      <div className="race-card-header">
        <span className="race-series">{series}</span>
        <span className="race-round">R{race.round}</span>
      </div>
      <div className="race-name">{race.name}</div>
      <div className="race-circuit">{race.circuit}</div>
      {state.status === 'countdown' ? (
        <div className="race-countdown">
          <div className="countdown-row">
            <span className="countdown-value">{state.countdown.days}</span>
            <span className="countdown-label">d</span>
          </div>
          <div className="countdown-row">
            <span className="countdown-value">{state.countdown.hours}</span>
            <span className="countdown-label">h</span>
          </div>
          <div className="countdown-row">
            <span className="countdown-value">{state.countdown.minutes}</span>
            <span className="countdown-label">m</span>
          </div>
          <div className="countdown-row">
            <span className="countdown-value">{state.countdown.seconds}</span>
            <span className="countdown-label">s</span>
          </div>
        </div>
      ) : (
        <div className="race-live">
          <span className="live-dot" />
          LIVE NOW
        </div>
      )}
    </div>
  )
}

export default function RaceSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <aside className={`race-sidebar${mobileOpen ? ' race-sidebar--open' : ''}`}>
      <button
        className="race-sidebar-toggle"
        onClick={() => setMobileOpen(o => !o)}
        aria-expanded={mobileOpen}
        aria-label="Toggle upcoming races"
      >
        <span className="race-sidebar-title">UPCOMING RACES</span>
        <span className={`race-sidebar-chevron${mobileOpen ? ' race-sidebar-chevron--up' : ''}`}>›</span>
      </button>
      <div className="race-sidebar-cards">
        <RaceCard series="F1" races={racesData.f1 as Race[]} />
        <RaceCard series="MotoGP" races={racesData.motogp as Race[]} />
        <RaceCard series="WEC" races={racesData.wec as Race[]} />
      </div>
    </aside>
  )
}
