import React from 'react'
import { sortByDuration } from '../lib/chrono'
import { Timeline, TimelineItem } from '../components/Timeline'
import './Experience.css'

interface WorkExperienceData {
  company: string
  location: string
  role: string
  duration: string
  responsibilities: string[]
  art?: string
}

interface ExperienceProps {
  portfolioData: {
    workExperience: WorkExperienceData[]
  }
}

function Experience({ portfolioData }: ExperienceProps) {
  const items = sortByDuration(portfolioData.workExperience, (work) => work.duration)

  return (
    <div className="experience-page">
      <h1>Experience</h1>
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
            <ul className="timeline-bullets">
              {work.responsibilities.map((resp) => (
                <li key={resp}>{resp}</li>
              ))}
            </ul>
          </TimelineItem>
        ))}
      </Timeline>
    </div>
  )
}

export default Experience
