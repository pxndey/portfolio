import type { ReactNode } from 'react'
import { FaGithub } from 'react-icons/fa'
import { FiLink } from 'react-icons/fi'
import { sortByDuration } from '../lib/chrono'
import { getTimelineArt } from '../assets/timeline'
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
  const art = getTimelineArt(project.art)

  return (
    <article className="project-featured" data-category={project.category}>
      <div className="project-featured-body">
        <header className="project-header">
          <h2 className="project-title">{project.projectName}</h2>
          <time className="project-when">{project.duration}</time>
        </header>
        <div className="project-prose">
          {project.description.map((para) => (
            <p key={para}>{para}</p>
          ))}
        </div>
        <p className="project-tech">{project.technologies}</p>
        <ProjectLinks project={project} />
      </div>
      {art ? <img className="project-art" src={art} alt="" /> : null}
    </article>
  )
}

function MoreProject({ project }: { project: ProjectData }) {
  const blurb = project.description[0]

  return (
    <li className="project-more-item" data-category={project.category}>
      <div className="project-more-header">
        <h3 className="project-more-title">{project.projectName}</h3>
        <time className="project-when">{project.duration}</time>
      </div>
      {blurb ? <p className="project-more-blurb">{blurb}</p> : null}
      <div className="project-more-meta">
        <span className="project-tech">{project.technologies}</span>
        <ProjectLinks project={project} />
      </div>
    </li>
  )
}

function Projects({ portfolioData }: ProjectsProps) {
  const items = sortByDuration(portfolioData.projects, (project) => project.duration)
  const featured = items.filter((project) => project.featured)
  const more = items.filter((project) => !project.featured)

  return (
    <div className="projects-page">
      <h1>Projects</h1>
      <p className="page-desc">
        A few things I've shipped. Some for{' '}
        <span className="legend-academic">class</span>, some for{' '}
        <span className="legend-personal">me</span>, at least two because of F1.
      </p>

      <section className="projects-featured" aria-label="Featured projects">
        {featured.map((project) => (
          <FeaturedProject key={project.projectName} project={project} />
        ))}
      </section>

      {more.length ? (
        <section className="projects-more" aria-labelledby="more-projects-heading">
          <h2 id="more-projects-heading" className="projects-more-heading">
            More projects
          </h2>
          <ul className="projects-more-list">
            {more.map((project) => (
              <MoreProject key={project.projectName} project={project} />
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  )
}

export default Projects
