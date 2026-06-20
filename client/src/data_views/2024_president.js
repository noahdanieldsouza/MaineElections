// Pres2024.js
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import axios from 'axios';
import RollingList from '../rolling_list';
import 'leaflet/dist/leaflet.css';
import { useGeoContext } from '../infastructure/GeoMatchContext';

const Pres2024 = ({ filter, type }) => {
  const [votes, setVotes] = useState({});
  const { geoData, computeMatchMap, matchMap, townNames } = useGeoContext();

  useEffect(() => {
    if (!geoData || townNames.length === 0) return;
  
    axios.get('/2024/president').then(res => {
      const voteMap = {};
      res.data.forEach(row => {
        const key = row.municipality?.trim().toLowerCase();
        voteMap[key] = {
          democrat: Number(row.democrat_votes) || 0,
          republican: Number(row.republican_votes),
          other: Number(row.other),
        };
      });
      setVotes(voteMap);
      computeMatchMap('2024/president', Object.keys(voteMap)); // uses cache if exists
    });
  }, [geoData, townNames]);
  

  const getColor = (townName) => {

    const bestMatch = matchMap[townName?.toLowerCase()];
    if (!bestMatch || !votes[bestMatch]) return '#f7f7f7';

    const { democrat, republican, other } = votes[bestMatch];
    const total = democrat + republican + other;
    if (total === 0) return '#f7f7f7';

    const demPct = (democrat / total) * 100;
    const repPct = (republican / total) * 100;
    const margin = demPct - repPct;

    if (other > democrat && other > republican) return '#90EE90';
    if (margin > 15) return '#084081';
    if (margin > 10) return '#0868ac';
    if (margin > 5) return '#2b8cbe';
    if (margin > 0) return '#a6bddb';
    if (margin > -5) return '#fddbc7';
    if (margin > -10) return '#fc9272';
    if (margin > -15) return '#de2d26';
    return '#a50f15';
  };

  const onEachFeature = (feature, layer) => {
    const townName = feature?.properties?.TOWN?.toLowerCase();
    const bestMatch = matchMap[townName];
    const dem = bestMatch ? votes[bestMatch]?.democrat : null;
    const rep = bestMatch ? votes[bestMatch]?.republican : null;

    layer.setStyle({
      fillColor: getColor(townName),
      fillOpacity: 0.7,
      weight: 1,
      color: '#999',
    });

    const popupContent = bestMatch
      ? `${townName}<br/>Democratic Votes: ${dem}<br/>Republican Votes: ${rep}`
      : `${townName}<br/>Democratic Votes: No data`;
    layer.bindPopup(popupContent);
  };

  return (!geoData || townNames.length === 0 || Object.keys(votes).length === 0 || Object.keys(matchMap).length === 0) ? (
    <div>Loading...</div>
  ): (
    <div style={{ position: 'relative', height: '100vh', width: '100%' }}>
      <RollingList voteData={votes} filter={filter} type = {type} />
      <MapContainer center={[45.25, -69.445]} zoom={7} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <GeoJSON data={geoData} onEachFeature={onEachFeature} />
      </MapContainer>
    </div>
  ) ;
};

export default Pres2024;
