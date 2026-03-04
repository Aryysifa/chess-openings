import React, { useState, useEffect, useRef } from 'react';
import Header from '../../components/Header';
import { ChessboardComponent } from './ChessboardComponent';
import { OpeningSelector } from './OpeningSelector';
import { MoveTree } from './MoveTree';
import { OpeningsTree } from './OpeningsTree';
import { Chess } from 'chess.js';
import { getMovesForPosition, getRealOpeningTree, preloadCommonOpenings, testRealDataIntegration } from './realOpeningsDatabase';
import OpeningTreeManager from './OpeningTreeManager';

// Position cache for faster lookups
const positionCache = new Map();

// Helper to get cache key
function getCacheKey(fen, moveHistory) {
  return `${fen}:${moveHistory.join(',')}`;
}

// Helper to get moves using real data with caching
async function getRealMoves(fen, moveHistory) {
  const cacheKey = getCacheKey(fen, moveHistory);
  
  // Check cache first
  if (positionCache.has(cacheKey)) {
    return positionCache.get(cacheKey);
  }
  
  try {
    const moves = await getMovesForPosition(fen, moveHistory);
    const result = moves || [];
    
    // Cache the result
    positionCache.set(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Error fetching opening moves:', error);
    return [];
  }
}

// Helper to preload moves for possible next positions
async function preloadNextPositions(currentGame, possibleMoves, moveHistory) {
  const preloadPromises = possibleMoves.map(async (move) => {
    try {
      const tempGame = new Chess(currentGame.fen());
      const legalMoves = tempGame.moves({ verbose: true });
      const matchingMove = legalMoves.find(m => m.san === move.move);
      
      if (matchingMove) {
        tempGame.move(matchingMove);
        const nextFen = tempGame.fen();
        const nextMoveHistory = [...moveHistory, move.move];
        const cacheKey = getCacheKey(nextFen, nextMoveHistory);
        
        // Only fetch if not already cached
        if (!positionCache.has(cacheKey)) {
          const nextMoves = await getMovesForPosition(nextFen, nextMoveHistory);
          positionCache.set(cacheKey, nextMoves || []);
        }
      }
    } catch (error) {
      // Silently ignore preload errors
    }
  });
  
  // Run preloads in background without blocking
  Promise.all(preloadPromises);
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

const FEATURED_OPENINGS = [
  { name: 'Sicilian Defense', moves: ['e4', 'c5'] },
  { name: "Queen's Gambit", moves: ['d4', 'd5', 'c4'] },
  { name: "King's Indian Defense", moves: ['d4', 'Nf6'] },
  { name: 'Ruy Lopez', moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5'] },
  { name: 'French Defense', moves: ['e4', 'e6'] },
];

const ChessOpeningsExplorer = () => {
  const [game, setGame] = useState(new Chess());
  const [moveHistory, setMoveHistory] = useState([]);
  const [moveIndex, setMoveIndex] = useState(-1);
  const [boardOrientation, setBoardOrientation] = useState('white');
  const [currentOpening, setCurrentOpening] = useState(null);
  const [possibleMoves, setPossibleMoves] = useState([]);
  const [treeVersion, setTreeVersion] = useState(0); // For triggering re-renders
  const [isLoadingMoves, setIsLoadingMoves] = useState(false);
  const [openingDropdownOpen, setOpeningDropdownOpen] = useState(false);
  // Always using real data now

  const exploreSectionRef = useRef(null);

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
        
        // Preload next positions immediately
        preloadNextPositions(newGame, rootMoves, []);
        
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
      const cacheKey = getCacheKey(fen, currentMoveHistory);
      
      // Optimistic UI: Check cache first for instant updates
      if (positionCache.has(cacheKey)) {
        const cachedMoves = positionCache.get(cacheKey);
        treeManager.addMoves(fen, cachedMoves, currentMoveHistory);
        setPossibleMoves(cachedMoves);
        
        // Update opening info immediately with cached data
        const openingName = getOpeningNameFromHistory(currentMoveHistory);
        if (openingName && cachedMoves.length > 0) {
          const totalGames = cachedMoves.reduce((sum, move) => sum + move.totalGames, 0);
          const avgWinRate = totalGames > 0 ? 
            cachedMoves.reduce((sum, move) => sum + (move.winRate * move.totalGames), 0) / totalGames : 50;
          const avgDrawRate = totalGames > 0 ?
            cachedMoves.reduce((sum, move) => sum + (move.drawRate * move.totalGames), 0) / totalGames : 25;
          
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
        
        // Preload next positions in background
        preloadNextPositions(tempGame, cachedMoves, currentMoveHistory);
        
        return; // Exit early, no need for API call
      }
      
      // If not cached, show loading and fetch
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
        
        // Preload next positions in background
        preloadNextPositions(tempGame, moves, currentMoveHistory);
        
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
    try {
      const gameCopy = new Chess(game.fen());
      const moveResult = gameCopy.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q'
      });
      if (!moveResult) return false;
      
      // Optimistic UI: Update immediately
      setGame(gameCopy);
      const updatedHistory = [...moveHistory.slice(0, moveIndex + 1), moveResult.san];
      setMoveHistory(updatedHistory);
      setMoveIndex(updatedHistory.length - 1);
      
      // Check if we have cached data for the new position
      const newFen = gameCopy.fen();
      const newMoveHistory = updatedHistory;
      const cacheKey = getCacheKey(newFen, newMoveHistory);
      
      if (positionCache.has(cacheKey)) {
        // Instantly update UI with cached data
        const cachedMoves = positionCache.get(cacheKey);
        setPossibleMoves(cachedMoves);
        treeManager.addMoves(newFen, cachedMoves, newMoveHistory);
        // Preload next positions
        preloadNextPositions(gameCopy, cachedMoves, newMoveHistory);
      }
      
      return true;
    } catch (error) {
      // Invalid move - silently return false to reject the move
      return false;
    }
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
    const newMoveIndex = moveIndex - 1;
    
    // Reconstruct the position from the start
    const newGame = new Chess();
    for (let i = 0; i <= newMoveIndex; i++) {
      newGame.move(moveHistory[i]);
    }
    
    setGame(newGame);
    setMoveIndex(newMoveIndex);
  };

  // Go forward one move
  const goForwardMove = () => {
    if (moveIndex >= moveHistory.length - 1) return;
    const newMoveIndex = moveIndex + 1;
    
    // Reconstruct the position from the start
    const newGame = new Chess();
    for (let i = 0; i <= newMoveIndex; i++) {
      newGame.move(moveHistory[i]);
    }
    
    setGame(newGame);
    setMoveIndex(newMoveIndex);
  };

  // Flip the board orientation
  const flipBoard = () => {
    setBoardOrientation(boardOrientation === 'white' ? 'black' : 'white');
  };

  // Navigate the board to a specific move sequence
  const navigateToMoves = (moves) => {
    const newGame = new Chess();
    let valid = true;
    for (const move of moves) {
      const legal = newGame.moves({ verbose: true });
      const match = legal.find(m => m.san === move);
      if (match) {
        newGame.move(match);
      } else {
        valid = false;
        break;
      }
    }
    if (valid) {
      setGame(newGame);
      setMoveHistory(moves);
      setMoveIndex(moves.length - 1);
    }
    setOpeningDropdownOpen(false);
  };

  const scrollToExplore = () => {
    setOpeningDropdownOpen(false);
    if (exploreSectionRef.current) {
      exploreSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
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
    <div className="flex flex-col flex-1 dark-app" style={{ minHeight: '100vh' }}>
      <Header title="Chess Openings Explorer" loading={isLoadingMoves} />
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
        </div>
        {/* Right section - OpeningsTree and OpeningSelector */}
        <div className="right-panel">
          <div className="panel info-panel" style={{ position: 'relative' }}>
            {/* Choose an opening line dropdown — absolute overlay inside the tree background */}
            <div
              style={{ position: 'absolute', top: '14px', left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) {
                  setTimeout(() => setOpeningDropdownOpen(false), 150);
                }
              }}
            >
              <button
                className={`opening-line-btn${openingDropdownOpen ? ' open' : ''}`}
                onClick={() => setOpeningDropdownOpen(o => !o)}
              >
                <span>Choose an opening line</span>
                <svg
                  className="opening-line-chevron"
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M2.5 5L7 9.5L11.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              {openingDropdownOpen && (
                <div className="opening-line-dropdown">
                  {FEATURED_OPENINGS.map(opening => (
                    <button
                      key={opening.name}
                      className="opening-line-item"
                      onClick={() => navigateToMoves(opening.moves)}
                    >
                      {opening.name}
                    </button>
                  ))}
                  <button
                    className="opening-line-item explore"
                    onClick={scrollToExplore}
                  >
                    <span>Explore openings</span>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 2.5L11.5 7L7 11.5M2.5 7H11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              )}
            </div>
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
      {/* Explore openings placeholder — content to be implemented */}
      <div ref={exploreSectionRef} className="explore-openings-section">
        <h2>Explore Openings</h2>
        <p>Opening explorer coming soon...</p>
      </div>
    </div>
  );
};

export default ChessOpeningsExplorer;