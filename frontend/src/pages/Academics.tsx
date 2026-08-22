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
  notes?: string[];
  semesters?: { term: string; courses?: string[]; note?: string }[];
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
      <p className="page-eyebrow">Coursework &amp; beyond</p>
      <h1>Academics</h1>
      <p className="page-desc">
        MS CS at NYU, plus the undergrad years that got me here — coursework and
        the extracurricular detours that mattered.
      </p>
      <Education data={portfolioData.education} />
    </div>
  )
}

export default Academics