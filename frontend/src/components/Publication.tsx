import React from 'react';
import './Publication.css';

interface PublicationData {
  paperName: string;
  journalName: string;
  authors: string[];
  publicationYear: string;
  doi: string;
  highlights: string[];
}

interface PublicationProps {
  data: PublicationData[];
}

const Publication: React.FC<PublicationProps> = ({ data }) => {
  return (
    <div className="publication-container">
      {data.map((publication, index) => (
        <div key={index} className="publication-card">
          <div className="publication-header">
            <h3 className="paper-name">{publication.paperName}</h3>
            <span className="journal-name">{publication.journalName}</span>
          </div>
          <div className="publication-meta">
            <p className="authors">{publication.authors.join(', ')}</p>
            <div className="publication-year-doi">
              <span className="publication-year">{publication.publicationYear}</span>
              <span className="doi">{publication.doi}</span>
            </div>
          </div>
          <ul className="highlights">
            {publication.highlights.map((highlight, idx) => (
              <li key={idx}>{highlight}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Publication;
