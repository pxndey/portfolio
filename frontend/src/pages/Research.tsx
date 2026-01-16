import Publication from '../components/Publication';
import './Research.css';

interface PublicationData {
  paperName: string;
  journalName: string;
  authors: string[];
  publicationYear: string;
  doi: string;
  highlights: string[];
}

interface PortfolioData {
  workExperience: any[];
  education: any[];
  publications: PublicationData[];
  projects: any[];
}

interface ResearchProps {
  portfolioData: PortfolioData;
}

function Research({ portfolioData }: ResearchProps) {
  return (
    <div className="research-page">
      <h1>Research</h1>
      <Publication data={portfolioData.publications} />
    </div>
  )
}

export default Research
