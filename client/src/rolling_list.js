// RollingList.js
import React from 'react';

const RollingList = ({ voteData, filter }) => {
  if (!voteData || Object.keys(voteData).length === 0) return null;
  voteData = Object.entries(voteData)
  .sort(([aTown, aVotes], [bTown, bVotes]) => {
    const aTotal = aVotes.democrat + aVotes.republican + aVotes.other;
    const bTotal = bVotes.democrat + bVotes.republican + bVotes.other;
  
    const aDemPercent = aVotes.democrat / aTotal;
    const bDemPercent = bVotes.democrat / bTotal;
  
    const aRepPercent = aVotes.republican / aTotal;
    const bRepPercent = bVotes.republican / bTotal;
  
    if (filter === "close") {
      return Math.abs(aDemPercent - aRepPercent) - Math.abs(bDemPercent - bRepPercent);
    } else if (filter === "dem") {
      return (bDemPercent - bRepPercent) - (aDemPercent - aRepPercent);
    } else {
      return (bRepPercent - bDemPercent) - (aRepPercent - aDemPercent);
    }
  });
  

  voteData = Object.fromEntries(voteData);

  return (
    <div style={{
      position: 'absolute',
      top: 70,
      left: 20,
      width: '300px',
      maxHeight: '90vh',
      overflowY: 'auto',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
      padding: '16px',
      zIndex: 500
    }}>
      <h3 style={{ marginTop: 0 }}>Vote Data by Town</h3>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {Object.entries(voteData).map(([town, votes]) => (
          <li key={town} style={{ paddingBottom: '12px', borderBottom: '1px solid #eee' }}>
            <strong>{town}</strong><br />
            🟦 Dem: {votes.democrat}<br />
            🟥 Rep: {votes.republican}<br />
            🟩 Other: {votes.other}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RollingList;

