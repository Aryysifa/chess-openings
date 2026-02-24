import React from 'react';

const Connect4Board = ({ board, onColumnClick, highlightedColumn, winningCells = [] }) => {
  const ROWS = 6;
  const COLS = 7;

  const getCellColor = (row, col) => {
    const cell = board[row][col];
    const isWinning = winningCells.some(([r, c]) => r === row && c === col);

    if (cell === 1) {
      return isWinning ? '#ff6b6b' : '#e74c3c'; // Player 1 - Red
    } else if (cell === 2) {
      return isWinning ? '#ffd93d' : '#f1c40f'; // Player 2 - Yellow
    }
    return '#34495e'; // Empty - Dark gray
  };

  const isColumnFull = (col) => {
    return board[0][col] !== 0;
  };

  return (
    <div style={{
      display: 'inline-block',
      background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
      padding: '1rem',
      borderRadius: '12px',
      boxShadow: '0 8px 16px rgba(0,0,0,0.3)'
    }}>
      {/* Column buttons */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
        {[...Array(COLS)].map((_, col) => (
          <button
            key={col}
            onClick={() => onColumnClick && !isColumnFull(col) && onColumnClick(col)}
            disabled={isColumnFull(col)}
            style={{
              width: '60px',
              height: '40px',
              background: highlightedColumn === col
                ? 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)'
                : isColumnFull(col)
                ? '#555'
                : 'linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%)',
              border: 'none',
              borderRadius: '8px 8px 0 0',
              cursor: isColumnFull(col) ? 'not-allowed' : 'pointer',
              fontSize: '0.9rem',
              fontWeight: '600',
              color: isColumnFull(col) ? '#888' : '#fff',
              transition: 'all 0.2s',
              opacity: isColumnFull(col) ? 0.5 : 1,
              transform: highlightedColumn === col ? 'translateY(-2px)' : 'none',
              boxShadow: highlightedColumn === col ? '0 4px 8px rgba(52, 152, 219, 0.4)' : 'none'
            }}
            onMouseEnter={(e) => {
              if (!isColumnFull(col)) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
              }
            }}
            onMouseLeave={(e) => {
              if (highlightedColumn !== col) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }
            }}
          >
            ↓ {col + 1}
          </button>
        ))}
      </div>

      {/* Board grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${COLS}, 60px)`,
        gap: '4px',
        background: '#2c3e50',
        padding: '8px',
        borderRadius: '8px'
      }}>
        {[...Array(ROWS)].map((_, row) =>
          [...Array(COLS)].map((_, col) => {
            const isWinning = winningCells.some(([r, c]) => r === row && c === col);
            return (
              <div
                key={`${row}-${col}`}
                style={{
                  width: '60px',
                  height: '60px',
                  background: '#34495e',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  boxShadow: isWinning ? '0 0 20px rgba(255, 215, 0, 0.8), inset 0 0 10px rgba(255, 215, 0, 0.3)' : 'inset 0 2px 4px rgba(0,0,0,0.3)'
                }}
              >
                <div
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: getCellColor(row, col),
                    boxShadow: board[row][col] !== 0
                      ? '0 4px 6px rgba(0,0,0,0.3), inset 0 -2px 4px rgba(0,0,0,0.2), inset 0 2px 4px rgba(255,255,255,0.2)'
                      : 'inset 0 2px 4px rgba(0,0,0,0.5)',
                    transition: 'all 0.3s',
                    transform: isWinning ? 'scale(1.1)' : 'scale(1)'
                  }}
                />
              </div>
            );
          })
        )}
      </div>

      {/* Column labels at bottom */}
      <div style={{ display: 'flex', gap: '4px', marginTop: '4px', justifyContent: 'center' }}>
        {[...Array(COLS)].map((_, col) => (
          <div
            key={col}
            style={{
              width: '60px',
              textAlign: 'center',
              fontSize: '0.8rem',
              color: '#95a5a6',
              fontWeight: '600'
            }}
          >
            Col {col + 1}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Connect4Board;
