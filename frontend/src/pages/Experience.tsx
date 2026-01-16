import WorkExperience from '../components/WorkExperience';
import './Experience.css';

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
  projects: any[];
}

interface ExperienceProps {
  portfolioData: PortfolioData;
}

function Experience({ portfolioData }: ExperienceProps) {
  return (
    <div className="experience-page">
      <h1>Experience</h1>
      <WorkExperience data={portfolioData.workExperience} />
    </div>
  )
}

export default Experience