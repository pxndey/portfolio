import React from 'react';
import './Projects.css';

interface ProjectData {
  projectName: string;
  technologies: string;
  role: string;
  duration: string;
  githubLink: string;
  description: string[];
  category: 'academic' | 'personal';
}

interface PortfolioData {
  workExperience: any[];
  education: any[];
  publications: any[];
  projects: ProjectData[];
}

interface ProjectsProps {
  portfolioData: PortfolioData;
}

function ProjectCard({ project }: { project: ProjectData }) {
  return (
    <div className="project-card">
      <div className="project-card-header">
        <h3>
          <a
            href={project.githubLink}
            target="_blank"
            rel="noopener noreferrer"
            className="project-link"
          >
            {project.projectName}
          </a>
        </h3>
        <span className="project-duration">{project.duration}</span>
      </div>
      <p className="project-tech">{project.technologies}</p>
      <ul className="project-description">
        {project.description.map((desc, idx) => (
          <li key={idx}>{desc}</li>
        ))}
      </ul>
    </div>
  );
}

function Projects({ portfolioData }: ProjectsProps) {
  const academicProjects = portfolioData.projects.filter(p => p.category === 'academic');
  const personalProjects = portfolioData.projects.filter(p => p.category === 'personal');

  return (
    <div className="projects-page">
      <h1>Projects</h1>

      {academicProjects.length > 0 && (
        <section className="projects-section">
          <div className="section-header">
            <h2 className="section-title">Academic</h2>
            <p className="section-subtitle">coursework and research</p>
          </div>
          <div className="projects-grid">
            {academicProjects.map((project, index) => (
              <ProjectCard key={index} project={project} />
            ))}
          </div>
        </section>
      )}

      {personalProjects.length > 0 && (
        <section className="projects-section">
          <div className="section-header">
            <h2 className="section-title">Personal</h2>
            <p className="section-subtitle">built for fun</p>
          </div>
          <div className="projects-grid">
            {personalProjects.map((project, index) => (
              <ProjectCard key={index} project={project} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default Projects;
