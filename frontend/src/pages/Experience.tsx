import React from 'react';
import './Experience.css';

interface WorkExperienceData {
  company: string;
  location: string;
  role: string;
  duration: string;
  responsibilities: string[];
}

interface PortfolioData {
  workExperience: WorkExperienceData[];
  education: any[];
  publications: any[];
  projects: any[];
}

interface ExperienceProps {
  portfolioData: PortfolioData;
}

function Experience({ portfolioData }: ExperienceProps) {
  return (
    <div className="experience-page">
      <h1>Experience</h1>
      <div className="experience-list">
        {portfolioData.workExperience.map((work, index) => (
          <div key={index} className="experience-card">
            <div className="experience-card-header">
              <div className="experience-card-left">
                <h3 className="experience-company">{work.company}</h3>
                <p className="experience-role">{work.role}</p>
                <p className="experience-location">{work.location}</p>
              </div>
              <div className="experience-card-right">
                <span className="experience-duration">{work.duration}</span>
              </div>
            </div>
            <ul className="experience-responsibilities">
              {work.responsibilities.map((resp, idx) => (
                <li key={idx}>{resp}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Experience;
