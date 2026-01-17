import React from 'react';
import './Project.css';

interface ProjectData {
  projectName: string;
  technologies: string;
  role: string;
  duration: string;
  githubLink: string;
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
          <h3 className="project-name">
            <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="project-link">
              {project.projectName}
            </a>
          </h3>
          <p className="technologies">{project.technologies}</p>
          <p className="project-duration">{project.duration}</p>
        </div>
      ))}
    </div>
  );
};

export default Project;
