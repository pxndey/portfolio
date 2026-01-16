import React from 'react';
import './Education.css';

interface EducationData {
  institution: string;
  location: string;
  degree: string;
  marks: string;
  duration: string;
  coursework?: string[];
}

interface EducationProps {
  data: EducationData[];
}

const Education: React.FC<EducationProps> = ({ data }) => {
  return (
    <div className="education-container">
      {data.map((education, index) => (
        <div key={index} className="education-card">
          <div className="education-header">
            <h3 className="institution-name">{education.institution}</h3>
            <span className="edu-location">{education.location}</span>
          </div>
          <div className="education-details">
            <p className="degree">
              {education.degree} <span className="marks">| {education.marks}</span>
            </p>
            <span className="edu-duration">{education.duration}</span>
          </div>
          {education.coursework && education.coursework.length > 0 && (
            <div className="coursework-section">
              <h4 className="coursework-heading">Relevant Coursework</h4>
              <div className="coursework-list">
                {education.coursework.map((course, idx) => (
                  <span key={idx} className="course-item">{course}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Education;
