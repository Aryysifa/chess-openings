import React from 'react';
import Header from '../../components/Header';

const IQTest = () => {
  return (
    <div className="dark-app" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header title="Free IQ Testing" />
      <div style={{ padding: '2rem' }}>
        <h1>IQ Test - Coming Soon</h1>
      </div>
    </div>
  );
};

export default IQTest;
