import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import axios from 'axios';
import stringSimilarity from 'string-similarity';
import RollingList from '../rolling_list';
import 'leaflet/dist/leaflet.css';

const Sen2024 = ({filter}) => {


  const [geoData, setGeoData] = useState(null);
  const [votes, setVotes] = useState({});
  const [voteKeys, setVoteKeys] = useState([]);

  useEffect(() => {
    // Load town boundaries (GeoJSON)
    fetch('/locations_edited.geojson')
      .then(res => res.json())
      .then(setGeoData);

    // Load votes per municipality
    axios.get('http://localhost:5000/2024/sen')
      .then(res => {
        const voteMap = {};
        res.data.forEach(row => {
          const key = row.municipality?.trim().toLowerCase();
          voteMap[key] = {"democrat" : Number(row.democrat_votes) || 0, "republican": Number(row.republican_votes), "other": Number(row.other)};
        });
        setVotes(voteMap);
        setVoteKeys(Object.keys(voteMap)); // store keys for fuzzy matching
      });
  }, []);

  // Use string-similarity to find closest match
  const findBestMatch = (townName) => {
    if (!townName || voteKeys.length === 0) return null;

    const lowerName = townName.toLowerCase();
    const { bestMatch } = stringSimilarity.findBestMatch(lowerName, voteKeys);

    // Confidence threshold
    return bestMatch.rating > 0.6 ? bestMatch.target : null;
  };

  const getColor = (townName) => {
    const bestMatch = findBestMatch(townName);
    if (!bestMatch || !votes[bestMatch]) return '#f7f7f7'; // no data
  
    const demVotes = votes[bestMatch].democrat || 0;
    const repVotes = votes[bestMatch].republican || 0;
    const otherVotes = votes[bestMatch].other || 0;
    const totalVotes = demVotes + repVotes + otherVotes;
  
    if (totalVotes === 0) return '#f7f7f7';
  
    const demPercent = (demVotes / totalVotes) * 100;
    const repPercent = (repVotes / totalVotes) * 100;
    const margin = demPercent - repPercent;
  
    // Color logic
    if (otherVotes > demVotes && otherVotes > repVotes) return '#90EE90' // light green
    if (margin > 15) return '#084081';     // dark blue
    if (margin > 10) return '#0868ac';     // medium blue
    if (margin > 5)  return '#2b8cbe';     // light blue
    if (margin > 0)  return '#a6bddb';     // tossup leaning dem
    if (margin > -5) return '#fddbc7';     // tossup leaning rep
    if (margin > -10) return '#fc9272';    // light red
    if (margin > -15) return '#de2d26';    // medium red
    return '#a50f15';                      // dark red
  };
  
  

  const onEachFeature = (feature, layer) => {
    const townName = feature?.properties?.TOWN;

    if (!townName) {
      console.warn('Missing TOWN property in feature:', feature);
      return;
    }

    const bestMatch = findBestMatch(townName);
    const demVotes = bestMatch? votes[bestMatch].democrat: null; 
    const repVotes = bestMatch? votes[bestMatch].republican: null; 

    layer.setStyle({
      fillColor: getColor(townName),
      fillOpacity: 0.7,
      weight: 1,
      color: '#999',
    });
    if (bestMatch == null) {
      layer.bindPopup(`${townName}<br/>Democratic Votes: No data`);
    } else {
      layer.bindPopup(`${townName}<br/>Democratic Votes: ${demVotes}<br/>Republican Votes: ${repVotes}`);
    }
    
  };

  return geoData ? (
    <div style={{ position: 'relative', height: '100vh', width: '100%' }}>
      <RollingList voteData={votes} filter = {filter}/>
    <MapContainer center={[45.25, -69.445]} zoom={7} style={{ height: "100vh", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <GeoJSON data={geoData} onEachFeature={onEachFeature} />
    </MapContainer>
    </div>
   
  ) : (
    <div>Loading...</div>
  );
};

export default Sen2024;
