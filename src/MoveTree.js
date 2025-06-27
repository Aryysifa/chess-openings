import React from 'react';

export const MoveTree = ({ moves, currentOpening, currentMoveIndex }) => {
  // Defensive: ensure moves is always an array
  const safeMoves = Array.isArray(moves) ? moves : [];
  // Group moves in pairs (White's move, Black's move)
  const movesPairs = [];
  for (let i = 0; i < safeMoves.length; i += 2) {
    movesPairs.push({
      number: Math.floor(i / 2) + 1,
      white: safeMoves[i],
      black: safeMoves[i + 1] || null
    });
  }
  
  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Move Sequence</h2>
      
      {currentOpening && (
        <div className="mb-4">
          <div className="font-bold text-lg text-blue-700">{currentOpening.name}</div>
          <div className="text-sm text-gray-600">
            Win: {Math.round(currentOpening.winRate)}% • 
            Draw: {Math.round(currentOpening.drawRate)}% • 
            Loss: {Math.round(currentOpening.loseRate)}%
          </div>
        </div>
      )}
      
      {safeMoves.length > 0 ? (
        <div className="font-mono">
          {movesPairs.map((pair, index) => (
            <span key={index} className="mr-2">
              <span className="text-gray-500">{pair.number}.</span>
              <span className={`font-bold ml-1 ${index * 2 === currentMoveIndex ? 'text-yellow-500' : 'text-blue-800'}`}>
                {pair.white}
              </span>
              {pair.black && (
                <span className={`font-bold ml-1 ${index * 2 + 1 === currentMoveIndex ? 'text-yellow-500' : 'text-gray-800'}`}>
                  {pair.black}
                </span>
              )}
            </span>
          ))}
        </div>
      ) : (
        <div className="text-gray-500 italic">No moves played yet. Choose an opening or make a move.</div>
      )}
    </div>
  );
};