import Project from '../components/Project';
import portfolioData from '../../portfolio-data.json';
import './Projects.css';

function Projects() {
  return (
    <div className="projects-page">
      <h1>Projects</h1>
      <Project data={[portfolioData.projects[0]]} />
    </div>
  )
}

export default Projects