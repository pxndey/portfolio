import type { ReactNode } from 'react'
import { getTimelineArt } from '../assets/timeline'
import './Timeline.css'

export type TimelineKind = 'work' | 'project' | 'school' | 'research'

interface TimelineProps {
  children: ReactNode
}

interface TimelineItemProps {
  when: string
  kind?: TimelineKind
  art?: string
  category?: 'academic' | 'personal' | string
  children: ReactNode
}

export function Timeline({ children }: TimelineProps) {
  return <ol className="timeline">{children}</ol>
}

export function TimelineItem({ when, kind, art, category, children }: TimelineItemProps) {
  const mark = getTimelineArt(kind ? `mark-${kind}` : undefined)
  const illustration = getTimelineArt(art)

  return (
    <li className="timeline-item" data-kind={kind} data-art={art} data-category={category}>
      <p className="timeline-when">{when}</p>
      <div className="timeline-rail" aria-hidden="true">
        <span className="timeline-mark">
          {mark ? <img src={mark} alt="" /> : <span className="timeline-dot" />}
        </span>
      </div>
      <div className="timeline-main">
        <div className="timeline-body">{children}</div>
        {illustration ? <img className="timeline-art" src={illustration} alt="" /> : null}
      </div>
    </li>
  )
}
