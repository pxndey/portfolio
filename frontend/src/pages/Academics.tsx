import Education from '../components/Education';
import portfolioData from '../../portfolio-data.json';
import './Academics.css';

function Academics() {
  return (
    <div className="academics-page">
      <h1>Academics</h1>
      <Education data={[portfolioData.education[0]]} />
    </div>
  )
}

export default Academics