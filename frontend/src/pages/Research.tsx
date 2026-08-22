import Publication from '../components/Publication'
import { sortByDuration } from '../lib/chrono'
import { Timeline, TimelineItem } from '../components/Timeline'
import './Research.css'

interface PublicationData {
  paperName: string
  journalName: string
  authors: string[]
  publicationYear: string
  doi: string
  highlights: string[]
  art?: string
}

interface ResearchProps {
  portfolioData: {
    publications: PublicationData[]
  }
}

function Research({ portfolioData }: ResearchProps) {
  const items = sortByDuration(
    portfolioData.publications,
    (publication) => publication.publicationYear,
  )

  return (
    <div className="research-page">
      <h1>Research</h1>
      <Timeline>
        {items.map((publication) => (
          <TimelineItem
            key={publication.paperName}
            when={publication.publicationYear}
            kind="research"
            art={publication.art}
          >
            <Publication publication={publication} />
          </TimelineItem>
        ))}
      </Timeline>
    </div>
  )
}

export default Research
