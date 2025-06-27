import React, { useState, useEffect, useRef } from 'react';
import { ChessboardComponent } from './ChessboardComponent';
import { OpeningSelector } from './OpeningSelector';
import { MoveTree } from './MoveTree';
import { OpeningsTree } from './OpeningsTree';
import { Chess } from 'chess.js';
import { localOpeningsTree, getMovesForPosition } from './localOpeningsDatabase';
import OpeningTreeManager from './OpeningTreeManager';

// Helper to get moves from the local database for a FEN
function getLocalMoves(fen, moveHistory) {
  return getMovesForPosition(moveHistory) || [];
}

const ChessOpeningsExplorer = () => {
  const [game, setGame] = useState(new Chess());
  const [moveHistory, setMoveHistory] = useState([]);
  const [moveIndex, setMoveIndex] = useState(-1);
  const [boardOrientation, setBoardOrientation] = useState('white');
  const [currentOpening, setCurrentOpening] = useState(null);
  const [possibleMoves, setPossibleMoves] = useState([]);
  const [treeVersion, setTreeVersion] = useState(0); // For triggering re-renders

  // Tree manager instance (singleton for this component)
  const treeManagerRef = useRef(null);
  if (!treeManagerRef.current) {
    treeManagerRef.current = new OpeningTreeManager();
  }
  const treeManager = treeManagerRef.current;

  // Subscribe to tree updates
  useEffect(() => {
    const unsubscribe = treeManager.subscribe(() => setTreeVersion(v => v + 1));
    return unsubscribe;
  }, [treeManager]);

  // Initialize the chess position and tree
  useEffect(() => {
    const newGame = new Chess();
    setGame(newGame);
    setMoveHistory([]);
    setMoveIndex(-1);
    treeManager.reset();
    // Add root moves
    const rootFen = newGame.fen();
    const rootMoves = getLocalMoves(rootFen, []);
    treeManager.addMoves(rootFen, rootMoves, []);
    setPossibleMoves(rootMoves);
  }, []);

  // Update possible moves and tree when moveHistory changes
  useEffect(() => {
    const tempGame = new Chess();
    for (let i = 0; i <= moveIndex; i++) {
      tempGame.move(moveHistory[i]);
    }
    const fen = tempGame.fen();
    const moves = getLocalMoves(fen, moveHistory.slice(0, moveIndex + 1));
    treeManager.addMoves(fen, moves, moveHistory.slice(0, moveIndex + 1));
    setPossibleMoves(moves);
    // Set current opening if matched
    let found = null;
    for (const [name, opening] of Object.entries(localOpeningsTree)) {
      if (Array.isArray(opening.moves) && opening.moves.length >= moveHistory.length &&
          opening.moves.slice(0, moveHistory.length).every((m, i) => m === moveHistory[i])) {
        found = { name, ...opening };
        break;
      }
    }
    setCurrentOpening(found);
  }, [moveHistory, moveIndex, treeManager]);

  // Handle piece movement
  const onPieceDrop = async (sourceSquare, targetSquare) => {
    const gameCopy = new Chess(game.fen());
    const moveResult = gameCopy.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q'
    });
    if (!moveResult) return false;
    setGame(gameCopy);
    const updatedHistory = [...moveHistory.slice(0, moveIndex + 1), moveResult.san];
    setMoveHistory(updatedHistory);
    setMoveIndex(updatedHistory.length - 1);
    return true;
  };

  // Reset the board
  const resetBoard = () => {
    const newGame = new Chess();
    setGame(newGame);
    setMoveHistory([]);
    setMoveIndex(-1);
    setCurrentOpening(null);
    treeManager.reset();
    const rootFen = newGame.fen();
    const rootMoves = getLocalMoves(rootFen, []);
    treeManager.addMoves(rootFen, rootMoves, []);
    setPossibleMoves(rootMoves);
  };

  // Go back one move
  const goBackMove = () => {
    if (moveIndex < 0) return;
    const newGame = new Chess(game.fen());
    newGame.undo();
    setGame(newGame);
    setMoveIndex(moveIndex - 1);
  };

  // Go forward one move
  const goForwardMove = () => {
    if (moveIndex >= moveHistory.length - 1) return;
    const newGame = new Chess(game.fen());
    const nextMoveSan = moveHistory[moveIndex + 1];
    if (!nextMoveSan) return;
    newGame.move(nextMoveSan);
    setGame(newGame);
    setMoveIndex(moveIndex + 1);
  };

  // Flip the board orientation
  const flipBoard = () => {
    setBoardOrientation(boardOrientation === 'white' ? 'black' : 'white');
  };

  // Get arrows for the chessboard
  const getArrowsWithAnnotations = () => {
    const arrows = [];
    possibleMoves.forEach(move => {
      let fromSquare, toSquare;
      if (move.uci && move.uci.length === 4) {
        fromSquare = move.uci.substring(0, 2);
        toSquare = move.uci.substring(2, 4);
      } else {
        const legalMoves = game.moves({ verbose: true });
        const matchingMove = legalMoves.find(m => m.san === move.move);
        if (matchingMove) {
          fromSquare = matchingMove.from;
          toSquare = matchingMove.to;
        }
      }
      if (fromSquare && toSquare) {
        arrows.push({ from: fromSquare, to: toSquare, opening: move.name });
      }
    });
    return arrows;
  };

  return (
    <div className="flex flex-col h-screen dark-app">
      <div className="bg-gray-900 text-white p-4" style={{ backgroundColor: '#1a1a1a' }}>
        <h1 className="text-2xl font-bold text-center">Interactive Chess Openings Explorer</h1>
      </div>
      <div className="chess-explorer-layout">
        {/* Left section - Chessboard and Move Tree */}
        <div className="left-panel">
          <div className="panel board-panel flex flex-col">
            <div className="flex-grow">
              <ChessboardComponent
                position={game.fen()}
                onPieceDrop={onPieceDrop}
                arrows={getArrowsWithAnnotations()}
                orientation={boardOrientation}
              />
            </div>
            <div className="mt-4 flex justify-center items-center control-buttons">
              <div className="button-group-container">
                <div className="button-group">
                  <button onClick={resetBoard} className="control-btn">Reset</button>
                  <button onClick={flipBoard} className="control-btn">Flip Board</button>
                </div>
                <div className="button-group">
                  <button onClick={goBackMove} className="control-btn" disabled={moveIndex < 0}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button onClick={goForwardMove} className="control-btn" disabled={moveIndex >= moveHistory.length - 1}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="panel">
            <MoveTree
              moves={moveHistory}
              currentOpening={currentOpening}
              currentMoveIndex={moveIndex}
            />
          </div>
        </div>
        {/* Right section - OpeningsTree and OpeningSelector */}
        <div className="right-panel">
          <div className="panel info-panel">
            <OpeningsTree
              currentPosition={game.fen()}
              possibleMoves={possibleMoves}
              moveHistory={moveHistory.slice(0, moveIndex + 1)}
              completeTree={treeManager.root}
              onSelectMove={async (moveSan) => {
                const legalMoves = game.moves({ verbose: true });
                const matchingMove = legalMoves.find(m => m.san === moveSan);
                if (matchingMove) {
                  await onPieceDrop(matchingMove.from, matchingMove.to);
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChessOpeningsExplorer;