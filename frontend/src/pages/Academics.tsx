import Education from '../components/Education';
import './Academics.css';

interface ExtracurricularActivity {
  organization: string;
  role: string;
  duration: string;
  details?: string[];
}

interface EducationData {
  institution: string;
  location: string;
  degree: string;
  marks: string;
  duration: string;
  coursework?: string[];
  extracurriculars?: ExtracurricularActivity[];
}

interface PortfolioData {
  workExperience: any[];
  education: EducationData[];
  publications: any[];
  projects: any[];
}

interface AcademicsProps {
  portfolioData: PortfolioData;
}

function Academics({ portfolioData }: AcademicsProps) {
  return (
    <div className="academics-page">
      <h1>Academics</h1>
      <Education data={portfolioData.education} />
    </div>
  )
}

export default Academics