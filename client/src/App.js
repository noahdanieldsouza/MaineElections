import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [deaths, setDeaths] = useState(null);
 
  const handleClick = async () => {
    
    try {
      console.log(deaths)
      const res = await axios.get('http://localhost:5000/data');
      setDeaths(res.data);
    } catch (err) {
      console.error(err);
      setDeaths('Error');
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <button onClick={handleClick}>Go</button>
      {deaths !== null && <p>Total deaths in Bosnia and Herzegovina: {deaths}</p>}
    </div>
  );
}

export default App;

