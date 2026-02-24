import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';

const BlackjackGuide = () => {
  const [hoveredBox, setHoveredBox] = React.useState(null);
  const navigate = useNavigate();

  const boxStyle = (isHovered) => ({
    flex: 1,
    border: '2px solid #444',
    borderRadius: '8px',
    padding: '1rem',
    backgroundColor: isHovered ? '#8B4545' : '#1a1a1a',
    minHeight: '70px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease'
  });

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0f0f0f 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Subtle geometric pattern overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          radial-gradient(circle at 20% 30%, rgba(139, 69, 69, 0.03) 0%, transparent 50%),
          radial-gradient(circle at 80% 70%, rgba(139, 69, 69, 0.03) 0%, transparent 50%)
        `,
        pointerEvents: 'none'
      }}></div>

      <Header title="Blackjack Guide" />

      <div style={{
        padding: '1rem 2rem',
        maxWidth: '1400px',
        margin: '0 auto',
        width: '100%',
        position: 'relative',
        zIndex: 1
      }}>
        <h1 style={{
          textAlign: 'center',
          marginBottom: '1.5rem',
          fontSize: '2rem',
          fontWeight: 'bold',
          marginTop: '1rem',
          color: '#f0f0f0',
          letterSpacing: '-0.025em'
        }}>
          Beginners Guide
        </h1>

        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
          <div
            style={boxStyle(hoveredBox === 'rules')}
            onMouseEnter={() => setHoveredBox('rules')}
            onMouseLeave={() => setHoveredBox(null)}
            onClick={() => navigate('/blackjack/beginners-guide#rules')}
          >
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', margin: 0 }}>Blackjack Rules</h2>
          </div>

          <div
            style={boxStyle(hoveredBox === 'strategy')}
            onMouseEnter={() => setHoveredBox('strategy')}
            onMouseLeave={() => setHoveredBox(null)}
            onClick={() => navigate('/blackjack/beginners-guide#strategy-table')}
          >
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', margin: 0 }}>Strategy Table</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlackjackGuide;
