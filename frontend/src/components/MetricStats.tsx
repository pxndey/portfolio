import type { ReactNode } from 'react'
import {
  FiActivity,
  FiCheckCircle,
  FiClock,
  FiCloud,
  FiCpu,
  FiDatabase,
  FiFileText,
  FiFlag,
  FiGrid,
  FiHardDrive,
  FiImage,
  FiLayers,
  FiMap,
  FiMic,
  FiServer,
  FiTarget,
  FiTrendingUp,
  FiUsers,
  FiVideo,
  FiZap,
} from 'react-icons/fi'
import './MetricStats.css'

export interface MetricData {
  icon?: string
  value: string
  label: string
}

const ICONS: Record<string, ReactNode> = {
  'trending-up': <FiTrendingUp />,
  'file-text': <FiFileText />,
  mic: <FiMic />,
  users: <FiUsers />,
  layers: <FiLayers />,
  cloud: <FiCloud />,
  zap: <FiZap />,
  map: <FiMap />,
  server: <FiServer />,
  database: <FiDatabase />,
  'hard-drive': <FiHardDrive />,
  clock: <FiClock />,
  flag: <FiFlag />,
  cpu: <FiCpu />,
  'check-circle': <FiCheckCircle />,
  target: <FiTarget />,
  image: <FiImage />,
  activity: <FiActivity />,
  grid: <FiGrid />,
  video: <FiVideo />,
}

export function MetricStats({ metrics }: { metrics: MetricData[] }) {
  if (!metrics?.length) return null

  return (
    <ul className="metric-stats">
      {metrics.map((metric) => (
        <li key={metric.label} className="metric-stat">
          <span className="metric-stat-icon" aria-hidden="true">
            {ICONS[metric.icon ?? ''] ?? <FiActivity />}
          </span>
          <span className="metric-stat-body">
            <span className="metric-stat-value">{metric.value}</span>
            <span className="metric-stat-label">{metric.label}</span>
          </span>
        </li>
      ))}
    </ul>
  )
}
