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
        MS CS at NYU. Before that, undergrad in Vellore and school in
        Varanasi, and a lot of time spent on things that weren't coursework.
      </p>
      <Education data={portfolioData.education} />
    </div>
  )
}

export default Academics