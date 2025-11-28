import React from 'react';
import Header from '../../components/Header';

const CheckersGuide = () => {
  return (
    <div className="dark-app" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header title="Checkers Guide" />
      <div style={{ padding: '2rem' }}>
        <h1>Checkers Guide - Coming Soon</h1>
      </div>
    </div>
  );
};

export default CheckersGuide;
