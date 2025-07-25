import React, {  useState } from 'react';
import Pres2024 from './data_views/2024_president';
import Sen2024 from './data_views/2024_senate';
import 'leaflet/dist/leaflet.css';


const App = () => {

  const [selectedOption, setSelectedOption] = useState('2024 President');


  return  (
  <>
    <div style={{ position: 'relative' }}>
    <div style={{
    position: 'absolute',
    top: '10px',
    left: '60px',
    background: 'white',
    padding: '8px 12px',
    borderRadius: '6px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
    zIndex: 1000
  }}>
    <label htmlFor="data-select" style={{ marginRight: '6px' }}>Dataset:</label>
    <select
      id="data-select"
      value={selectedOption}
      onChange={(e) => setSelectedOption(e.target.value)}
    >
      <option value="2024 President">2024 President</option>
      <option value="2024 Senate">2024 Senate</option>
      <option value="2020 President">2020 President</option>
    </select>
  </div>
</div>

{selectedOption === "2024 President" ? <Pres2024 />:
selectedOption === "2024 Senate"? <Sen2024 /> : null}
</>
  )
  

;
}

export default App;



