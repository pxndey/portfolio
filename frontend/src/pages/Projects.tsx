import React, { useMemo } from 'react';
import './Projects.css';

interface ProjectData {
  projectName: string;
  technologies: string;
  role: string;
  duration: string;
  githubLink: string;
  description: string[];
}

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
  projects: ProjectData[];
}

interface ProjectsProps {
  portfolioData: PortfolioData;
}

interface TimelineItem {
  type: 'work' | 'project';
  date: Date;
  dateString: string;
  year: number;
  data: WorkExperienceData | ProjectData;
}

// Parse date from duration string
function parseDateFromDuration(duration: string): Date {
  // Extract year and month from strings like "Dec 2025", "Jan 2025 - Jul 2025", "Nov 2024"
  const monthMap: { [key: string]: number } = {
    'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'may': 4, 'jun': 5,
    'jul': 6, 'aug': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dec': 11
  };

  // Get the most recent date (first date in range or single date)
  const parts = duration.toLowerCase().split('-')[0].trim().split(' ');
  const month = monthMap[parts[0]] || 0;
  const year = parseInt(parts[1]) || new Date().getFullYear();

  return new Date(year, month);
}

function Projects({ portfolioData }: ProjectsProps) {
  const timelineItems = useMemo(() => {
    const items: TimelineItem[] = [];

    // Add work experience items
    portfolioData.workExperience.forEach((work) => {
      items.push({
        type: 'work',
        date: parseDateFromDuration(work.duration),
        dateString: work.duration,
        year: parseDateFromDuration(work.duration).getFullYear(),
        data: work
      });
    });

    // Add project items
    portfolioData.projects.forEach((project) => {
      items.push({
        type: 'project',
        date: parseDateFromDuration(project.duration),
        dateString: project.duration,
        year: parseDateFromDuration(project.duration).getFullYear(),
        data: project
      });
    });

    // Sort by date (newest first)
    return items.sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [portfolioData]);

  // Group by year for year markers
  const itemsByYear = useMemo(() => {
    const grouped: { [year: number]: TimelineItem[] } = {};
    timelineItems.forEach(item => {
      if (!grouped[item.year]) {
        grouped[item.year] = [];
      }
      grouped[item.year].push(item);
    });
    return grouped;
  }, [timelineItems]);

  const years = Object.keys(itemsByYear).map(Number).sort((a, b) => b - a);

  // Separate work and projects by year
  const getItemsByType = (year: number, type: 'work' | 'project') => {
    return itemsByYear[year]?.filter(item => item.type === type) || [];
  };

  return (
    <div className="projects-page">
      <h1>Experience & Projects</h1>
      <div className="timeline-wrapper">
        <div className="timeline-line"></div>

        {years.map((year) => {
          const workItems = getItemsByType(year, 'work');
          const projectItems = getItemsByType(year, 'project');

          return (
            <div key={year} className="year-section">
              <div className="year-marker">
                <span className="year-label">{year}</span>
              </div>

              <div className="year-content">
                <div className="column left-column">
                  {workItems.map((item, index) => (
                    <div key={`work-${index}`} className="work-card">
                      <div className="card-header">
                        <h3>{(item.data as WorkExperienceData).company}</h3>
                        <span className="type-badge work-badge">Experience</span>
                      </div>
                      <p className="card-role">{(item.data as WorkExperienceData).role}</p>
                      <p className="card-location">{(item.data as WorkExperienceData).location}</p>
                      <p className="card-duration">{item.dateString}</p>
                      <ul className="card-list">
                        {(item.data as WorkExperienceData).responsibilities.map((resp, idx) => (
                          <li key={idx}>{resp}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="timeline-center">
                  <div className="timeline-dot"></div>
                </div>

                <div className="column right-column">
                  {projectItems.map((item, index) => (
                    <div key={`project-${index}`} className="project-card">
                      <div className="card-header">
                        <h3>
                          <a
                            href={(item.data as ProjectData).githubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="project-link"
                          >
                            {(item.data as ProjectData).projectName}
                          </a>
                        </h3>
                        <span className="type-badge project-badge">Project</span>
                      </div>
                      <p className="card-tech">{(item.data as ProjectData).technologies}</p>
                      <p className="card-role">{(item.data as ProjectData).role}</p>
                      <p className="card-duration">{item.dateString}</p>
                      <ul className="card-list">
                        {(item.data as ProjectData).description.map((desc, idx) => (
                          <li key={idx}>{desc}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  )
}

export default Projects