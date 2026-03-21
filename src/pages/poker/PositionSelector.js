import React from 'react';
import { POSITIONS, POSITION_INFO } from './pokerLogic';

// Positions arranged clockwise around the oval table
// angle = degrees clockwise from top (12 o'clock)
const POSITION_ANGLES = {
  'BB':  -90,   // left
  'SB':  -130,  // lower-left
  'BTN': 180,   // bottom
  'CO':  130,   // lower-right
  'HJ':  90,    // right
  'UTG': 0,     // top
};

const PositionSelector = ({ selectedPosition, onPositionSelect, numPlayers, onNumPlayersChange }) => {
  // Determine which positions are active based on player count
  const getActivePositions = () => {
    if (numPlayers <= 2) return ['BTN', 'BB'];
    if (numPlayers === 3) return ['BTN', 'SB', 'BB'];
    if (numPlayers === 4) return ['CO', 'BTN', 'SB', 'BB'];
    if (numPlayers === 5) return ['HJ', 'CO', 'BTN', 'SB', 'BB'];
    return POSITIONS; // 6+
  };

  const activePositions = getActivePositions();

  // Oval dimensions
  const W = 150; // half-width (CSS left offset center)
  const H = 90;  // half-height (CSS top offset center)

  const getPos = (angleDeg) => {
    const rad = (angleDeg * Math.PI) / 180;
    // Push labels outside the oval by adding padding
    const padX = 52;
    const padY = 28;
    const x = W + (W + padX) * Math.cos(rad);
    const y = H + (H + padY) * Math.sin(rad);
    return { left: x, top: y };
  };

  const posInfo = POSITION_INFO[selectedPosition];

  return (
    <div>
      {/* Table + positions */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>

        {/* Oval table with floating position badges */}
        <div style={{ position: 'relative', width: 300 + 104, height: 180 + 56, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Center the oval */}
          <div className="poker-table-oval" style={{ position: 'absolute', left: 52, top: 28 }}>
            <div className="poker-table-felt" />
            {/* Dealer button */}
            <div style={{
              position: 'absolute', bottom: 24, right: 36,
              width: 20, height: 20, borderRadius: '50%',
              background: '#e0e0e0', color: '#111',
              fontSize: '0.55rem', fontWeight: 800,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '2px solid #999',
            }}>D</div>
          </div>

          {/* Position badges positioned around the oval */}
          {activePositions.map(pos => {
            const angle = POSITION_ANGLES[pos];
            const { left, top } = getPos(angle);
            const isActive = pos === selectedPosition;
            return (
              <button
                key={pos}
                className={`poker-position-badge${isActive ? ' poker-position-badge-selected' : ''}`}
                style={{ left: left + 52, top: top + 28 }}
                onClick={() => onPositionSelect(pos)}
                title={POSITION_INFO[pos]?.fullName || pos}
              >
                {pos}
              </button>
            );
          })}
        </div>

        {/* Players control */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.75rem', color: '#888' }}>Players:</span>
          <button
            onClick={() => onNumPlayersChange(Math.max(2, numPlayers - 1))}
            style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid #444', background: '#2a2a2a', color: '#ccc', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}
          >−</button>
          <span style={{ fontSize: '1rem', fontWeight: 700, color: '#e0e0e0', minWidth: 16, textAlign: 'center' }}>{numPlayers}</span>
          <button
            onClick={() => onNumPlayersChange(Math.min(9, numPlayers + 1))}
            style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid #444', background: '#2a2a2a', color: '#ccc', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}
          >+</button>
        </div>
      </div>

      {/* Position info */}
      {posInfo && (
        <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: '#181818', borderRadius: 8, border: '1px solid #2a2a2a' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#5a9fd4', marginBottom: '0.3rem' }}>
            {posInfo.fullName} · {posInfo.tightnessLabel}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#aaa', lineHeight: 1.5 }}>
            {posInfo.description}
          </div>
        </div>
      )}
    </div>
  );
};

export default PositionSelector;
