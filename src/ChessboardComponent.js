import React, { useEffect, useState, useRef } from 'react';
import { Chessboard } from 'react-chessboard';

export const ChessboardComponent = ({ position, onPieceDrop, arrows = [], orientation = 'white' }) => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1000,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  });
  const boardRef = useRef(null);
  const svgRef = useRef(null);
  const [boardSize, setBoardSize] = useState(500);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate board size based on container size
  useEffect(() => {
    const containerWidth = document.querySelector('.board-container')?.clientWidth || windowSize.width * 0.45;
    const containerHeight = windowSize.height * 0.7;
    
    // Use the smaller dimension to ensure the board fits
    const newSize = Math.min(containerWidth - 20, containerHeight - 50, 600);
    setBoardSize(newSize);
    
    // Set the board width as a CSS variable
    document.documentElement.style.setProperty('--board-width', `${newSize}px`);
  }, [windowSize]);

  // Function to convert chess square to coordinates
  const squareToCoords = (square) => {
    const file = square.charCodeAt(0) - 'a'.charCodeAt(0);
    const rank = 8 - parseInt(square[1]);
    
    const squareSize = boardSize / 8;
    const x = (file + 0.5) * squareSize;
    const y = (rank + 0.5) * squareSize;
    
    return { x, y };
  };

  // Generate SVG arrows
  const renderArrows = () => {
    return arrows.map((arrow, index) => {
      const start = squareToCoords(arrow.from);
      const end = squareToCoords(arrow.to);
      
      // Calculate the angle of the arrow
      const angle = Math.atan2(end.y - start.y, end.x - start.x);
      
      // Calculate the length of the arrow
      const length = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
      
      // Adjust the start and end points to start from the piece center and end at the square edge
      const squareSize = boardSize / 8;
      const pieceRadius = squareSize * 0.3; // Approximate piece radius
      
      // Shorten the start to begin at the piece edge
      const startX = start.x + pieceRadius * Math.cos(angle);
      const startY = start.y + pieceRadius * Math.sin(angle);
      
      // Shorten the end to stop at the square edge
      const endX = end.x - pieceRadius * Math.cos(angle);
      const endY = end.y - pieceRadius * Math.sin(angle);
      
      // Calculate arrow head points (larger arrowhead)
      const arrowHeadSize = 15; // Increased from 12
      const arrowHead1X = endX - arrowHeadSize * Math.cos(angle - Math.PI/6);
      const arrowHead1Y = endY - arrowHeadSize * Math.sin(angle - Math.PI/6);
      const arrowHead2X = endX - arrowHeadSize * Math.cos(angle + Math.PI/6);
      const arrowHead2Y = endY - arrowHeadSize * Math.sin(angle + Math.PI/6);

      // Calculate position for the text label (midpoint of the arrow)
      const midX = (startX + endX) / 2;
      const midY = (startY + endY) / 2 - 10; // Offset slightly up to not overlap the arrow
      
      // For text positioning, use a perpendicular offset to avoid overlapping the arrow
      const perpX = midX + 15 * Math.sin(angle); 
      const perpY = midY - 15 * Math.cos(angle);
      
      return (
        <g key={index}>
          {/* Arrow line - Now thicker */}
          <line
            x1={startX}
            y1={startY}
            x2={endX}
            y2={endY}
            stroke="rgba(0, 100, 255, 0.7)"
            strokeWidth="4"
          />
          {/* Arrow head - Now bigger */}
          <polygon
            points={`${endX},${endY} ${arrowHead1X},${arrowHead1Y} ${arrowHead2X},${arrowHead2Y}`}
            fill="rgba(0, 100, 255, 0.7)"
          />
          {/* Move name */}
          {arrow.opening && (
            <text
              x={perpX}
              y={perpY}
              fill="rgba(255, 255, 255, 0.9)"
              fontSize="14"
              fontWeight="bold"
              textAnchor="middle"
              style={{
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8), -2px -2px 4px rgba(0, 0, 0, 0.8)'
              }}
            >
              {arrow.winRate ? `${arrow.opening} (${Math.round(arrow.winRate)}%)` : arrow.opening}
            </text>
          )}
        </g>
      );
    });
  };

  return (
    <div className="board-container flex justify-center items-center h-full w-full" ref={boardRef}>
      <div style={{ width: `${boardSize}px`, maxWidth: '100%', position: 'relative' }}>
        <Chessboard
          id="main-board"
          position={position}
          onPieceDrop={onPieceDrop}
          boardOrientation={orientation}
          areArrowsAllowed={false}
          animationDuration={200}
          customBoardStyle={{
            borderRadius: '4px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
          }}
          customDarkSquareStyle={{ backgroundColor: '#b58863' }}
          customLightSquareStyle={{ backgroundColor: '#f0d9b5' }}
        />
        
        {/* SVG overlay for custom arrows */}
        <svg
          ref={svgRef}
          width={boardSize}
          height={boardSize}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            pointerEvents: 'none'
          }}
        >
          {renderArrows()}
        </svg>
      </div>
    </div>
  );
};