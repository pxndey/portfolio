import React from 'react'
import { FaGithub } from 'react-icons/fa'
import { FiLink } from 'react-icons/fi'
import { sortByDuration } from '../lib/chrono'
import { Timeline, TimelineItem } from '../components/Timeline'
import './Projects.css'

interface ProjectData {
  projectName: string
  technologies: string
  role: string
  duration: string
  githubLink?: string
  liveLink?: string
  description: string[]
  category: 'academic' | 'personal'
  art?: string
}

interface ProjectsProps {
  portfolioData: {
    projects: ProjectData[]
  }
}

function ProjectLinks({ project }: { project: ProjectData }) {
  if (project.liveLink) {
    return (
      <a
        href={project.liveLink}
        target="_blank"
        rel="noopener noreferrer"
        className="project-icon-link"
        aria-label={`Open ${project.projectName}`}
      >
        <FiLink />
      </a>
    )
  }

  if (project.githubLink) {
    return (
      <a
        href={project.githubLink}
        target="_blank"
        rel="noopener noreferrer"
        className="project-icon-link"
        aria-label={`${project.projectName} on GitHub`}
      >
        <FaGithub />
      </a>
    )
  }

  return null
}

function Projects({ portfolioData }: ProjectsProps) {
  const items = sortByDuration(portfolioData.projects, (project) => project.duration)

  return (
    <div className="projects-page">
      <p className="page-eyebrow">Selected work</p>
      <h1>Projects</h1>
      <p className="page-desc">
        A few things I've shipped. Some for class, some for me, at least two
        because of F1.
      </p>
      <Timeline>
        {items.map((project) => (
          <TimelineItem
            key={project.projectName}
            when={project.duration.replace(' - ', '\n')}
            kind="project"
            art={project.art}
            category={project.category}
          >
            <div className="project-heading">
              <h3 className="timeline-title">{project.projectName}</h3>
              <ProjectLinks project={project} />
            </div>
            <p className="timeline-meta">
              <span>{project.technologies}</span>
            </p>
            <ul className="timeline-bullets">
              {project.description.map((desc) => (
                <li key={desc}>{desc}</li>
              ))}
            </ul>
          </TimelineItem>
        ))}
      </Timeline>
    </div>
  )
}

export default Projects
