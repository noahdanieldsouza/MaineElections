// GeoMatchContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import stringSimilarity from 'string-similarity';

const GeoContext = createContext();
export const useGeoContext = () => useContext(GeoContext);

export const GeoProvider = ({ children }) => {
    const [geoData, setGeoData] = useState(null);
    const [townNames, setTownNames] = useState([]);
    const [matchMaps, setMatchMaps] = useState({}); // cache: { datasetKey: matchMap }
    const [currentMatchMap, setCurrentMatchMap] = useState({});
  
    useEffect(() => {
      const load = async () => {
        const geoRes = await fetch('/locations_edited.geojson');
        const geo = await geoRes.json();
        setGeoData(geo);
  
        const names = geo.features
          .map(f => f.properties?.TOWN?.toLowerCase())
          .filter(Boolean);
  
        setTownNames(names);
      };
      load();
    }, []);
  
    const computeMatchMap = (datasetKey, voteKeys) => {
      if (matchMaps[datasetKey]) {
        setCurrentMatchMap(matchMaps[datasetKey]);
        return;
      }
  
      const newMap = {};
      townNames.forEach(town => {
        const { bestMatch } = stringSimilarity.findBestMatch(town, voteKeys);
        if (bestMatch.rating > 0.6) {
          newMap[town] = bestMatch.target;
        }
      });
  
      setMatchMaps(prev => ({ ...prev, [datasetKey]: newMap }));
      setCurrentMatchMap(newMap);
    };
  
    return (
      <GeoContext.Provider value={{ geoData, townNames, matchMap: currentMatchMap, computeMatchMap }}>
        {children}
      </GeoContext.Provider>
    );
  };
  