import { useState, useEffect, useMemo, memo } from 'react'
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

type RaceState =
  | { status: 'countdown'; race: Race; target: number }
  | { status: 'live'; race: Race }
  | { status: 'done' }

const LIVE_WINDOW_MS = 3 * 60 * 60 * 1000
// Full state (which race / live / done) only needs periodic re-checks;
// the *countdown numbers* tick in a separate leaf component so nothing else re-renders.
const RECHECK_INTERVAL_MS = 60 * 1000

function computeRaceState(races: Race[]): RaceState {
  const now = Date.now()
  const active = races
    .filter(r => new Date(r.datetime_utc).getTime() + LIVE_WINDOW_MS > now)
    .sort((a, b) => new Date(a.datetime_utc).getTime() - new Date(b.datetime_utc).getTime())[0]

  if (!active) return { status: 'done' }

  const target = new Date(active.datetime_utc).getTime()
  if (target > now) {
    return { status: 'countdown', race: active, target }
  }

  return { status: 'live', race: active }
}

function useRaceState(races: Race[]): RaceState {
  const [state, setState] = useState<RaceState>(() => computeRaceState(races))

  // Only re-evaluate the overall race state every minute (live/done transitions);
  // the per-second ticking happens inside <Countdown>, not here.
  useEffect(() => {
    const id = setInterval(() => setState(computeRaceState(races)), RECHECK_INTERVAL_MS)
    return () => clearInterval(id)
  }, [races])

  return state
}

// Leaf component that owns the 1s timer so re-rendering is scoped to the numbers only.
function Countdown({ target }: { target: number }) {
  const [nowMs, setNowMs] = useState<number>(() => Date.now())

  useEffect(() => {
    const id = setInterval(() => setNowMs(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const countdown = useMemo(() => {
    const diff = target - nowMs
    if (diff <= 0) return null
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    }
  }, [target, nowMs])

  if (!countdown) {
    return (
      <div className="race-live">
        <span className="live-dot" />
        LIVE NOW
      </div>
    )
  }

  return (
    <div className="race-countdown">
      {(['days', 'hours', 'minutes', 'seconds'] as const).map((unit) => (
        <div key={unit} className="countdown-unit">
          <span className="countdown-value">{String(countdown[unit]).padStart(unit === 'days' ? 1 : 2, '0')}</span>
          <span className="countdown-label">{unit[0]}</span>
        </div>
      ))}
    </div>
  )
}

interface RaceCardProps {
  series: string
  races: Race[]
}

const RaceCard = memo(function RaceCard({ series, races }: RaceCardProps) {
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
        <Countdown target={state.target} />
      ) : (
        <div className="race-live">
          <span className="live-dot" />
          LIVE NOW
        </div>
      )}
    </div>
  )
})

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
        <span className="race-sidebar-title">Upcoming Races</span>
        <span className={`race-sidebar-chevron${mobileOpen ? ' race-sidebar-chevron--up' : ''}`}>›</span>
      </button>
      <p className="race-sidebar-title race-sidebar-title--desktop">Upcoming Races</p>
      <div className="race-sidebar-cards">
        <RaceCard series="F1" races={racesData.f1 as Race[]} />
        <RaceCard series="MotoGP" races={racesData.motogp as Race[]} />
        <RaceCard series="WEC" races={racesData.wec as Race[]} />
      </div>
    </aside>
  )
}