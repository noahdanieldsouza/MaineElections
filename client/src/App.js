import React, {  useState } from 'react';
import Pres2024 from './data_views/2024_president';
import Sen2024 from './data_views/2024_senate';
import StateSen2024 from './data_views/2024_statesenate';
import 'leaflet/dist/leaflet.css';


const App = () => {

  const [selectedOption, setSelectedOption] = useState('2024 President');
  const [selectedFilter, setSelectedFilter] = useState('close');


  return  (
    <>
    <div style={{ position: 'relative' }}>
      {/* Dropdown Container */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '60px',
        display: 'flex',
        gap: '12px',              // space between dropdowns
        background: 'white',
        padding: '8px 12px',
        borderRadius: '6px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
        zIndex: 1100              // keep above list/map
      }}>
        {/* First Dropdown */}
        <div>
          <label htmlFor="data-select" style={{ marginRight: '6px' }}>Dataset:</label>
          <select
            id="data-select"
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
          >
            <option value="2024 President">2024 President</option>
            <option value="2024 US Senate">2024 Senate</option>
            <option value="2024 State Senate">2024 State Senate</option>
          </select>
        </div>
  
        {/* Second Dropdown */}
        <div>
          <label htmlFor="filter-select" style={{ marginRight: '6px' }}>Filter By:</label>
          <select
            id="filter-select"
            // add state and handler for this
            onChange={(e) => setSelectedFilter(e.target.value)}
          >
            
            <option value="close">Close Races</option>
            <option value="dem">Dem Leading</option>
            <option value="rep">Rep Leading</option>
          </select>
        </div>
      </div>
    </div>
  
    {/* Conditional Rendering */}
    {selectedOption === "2024 President" ? <Pres2024 filter = {selectedFilter}  /> :
      selectedOption === "2024 US Senate" ? <Sen2024 filter = {selectedFilter} /> :
        selectedOption === "2024 State Senate" ? <StateSen2024 filter = {selectedFilter} /> : null}
  </>
  
  )
  

;
}

export default App;



