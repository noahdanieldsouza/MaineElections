import React, { useState } from 'react';
import Pres2024 from './data_views/2024_president';
import Sen2024 from './data_views/2024_senate';
import StateSen2024 from './data_views/2024_statesenate';
import 'leaflet/dist/leaflet.css';
import { GeoProvider } from './infastructure/GeoMatchContext';
import Comparison from './data_views/Comparison';

const datasetOptions = [
  { id: '2024_president', year: '2024', type: 'president', label: '2024 President' },
  { id: '2024_us_senate', year: '2024', type: 'sen', label: '2024 Senate' },
  { id: '2024_state_senate', year: '2024', type: 'statesen', label: '2024 State Senate' },
];

const App = () => {
  const [selectedOption, setSelectedOption] = useState(datasetOptions[0]);
  const [secondOption, setSecondOption] = useState({ year: null, type: null });
  const [selectedFilter, setSelectedFilter] = useState('close');
  const [dataComparison, setDataComparison] = useState('close');

  return (
    <>
      <GeoProvider>
        <div style={{ position: 'relative' }}>
          {/* Dropdown Container */}
          <div
            style={{
              position: 'absolute',
              top: '10px',
              left: '60px',
              display: 'flex',
              gap: '12px',
              background: 'white',
              padding: '8px 12px',
              borderRadius: '6px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
              zIndex: 1100,
            }}
          >
            {/* First Dropdown */}
            <div>
              <label htmlFor="data-select" style={{ marginRight: '6px' }}>Dataset:</label>
              <select
                id="data-select"
                value={selectedOption.id}
                onChange={(e) => {
                  const found = datasetOptions.find(opt => opt.id === e.target.value);
                  setSelectedOption(found);
                }}
              >
                {datasetOptions.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Second Dropdown */}
            <div>
              <label htmlFor="filter-select" style={{ marginRight: '6px' }}>Show Me:</label>
              <select
                id="filter-select"
                onChange={(e) => setDataComparison(e.target.value)}
              >
                <option value="None">None</option>
                <option value="party shift from">Party Shift</option>
                <option value="turnout shift from">Turnout Change</option>
                <option value="split ticket">Split Tickets</option>
              </select>
            </div>

            {/* Third Dropdown */}
            <div>
              <label htmlFor="data-select-2" style={{ marginRight: '6px' }}>Dataset 2:</label>
              <select
                id="data-select-2"
                value={secondOption.id || ''}
                onChange={(e) => {
                  const found = datasetOptions.find(opt => opt.id === e.target.value);
                  setSecondOption(found || { year: null, type: null });
                }}
              >
                <option value="">None</option>
                {datasetOptions.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Second Filter Dropdown */}
        <div style={{ position: 'relative' }}>
          <div
            style={{
              position: 'absolute',
              top: '50px',
              left: '60px',
              display: 'flex',
              gap: '12px',
              background: 'white',
              padding: '8px 12px',
              borderRadius: '6px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
              zIndex: 1100,
            }}
          >
            <div>
              <label htmlFor="filter-select-main" style={{ marginRight: '6px' }}>Filter By:</label>
              <select
                id="filter-select-main"
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
{(() => {
  console.log('Debug Render Params:', {
    selectedOption,
    secondOption,
    dataComparison,
    selectedFilter,
  });

  const mainKey = `${selectedOption.id}-${selectedFilter}`;
  const comparisonKey = `${selectedOption.id}-${secondOption?.id || 'none'}-${dataComparison}-${selectedFilter}`;

  if (!secondOption.year || !dataComparison || dataComparison === 'None') {
    if (selectedOption.year === '2024' && selectedOption.type === 'president') {
      return <Pres2024 key={mainKey} filter={selectedFilter} />;
    } else if (selectedOption.year === '2024' && selectedOption.type === 'sen') {
      return <Sen2024 key={mainKey} filter={selectedFilter} />;
    } else if (selectedOption.year === '2024' && selectedOption.type === 'statesen') {
      return <StateSen2024 key={mainKey} filter={selectedFilter} />;
    } else {
      return null;
    }
  } else {
    return (
      <Comparison
        key={comparisonKey}
        filter={selectedFilter}
        comparison={dataComparison}
        fromYear={selectedOption.year}
        fromType={selectedOption.type}
        toYear={secondOption.year}
        toType={secondOption.type}
      />
    );
  }
})()}

      </GeoProvider>
    </>
  );
};

export default App;
