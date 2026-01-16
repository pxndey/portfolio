import Project from '../components/Project';
import './Projects.css';

interface ProjectData {
  projectName: string;
  technologies: string;
  role: string;
  duration: string;
  description: string[];
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

function Projects({ portfolioData }: ProjectsProps) {
  return (
    <div className="projects-page">
      <h1>Projects</h1>
      <Project data={portfolioData.projects} />
    </div>
  )
}

export default Projects