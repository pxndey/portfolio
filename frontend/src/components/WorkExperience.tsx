import React from 'react';
import './WorkExperience.css';

interface WorkExperienceData {
  company: string;
  location: string;
  role: string;
  duration: string;
  responsibilities: string[];
}

interface WorkExperienceProps {
  data: WorkExperienceData[];
}

const WorkExperience: React.FC<WorkExperienceProps> = ({ data }) => {
  return (
    <div className="work-experience-container">
      {data.map((experience, index) => (
        <div key={index} className="work-experience-card">
          <div className="work-header">
            <h3 className="company-name">{experience.company}</h3>
            <span className="location">{experience.location}</span>
          </div>
          <div className="work-details">
            <p className="role">{experience.role}</p>
            <span className="duration">{experience.duration}</span>
          </div>
          <ul className="responsibilities">
            {experience.responsibilities.map((responsibility, idx) => (
              <li key={idx}>{responsibility}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default WorkExperience;
