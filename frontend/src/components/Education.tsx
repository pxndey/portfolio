import React from 'react';
import './Education.css';

interface ExtracurricularActivity {
  organization: string;
  role: string;
  duration: string;
  details?: string[];
}

interface EducationData {
  institution: string;
  location: string;
  degree: string;
  marks: string;
  duration: string;
  coursework?: string[];
  extracurriculars?: ExtracurricularActivity[];
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
          {education.extracurriculars &&
           Array.isArray(education.extracurriculars) &&
           education.extracurriculars.length > 0 &&
           typeof education.extracurriculars[0] === 'object' &&
           education.extracurriculars[0] !== null && (
            <div className="extracurricular-section">
              <h4 className="extracurricular-heading">Extracurriculars</h4>
              <div className="extracurricular-timeline">
                {education.extracurriculars.map((activity, idx) => {
                  if (!activity || typeof activity !== 'object') return null;
                  return (
                    <div key={idx} className="extracurricular-item">
                      <div className="extracurricular-header">
                        <div className="extracurricular-title">
                          <span className="extracurricular-organization">{activity.organization || ''}</span>
                          <span className="extracurricular-role">{activity.role || ''}</span>
                        </div>
                        <span className="extracurricular-duration">{activity.duration || ''}</span>
                      </div>
                      {activity.details && Array.isArray(activity.details) && activity.details.length > 0 && (
                        <ul className="extracurricular-details">
                          {activity.details.map((detail, detailIdx) => (
                            <li key={detailIdx}>{detail}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Education;
