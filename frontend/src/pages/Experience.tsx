import React from 'react'
import { sortByDuration } from '../lib/chrono'
import { Timeline, TimelineItem } from '../components/Timeline'
import { MetricStats, MetricData } from '../components/MetricStats'
import './Experience.css'

type Responsibility = string | { name: string; text: string }

interface WorkExperienceData {
  company: string
  location: string
  role: string
  duration: string
  metrics?: MetricData[]
  responsibilities: Responsibility[]
  art?: string
}

interface ExperienceProps {
  portfolioData: {
    workExperience: WorkExperienceData[]
  }
}

function ResponsibilityBullet({ resp }: { resp: Responsibility }) {
  if (typeof resp === 'string') {
    return <>{resp}</>
  }

  return (
    <>
      <strong className="bullet-name">{resp.name}</strong> / {resp.text}
    </>
  )
}

function Experience({ portfolioData }: ExperienceProps) {
  const items = sortByDuration(portfolioData.workExperience, (work) => work.duration)

  return (
    <div className="experience-page">
      <p className="page-eyebrow">Work</p>
      <h1>Experience</h1>
      <p className="page-desc">
        Research and engineering roles, mostly in neural recordings and
        computer vision.
      </p>
      <Timeline>
        {items.map((work) => (
          <TimelineItem
            key={`${work.company}-${work.duration}`}
            when={work.duration.replace(' - ', '\n')}
            kind="work"
            art={work.art}
          >
            <h3 className="timeline-title">{work.role}</h3>
            <p className="timeline-kicker">{work.company}</p>
            <p className="timeline-meta">{work.location}</p>
            <MetricStats metrics={work.metrics ?? []} />
            <ul className="timeline-bullets">
              {work.responsibilities.map((resp, i) => (
                <li key={i}>
                  <ResponsibilityBullet resp={resp} />
                </li>
              ))}
            </ul>
          </TimelineItem>
        ))}
      </Timeline>
    </div>
  )
}

export default Experience
