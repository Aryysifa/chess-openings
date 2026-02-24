import React from 'react';
import Header from '../../components/Header';

const BrainGames = () => {
  return (
    <div className="dark-app" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header title="Brain Games" />
      <div style={{ padding: '2rem' }}>
        <h1>Brain Games - Coming Soon</h1>
      </div>
    </div>
  );
};

export default BrainGames;
