import React from 'react';
import Header from '../../components/Header';

const PokerGuide = () => {
  return (
    <div className="dark-app" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header title="Poker Guide" />
      <div style={{ padding: '2rem' }}>
        <h1>Poker Guide - Coming Soon</h1>
      </div>
    </div>
  );
};

export default PokerGuide;
