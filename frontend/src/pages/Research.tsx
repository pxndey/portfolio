import Publication from '../components/Publication';
import portfolioData from '../../portfolio-data.json';
import './Research.css';

function Research() {
  return (
    <div className="research-page">
      <h1>Research</h1>
      <Publication data={[portfolioData.publications[0]]} />
    </div>
  )
}

export default Research
