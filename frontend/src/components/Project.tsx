import React from 'react';
import './Project.css';

interface ProjectData {
  projectName: string;
  technologies: string;
  role: string;
  duration: string;
  description: string[];
}

interface ProjectProps {
  data: ProjectData[];
}

const Project: React.FC<ProjectProps> = ({ data }) => {
  return (
    <div className="project-container">
      {data.map((project, index) => (
        <div key={index} className="project-card">
          <div className="project-header">
            <h3 className="project-name">{project.projectName}</h3>
            <span className="technologies">{project.technologies}</span>
          </div>
          <div className="project-details">
            <p className="project-role">{project.role}</p>
            <span className="project-duration">{project.duration}</span>
          </div>
          <ul className="description">
            {project.description.map((desc, idx) => (
              <li key={idx}>{desc}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Project;
