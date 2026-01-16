import WorkExperience from '../components/WorkExperience';
import portfolioData from '../../portfolio-data.json';
import './Experience.css';

function Experience() {
  return (
    <div className="experience-page">
      <h1>Experience</h1>
      <WorkExperience data={[portfolioData.workExperience[0]]} />
    </div>
  )
}

export default Experience