// Pres2024.js
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import axios from 'axios';
import RollingList from '../rolling_list';
import 'leaflet/dist/leaflet.css';
import { useGeoContext } from '../infastructure/GeoMatchContext';

const Comparison = ({ filter, comparison, fromYear, fromType, toYear, toType, type }) => {
  const [votes, setVotes] = useState({});
  const { geoData, computeMatchMap, matchMap, townNames } = useGeoContext();

  useEffect(() => {
    if (!geoData || townNames.length === 0) return;
    console.log(filter, comparison, fromYear, fromType, toYear, toType)
    axios.get(`/${fromYear}/${fromType}/${comparison}/${toYear}/${toType}`).then(res => {
        const voteMap = {};
        res.data.forEach(row => {
          const key = row.municipality?.trim().toLowerCase();
          const from_dem = Number(row.from_democrat_votes) || 0;
          const from_rep = Number(row.from_republican_votes) || 0;
          const from_other = Number(row.from_other) || 0;
        
          const to_dem = Number(row.to_democrat_votes) || 0;
          const to_rep = Number(row.to_republican_votes) || 0;
          const to_other = Number(row.to_other) || 0;
        

          const dem_difference = Number(row.dem_difference) || 0;
          const rep_difference = Number(row.rep_difference) || 0;
          voteMap[key] = {
            from_democrat: from_dem,
            from_republican: from_rep,
            from_other: from_other,
        
            to_democrat: to_dem,
            to_republican: to_rep,
            to_other: to_other,
        
            dem_difference: dem_difference,  // percent
            rep_difference: rep_difference,  // percent
        
           
            other_vote_diff: to_other - from_other
          };
        });
        
      setVotes(voteMap);
      computeMatchMap('2024/president', Object.keys(voteMap)); // uses cache if exists
    });
  }, [geoData, townNames]);
  
  const getColor = (townName) => {
    const bestMatch = matchMap[townName?.toLowerCase()];
    if (!bestMatch || !votes[bestMatch]) return '#f7f7f7';
  
    const {
      from_democrat,
      from_republican,
      from_other,
      to_democrat,
      to_republican,
      to_other
    } = votes[bestMatch];
  
    const from_total = from_democrat + from_republican + from_other;
    const to_total = to_democrat + to_republican + to_other;
  
    if (from_total === 0 || to_total === 0) return '#f7f7f7';
  
    const from_dem_pct = (from_democrat / from_total) * 100;
    const from_rep_pct = (from_republican / from_total) * 100;
    const to_dem_pct = (to_democrat / to_total) * 100;
    const to_rep_pct = (to_republican / to_total) * 100;
  
    const dem_shift = to_dem_pct - from_dem_pct;
    const rep_shift = to_rep_pct - from_rep_pct;
  
    // Use net shift — positive = Dem gain, negative = GOP gain
    const shift = dem_shift - rep_shift;
  
    // Apply Pres2024-style thresholds
    if (Math.abs(shift) < 0.1) return '#f7f7f7'; // no change
    if (shift > 15) return '#084081';   // strong Dem shift
    if (shift > 10) return '#0868ac';
    if (shift > 5)  return '#2b8cbe';
    if (shift > 0)  return '#a6bddb';
    if (shift > -5) return '#fddbc7';
    if (shift > -10) return '#fc9272';
    if (shift > -15) return '#de2d26';
    return '#a50f15'; // strong GOP shift
  };
  
  const onEachFeature = (feature, layer) => {
    const townName = feature?.properties?.TOWN?.toLowerCase();
    const bestMatch = matchMap[townName];
  
    layer.setStyle({
      fillColor: getColor(townName),
      fillOpacity: 0.7,
      weight: 1,              // no outlines
      color: '#999',   // no border color
    });
  
    if (!bestMatch || !votes[bestMatch]) {
      layer.bindPopup(`${townName}<br/> No data`);
      return;
    }
  
    const {
      from_democrat,
      from_republican,
      other,
      to_democrat,
      to_republican
    } = votes[bestMatch];
  
    const from_total = from_democrat + from_republican + other;
    const to_total = to_democrat + to_republican + other;
  
    let popupContent = `${townName}<br/>Invalid vote totals`;
    if (from_total > 0 && to_total > 0) {
      const from_dem_pct = (from_democrat / from_total) * 100;
      const to_dem_pct = (to_democrat / to_total) * 100;
      const from_rep_pct = (from_republican / from_total) * 100;
      const to_rep_pct = (to_republican / to_total) * 100;
  
      const dem_shift = (to_dem_pct - from_dem_pct).toFixed(1);
      const rep_shift = (to_rep_pct - from_rep_pct).toFixed(1);
  
      popupContent = `
        ${townName}<br/>
        Democratic Shift: ${dem_shift}%<br/>
        Republican Shift: ${rep_shift}%
      `;
    }
  
    layer.bindPopup(popupContent);
  };
  
  
  return (!geoData || townNames.length === 0 || Object.keys(votes).length === 0 || Object.keys(matchMap).length === 0) ? (
    <div>Loading...</div>
  ): (
    <div style={{ position: 'relative', height: '100vh', width: '100%' }}>
      <RollingList voteData={votes} filter={filter} type={type} isComparison={true} />

      <MapContainer center={[45.25, -69.445]} zoom={7} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <GeoJSON data={geoData} onEachFeature={onEachFeature} />
      </MapContainer>
    </div>
  ) ;
};

export default Comparison;
