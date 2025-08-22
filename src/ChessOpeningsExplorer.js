import React, { useState, useEffect, useRef } from 'react';
import { ChessboardComponent } from './ChessboardComponent';
import { OpeningSelector } from './OpeningSelector';
import { MoveTree } from './MoveTree';
import { OpeningsTree } from './OpeningsTree';
import { Chess } from 'chess.js';
import { getMovesForPosition, getRealOpeningTree, preloadCommonOpenings, testRealDataIntegration } from './realOpeningsDatabase';
import OpeningTreeManager from './OpeningTreeManager';

// Helper to get moves using real data
async function getRealMoves(fen, moveHistory) {
  try {
    const moves = await getMovesForPosition(fen, moveHistory);
    return moves || [];
  } catch (error) {
    console.error('Error fetching opening moves:', error);
    return [];
  }
}

// Helper to get opening name from move history
function getOpeningNameFromHistory(moveHistory) {
  if (moveHistory.length === 0) return null;
  
  const openingNames = {
    'e4': "King's Pawn Opening",
    'd4': "Queen's Pawn Opening",
    'Nf3': 'Réti Opening',
    'c4': 'English Opening',
    'g3': 'Benko Opening',
    'b3': 'Nimzowitsch-Larsen Attack',
    'f4': "Bird's Opening"
  };
  
  // For now, just use the first move to determine opening family
  // A more sophisticated implementation would analyze the full sequence
  const firstMove = moveHistory[0];
  return openingNames[firstMove] || 'Unknown Opening';
}

const ChessOpeningsExplorer = () => {
  const [game, setGame] = useState(new Chess());
  const [moveHistory, setMoveHistory] = useState([]);
  const [moveIndex, setMoveIndex] = useState(-1);
  const [boardOrientation, setBoardOrientation] = useState('white');
  const [currentOpening, setCurrentOpening] = useState(null);
  const [possibleMoves, setPossibleMoves] = useState([]);
  const [treeVersion, setTreeVersion] = useState(0); // For triggering re-renders
  const [isLoadingMoves, setIsLoadingMoves] = useState(false);
  // Always using real data now

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

  // Initialize the chess position and tree with real data
  useEffect(() => {
    const initializeWithRealData = async () => {
      console.log('Initializing with real data from Lichess...');
      
      const newGame = new Chess();
      setGame(newGame);
      setMoveHistory([]);
      setMoveIndex(-1);
      treeManager.reset();
      
      // Load initial moves from real database
      setIsLoadingMoves(true);
      try {
        const rootFen = newGame.fen();
        const rootMoves = await getRealMoves(rootFen, []);
        
        console.log(`Loaded ${rootMoves.length} opening moves from Lichess`);
        
        treeManager.addMoves(rootFen, rootMoves, []);
        setPossibleMoves(rootMoves);
        
        // Build the opening tree with real data
        console.log('Building opening tree with real data...');
        const realTree = await getRealOpeningTree(rootFen, [], 3);
        treeManager.setRoot(realTree);
        console.log('Real opening tree loaded successfully');
        
      } catch (error) {
        console.error('Error loading real opening data:', error);
        setPossibleMoves([]);
      } finally {
        setIsLoadingMoves(false);
      }
    };
    
    initializeWithRealData();
  }, []);

  // Update possible moves and tree when moveHistory changes (with real data)
  useEffect(() => {
    const updateMovesWithRealData = async () => {
      const tempGame = new Chess();
      for (let i = 0; i <= moveIndex; i++) {
        tempGame.move(moveHistory[i]);
      }
      const fen = tempGame.fen();
      const currentMoveHistory = moveHistory.slice(0, moveIndex + 1);
      
      setIsLoadingMoves(true);
      try {
        const moves = await getRealMoves(fen, currentMoveHistory);
        treeManager.addMoves(fen, moves, currentMoveHistory);
        setPossibleMoves(moves);
        
        // Set current opening based on the current position
        const openingName = getOpeningNameFromHistory(currentMoveHistory);
        if (openingName && moves.length > 0) {
          // Calculate aggregate statistics from available moves
          const totalGames = moves.reduce((sum, move) => sum + move.totalGames, 0);
          const avgWinRate = totalGames > 0 ? 
            moves.reduce((sum, move) => sum + (move.winRate * move.totalGames), 0) / totalGames : 50;
          const avgDrawRate = totalGames > 0 ?
            moves.reduce((sum, move) => sum + (move.drawRate * move.totalGames), 0) / totalGames : 25;
          
          setCurrentOpening({
            name: openingName,
            winRate: Math.round(avgWinRate * 10) / 10,
            drawRate: Math.round(avgDrawRate * 10) / 10,
            loseRate: Math.round((100 - avgWinRate - avgDrawRate) * 10) / 10,
            totalGames: totalGames
          });
        } else {
          setCurrentOpening(null);
        }
        
      } catch (error) {
        console.error('Error updating moves with real data:', error);
        setPossibleMoves([]);
        setCurrentOpening(null);
      } finally {
        setIsLoadingMoves(false);
      }
    };
    
    updateMovesWithRealData();
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
  const resetBoard = async () => {
    const newGame = new Chess();
    setGame(newGame);
    setMoveHistory([]);
    setMoveIndex(-1);
    setCurrentOpening(null);
    treeManager.reset();
    
    // Load root moves from real database
    setIsLoadingMoves(true);
    try {
      const rootFen = newGame.fen();
      const rootMoves = await getRealMoves(rootFen, []);
      treeManager.addMoves(rootFen, rootMoves, []);
      setPossibleMoves(rootMoves);
    } catch (error) {
      console.error('Error resetting board with real data:', error);
      setPossibleMoves([]);
    } finally {
      setIsLoadingMoves(false);
    }
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
        <div className="flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 bg-clip-text text-transparent">
              ♔ Chess Openings Explorer ♕
            </h1>
            <p className="text-sm text-gray-400 mt-1">Live Chess Data • Real Game Statistics</p>
            {isLoadingMoves && (
              <div className="mt-2">
                <span className="text-xs px-2 py-1 bg-blue-600 rounded text-white animate-pulse">
                  Loading...
                </span>
              </div>
            )}
          </div>
        </div>
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
              loading={isLoadingMoves}
              onSelectMove={async (moveSequence) => {
                // If moveSequence is a string (old format), convert to array
                const moves = Array.isArray(moveSequence) ? moveSequence : [moveSequence];
                
                // Reset game to start
                const newGame = new Chess();
                
                // Play all moves in sequence
                let validSequence = true;
                for (let i = 0; i < moves.length; i++) {
                  const legalMoves = newGame.moves({ verbose: true });
                  const matchingMove = legalMoves.find(m => m.san === moves[i]);
                  if (matchingMove) {
                    newGame.move(matchingMove);
                  } else {
                    validSequence = false;
                    break;
                  }
                }
                
                if (validSequence) {
                  // Update game state
                  setGame(newGame);
                  setMoveHistory(moves);
                  setMoveIndex(moves.length - 1);
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