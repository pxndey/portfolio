import type { ReactNode } from 'react'
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
  tags?: string[]
  metrics?: { icon?: string; value: string; label: string }[]
  githubLink?: string
  liveLink?: string
  description: readonly string[]
  category: 'academic' | 'personal'
  art?: string
  featured?: boolean
}

interface ProjectsProps {
  portfolioData: {
    projects: readonly ProjectData[]
  }
}

function ProjectLinks({ project }: { project: ProjectData }) {
  const links: { href: string; label: string; icon: ReactNode }[] = []

  if (project.liveLink) {
    links.push({ href: project.liveLink, label: 'Live', icon: <FiLink /> })
  }
  if (project.githubLink) {
    links.push({ href: project.githubLink, label: 'GitHub', icon: <FaGithub /> })
  }

  if (!links.length) return null

  return (
    <ul className="project-links">
      {links.map((link) => (
        <li key={link.href}>
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="project-link"
          >
            {link.icon}
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  )
}

function FeaturedProject({ project }: { project: ProjectData }) {
  return (
    <TimelineItem
      when={project.duration.replace(' - ', '\n')}
      kind="project"
      art={project.art}
    >
      <h3 className="timeline-title">{project.projectName}</h3>
      <p className="timeline-meta">
        <span>{project.technologies}</span>
      </p>
      <div className="project-prose">
        {project.description.map((para) => (
          <p key={para}>{para}</p>
        ))}
      </div>
      <ProjectLinks project={project} />
    </TimelineItem>
  )
}

function MoreProject({ project }: { project: ProjectData }) {
  const blurb = project.description[0]

  return (
    <TimelineItem
      when={project.duration.replace(' - ', '\n')}
      kind="project"
      art={project.art}
    >
      <h3 className="timeline-title">{project.projectName}</h3>
      <p className="timeline-meta">
        <span>{project.technologies}</span>
      </p>
      {blurb ? <p className="project-more-blurb">{blurb}</p> : null}
      <ProjectLinks project={project} />
    </TimelineItem>
  )
}

function Projects({ portfolioData }: ProjectsProps) {
  const items = sortByDuration(portfolioData.projects, (project) => project.duration)
  const featured = items.filter((project) => project.featured)
  const more = items.filter((project) => !project.featured)

  return (
    <div className="projects-page">
      <p className="page-eyebrow">Selected work</p>
      <h1>Projects</h1>
      <p className="page-desc">
        A few things I've shipped. Some for{' '}
        <span className="legend-academic">class</span>, some for{' '}
        <span className="legend-personal">me</span>, at least two because of F1.
      </p>

      <Timeline>
        {featured.map((project) => (
          <FeaturedProject key={project.projectName} project={project} />
        ))}
      </Timeline>

      {more.length ? (
        <section className="projects-more" aria-labelledby="more-projects-heading">
          <h2 id="more-projects-heading" className="projects-more-heading">
            More projects
          </h2>
          <Timeline>
            {more.map((project) => (
              <MoreProject key={project.projectName} project={project} />
            ))}
          </Timeline>
        </section>
      ) : null}
    </div>
  )
}

export default Projects
