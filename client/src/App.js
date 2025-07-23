import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

const MapView = () => {
  const [geoData, setGeoData] = useState(null);
  const [votes, setVotes] = useState({});

  useEffect(() => {
    
    // Load town boundaries (GeoJSON)
    fetch('/locations_edited.geojson')
      .then(res => res.json())
      .then(setGeoData);

      

    // Load votes per municipality
    axios.get('http://localhost:5000/votes-by-town')
      .then(res => {
        const voteMap = {};
        res.data.forEach(row => {
          console.log(row.democrat_votes);
          voteMap[row.municipality.toLowerCase()] = row.democrat_votes;
         

        });
        setVotes(voteMap);
      });
  }, []);

  const getColor = (municipalityName) => {
    const voteCount = votes[municipalityName.toLowerCase()] || 0;
    return voteCount > 1000 ? '#084081' :
           voteCount > 500  ? '#0868ac' :
           voteCount > 100  ? '#2b8cbe' :
           voteCount > 0    ? '#a6bddb' : '#f7f7f7';
  };

  const onEachFeature = (feature, layer) => {



    const name = feature?.properties?.TOWN;
   
  
    // Skip if name is missing
    if (!name) {
      console.warn('Missing NAME property in feature:', feature);
      return;
    }
  
    const lowerName = name.toLowerCase();
 
  
    layer.setStyle({
      fillColor: getColor(lowerName),
      fillOpacity: 0.7,
      weight: 1,
      color: '#999',
    });
  
    layer.bindPopup(`${name}<br/>Democratic Votes: ${votes[lowerName] || 0}`);
  };
  

  return geoData ? (
    <MapContainer center={[45.25, -69.445]} zoom={7} style={{ height: "100vh", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <GeoJSON data={geoData} onEachFeature={onEachFeature} />
    </MapContainer>
  ) : (
    <div>Loading...</div>
  );
};

export default MapView;


