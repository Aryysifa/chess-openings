import React, { useState, useEffect, useRef } from 'react';
import Header from '../../components/Header';
import Connect4Board from './Connect4Board';
import { Connect4Tree } from './Connect4Tree';
import Connect4TreeManager from './Connect4TreeManager';
import { Connect4Game, getAllMovesWithScores, buildGameTree } from './Connect4GameLogic';

const Connect4Guide = () => {
  const [game, setGame] = useState(() => new Connect4Game());
  const [winResult, setWinResult] = useState(null);
  const [highlightedColumn, setHighlightedColumn] = useState(3);
  const [gameStarted, setGameStarted] = useState(true);
  const [isLoadingTree, setIsLoadingTree] = useState(false);

  // Tree manager instance
  const treeManagerRef = useRef(null);
  if (!treeManagerRef.current) {
    treeManagerRef.current = new Connect4TreeManager();
  }
  const treeManager = treeManagerRef.current;

  // Initialize tree on mount
  useEffect(() => {
    const initializeTree = async () => {
      setIsLoadingTree(true);
      try {
        const newGame = new Connect4Game();
        // Use depth 1 for faster initial load - tree will expand as user explores
        const tree = await buildGameTree(newGame, 1);
        treeManager.setRoot(tree);
      } catch (error) {
        console.error("Error initializing game tree:", error);
        // Set empty root to show at least something
        treeManager.setRoot({
          position: '',
          moves: [],
          children: new Map(),
          depth: 0,
          column: null,
          path: []
        });
      } finally {
        setIsLoadingTree(false);
      }
    };

    initializeTree();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update tree when game state changes (only for board clicks, not tree navigation)
  useEffect(() => {
    const updateTree = async () => {
      if (game.moveHistory.length === 0) return;

      // Check if this position already has data in the tree
      const node = treeManager.traverse(game.moveHistory);
      if (node && node.moves && node.moves.length > 0) {
        // Already have data for this position
        setHighlightedColumn(node.moves[0].column);
        return;
      }

      // Need to fetch data for this position
      setIsLoadingTree(true);
      try {
        const moves = await getAllMovesWithScores(game);
        const position = game.moveHistory.join(',');
        treeManager.addMoves(position, moves, game.moveHistory);

        if (moves.length > 0) {
          setHighlightedColumn(moves[0].column);
        }
      } catch (error) {
        console.error("Error updating tree:", error);
      } finally {
        setIsLoadingTree(false);
      }
    };

    updateTree();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.moveHistory.length]);

  const handleColumnClick = async (col) => {
    if (game.isGameOver() || !gameStarted || isLoadingTree) return;

    const newGame = game.clone();
    if (!newGame.makeMove(col)) return;

    const winCheck = newGame.checkWin();
    if (winCheck) {
      setWinResult(winCheck);
      setGame(newGame);
      setHighlightedColumn(null);
      return;
    }

    if (newGame.isDraw()) {
      setGame(newGame);
      setHighlightedColumn(null);
      return;
    }

    setGame(newGame);

    setIsLoadingTree(true);
    try {
      const moves = await getAllMovesWithScores(newGame);
      const position = newGame.moveHistory.join(',');
      treeManager.addMoves(position, moves, newGame.moveHistory);

      if (moves.length > 0) {
        setHighlightedColumn(moves[0].column);
      }
    } catch (error) {
      console.error("Error updating tree:", error);
    } finally {
      setIsLoadingTree(false);
    }
  };

  const handleSelectMove = async (movePath) => {
    const newGame = new Connect4Game();
    for (const col of movePath) {
      newGame.makeMove(col);
    }
    setGame(newGame);

    // Check if this position already exists in the tree
    const node = treeManager.traverse(movePath);
    if (!node || !node.moves || node.moves.length === 0) {
      // Position not in tree, fetch data
      setIsLoadingTree(true);
      try {
        const moves = await getAllMovesWithScores(newGame);
        const position = newGame.moveHistory.join(',');
        treeManager.addMoves(position, moves, newGame.moveHistory);

        if (moves.length > 0) {
          setHighlightedColumn(moves[0].column);
        }
      } catch (error) {
        console.error("Error updating tree:", error);
      } finally {
        setIsLoadingTree(false);
      }
    } else {
      // Position exists in tree, just update highlight
      if (node.moves.length > 0) {
        setHighlightedColumn(node.moves[0].column);
      }
    }
  };

  const resetGame = async () => {
    const newGame = new Connect4Game();
    setGame(newGame);
    setWinResult(null);
    setHighlightedColumn(3);
    setGameStarted(true);

    setIsLoadingTree(true);
    try {
      // Use depth 1 for faster load
      const tree = await buildGameTree(newGame, 1);
      treeManager.setRoot(tree);
    } catch (error) {
      console.error("Error rebuilding tree:", error);
    } finally {
      setIsLoadingTree(false);
    }
  };

  const handleBack = () => {
    if (game.moveHistory.length === 0) return;
    const newGame = game.clone();
    newGame.moveHistory.pop();
    newGame.board = new Connect4Game().board;
    for (const col of newGame.moveHistory) {
      newGame.makeMove(col);
    }
    setGame(newGame);
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      maxWidth: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0f0f0f 100%)',
      position: 'relative',
      overflowX: 'hidden',
      margin: 0,
      padding: 0
    }}>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          radial-gradient(circle at 20% 30%, rgba(69, 139, 116, 0.03) 0%, transparent 50%),
          radial-gradient(circle at 80% 70%, rgba(69, 139, 116, 0.03) 0%, transparent 50%)
        `,
        pointerEvents: 'none',
        zIndex: 0
      }}></div>

      <Header title="Connect4 Guide" />

      <div style={{ padding: '0.5rem 2rem 1rem 2rem', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <h2 style={{
          fontSize: '1.1rem',
          fontWeight: '300',
          color: '#e0e0e0',
          margin: '0',
          letterSpacing: '0.025em',
          maxWidth: '900px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          Connect 4 is a mathematically solved game - Player 1 can force a win with perfect play. This guide uses a complete perfect play database to show optimal moves in an explorable tree.
        </h2>
      </div>

      <div style={{
        padding: '2rem',
        maxWidth: '1600px',
        margin: '0 auto',
        width: '100%',
        position: 'relative',
        zIndex: 1,
        boxSizing: 'border-box'
      }}>
        <section id="interactive-explorer" style={{ marginBottom: '4rem', scrollMarginTop: '2rem' }}>
          <div style={{
            backgroundColor: '#1a1a1a',
            border: '1px solid #333',
            borderRadius: '12px',
            padding: '2rem',
            lineHeight: '1.8',
            color: '#e0e0e0'
          }}>
            <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <button
                onClick={resetGame}
                style={{
                  background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.75rem 1.5rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 12px rgba(52, 152, 219, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                Reset Game
              </button>

              <button
                onClick={handleBack}
                disabled={game.moveHistory.length === 0}
                style={{
                  background: game.moveHistory.length === 0
                    ? '#444'
                    : 'linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.75rem 1rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: game.moveHistory.length === 0 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  opacity: game.moveHistory.length === 0 ? 0.5 : 1
                }}
              >
                ← Back
              </button>

              <div style={{
                flex: 1,
                minWidth: '200px',
                background: '#252525',
                borderRadius: '8px',
                padding: '0.75rem 1rem',
                border: '1px solid #444',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: game.currentPlayer === 1 ? '#e74c3c' : '#f1c40f'
                }}></div>
                <span style={{ color: '#e0e0e0', fontSize: '0.95rem', fontWeight: '500' }}>
                  Current: {game.currentPlayer === 1 ? 'Player 1 (Red)' : 'Player 2 (Yellow)'}
                </span>
                <span style={{
                  marginLeft: 'auto',
                  color: '#95a5a6',
                  fontSize: '0.85rem',
                  fontWeight: '500'
                }}>
                  Move {game.moveHistory.length + 1}
                </span>
              </div>
            </div>

            <div style={{
              display: 'flex',
              gap: '2rem',
              alignItems: 'start',
              flexWrap: 'wrap'
            }}>
              <div style={{ flex: '0 0 auto' }}>
                <Connect4Board
                  board={game.board}
                  onColumnClick={handleColumnClick}
                  highlightedColumn={highlightedColumn}
                  winningCells={winResult ? winResult.cells : []}
                />
              </div>

              <div style={{ flex: '1 1 700px', minWidth: '500px' }}>
                <div style={{
                  background: '#252525',
                  borderRadius: '8px',
                  padding: '1rem',
                  border: '1px solid #444',
                  borderLeft: '4px solid #e74c3c'
                }}>
                  <h3 style={{
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    color: '#e74c3c',
                    marginBottom: '1rem',
                    marginTop: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    Game Tree Explorer
                    {isLoadingTree && (
                      <div style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid #e74c3c',
                        borderTopColor: 'transparent',
                        borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite'
                      }}></div>
                    )}
                  </h3>

                  <Connect4Tree
                    moveHistory={game.moveHistory}
                    onSelectMove={handleSelectMove}
                    completeTree={treeManager.root}
                    isLoading={isLoadingTree}
                  />

                  {winResult && (
                    <div style={{
                      marginTop: '1rem',
                      padding: '1rem',
                      background: winResult.winner === 1
                        ? 'rgba(231, 76, 60, 0.15)'
                        : 'rgba(241, 196, 15, 0.15)',
                      borderRadius: '6px',
                      border: `2px solid ${winResult.winner === 1 ? '#e74c3c' : '#f1c40f'}`
                    }}>
                      <div style={{
                        color: '#f0f0f0',
                        fontWeight: '700',
                        fontSize: '1.2rem',
                        textAlign: 'center'
                      }}>
                        🏆 {winResult.winner === 1 ? 'Player 1 Wins!' : 'Player 2 Wins!'}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Connect4Guide;
