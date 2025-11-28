import React from 'react';

const Connect4MoveOptions = ({ possibleMoves, onMoveSelect, currentPlayer }) => {
  if (!possibleMoves || possibleMoves.length === 0) {
    return null;
  }

  const playerColor = currentPlayer === 1 ? '#e74c3c' : '#f1c40f';
  const playerName = currentPlayer === 1 ? 'Player 1 (Red)' : 'Player 2 (Yellow)';

  return (
    <div style={{
      backgroundColor: '#1a1a1a',
      border: '1px solid #333',
      borderRadius: '12px',
      padding: '1.5rem',
      marginTop: '1rem'
    }}>
      <h3 style={{
        fontSize: '1.3rem',
        fontWeight: '600',
        color: '#f0f0f0',
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <div style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          background: playerColor,
          boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
        }}></div>
        {playerName}'s Turn - Choose a Move
      </h3>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1rem'
      }}>
        {possibleMoves.map((moveOption, index) => {
          const isOptimal = moveOption.isOptimal !== false;

          return (
            <button
              key={index}
              onClick={() => onMoveSelect(moveOption.move)}
              style={{
                background: isOptimal
                  ? 'linear-gradient(135deg, #27ae60 0%, #229954 100%)'
                  : 'linear-gradient(135deg, #e67e22 0%, #d35400 100%)',
                border: 'none',
                borderRadius: '8px',
                padding: '1rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = isOptimal
                  ? '0 6px 12px rgba(39, 174, 96, 0.4)'
                  : '0 6px 12px rgba(230, 126, 34, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {isOptimal && (
                <div style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '4px',
                  padding: '2px 8px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: '#fff'
                }}>
                  ⭐ OPTIMAL
                </div>
              )}

              <div style={{
                fontSize: '1.1rem',
                fontWeight: '600',
                color: '#fff',
                marginBottom: '0.5rem'
              }}>
                {moveOption.label || `Column ${moveOption.move + 1}`}
              </div>

              <div style={{
                fontSize: '0.9rem',
                color: 'rgba(255, 255, 255, 0.9)',
                lineHeight: '1.5'
              }}>
                {moveOption.explanation}
              </div>

              {!isOptimal && (
                <div style={{
                  marginTop: '0.5rem',
                  fontSize: '0.8rem',
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontStyle: 'italic'
                }}>
                  ⚠️ Suboptimal move - gives Player 1 an advantage
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Connect4MoveOptions;
