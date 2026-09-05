import React from 'react'
import './Publication.css'

interface PublicationData {
  paperName: string
  journalName: string
  authors: string[]
  publicationYear: string
  doi: string
  highlights: string[]
}

interface PublicationProps {
  publication: PublicationData
}

function AuthorName({ name }: { name: string }) {
  if (name.endsWith('*')) {
    return (
      <span className="publication-author" title="Equal contribution">
        {name.slice(0, -1)}
        <sup className="publication-star">*</sup>
      </span>
    )
  }
  return <>{name}</>
}

const Publication: React.FC<PublicationProps> = ({ publication }) => {
  return (
    <div className="publication-entry">
      <h3 className="timeline-title">{publication.paperName}</h3>
      <p className="timeline-kicker">{publication.journalName}</p>
      <p className="timeline-meta">
        <span>
          {publication.authors.map((author, index) => (
            <React.Fragment key={author}>
              {index > 0 ? ', ' : ''}
              <AuthorName name={author} />
            </React.Fragment>
          ))}
        </span>
        {publication.doi ? <span>{publication.doi}</span> : null}
      </p>
      <ul className="timeline-bullets">
        {publication.highlights.map((highlight) => (
          <li key={highlight}>{highlight}</li>
        ))}
      </ul>
    </div>
  )
}

export default Publication
