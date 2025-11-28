import React, { useState } from 'react';
import Header from '../../components/Header';
import Connect4Board from './Connect4Board';
import Connect4MoveOptions from './Connect4MoveOptions';
import { Connect4Game, getOptimalMove, getMoveExplanation } from './Connect4GameLogic';

const Connect4Guide = () => {
  const [game, setGame] = useState(() => {
    const newGame = new Connect4Game();
    return newGame;
  });
  const [winResult, setWinResult] = useState(null);
  const [currentExplanation, setCurrentExplanation] = useState(() => {
    const optimalInfo = getOptimalMove([]);
    return optimalInfo.explanation;
  });
  const [possibleMoves, setPossibleMoves] = useState(null);
  const [highlightedColumn, setHighlightedColumn] = useState(() => {
    const optimalInfo = getOptimalMove([]);
    return optimalInfo.move;
  });
  const [gameStarted, setGameStarted] = useState(true);

  const handleColumnClick = (col) => {
    if (game.isGameOver() || !gameStarted) return;

    const newGame = game.clone();
    const currentPlayer = newGame.currentPlayer;

    if (!newGame.makeMove(col)) return; // Invalid move

    // Check for win
    const winCheck = newGame.checkWin();
    if (winCheck) {
      setWinResult(winCheck);
      setGame(newGame);
      setCurrentExplanation(
        `Game Over! ${winCheck.winner === 1 ? 'Player 1 (Red)' : 'Player 2 (Yellow)'} wins!`
      );
      setPossibleMoves(null);
      setHighlightedColumn(null);
      return;
    }

    // Check for draw
    if (newGame.isDraw()) {
      setGame(newGame);
      setCurrentExplanation("Game Over! It's a draw!");
      setPossibleMoves(null);
      setHighlightedColumn(null);
      return;
    }

    const moveExplanation = getMoveExplanation(game.moveHistory, col);
    setGame(newGame);

    // Get next move suggestion
    const optimalInfo = getOptimalMove(newGame.moveHistory);

    if (optimalInfo.possibleMoves) {
      // Player has choices
      setPossibleMoves(optimalInfo.possibleMoves);
      setCurrentExplanation(optimalInfo.explanation);
      setHighlightedColumn(null);
    } else if (optimalInfo.move !== undefined) {
      // Show optimal move
      setCurrentExplanation(optimalInfo.explanation);
      setHighlightedColumn(optimalInfo.move);
      setPossibleMoves(null);
    }
  };

  const handleMoveSelection = (col) => {
    handleColumnClick(col);
  };

  const resetGame = () => {
    const newGame = new Connect4Game();
    setGame(newGame);
    setWinResult(null);
    const optimalInfo = getOptimalMove([]);
    setCurrentExplanation(optimalInfo.explanation);
    setHighlightedColumn(optimalInfo.move);
    setPossibleMoves(null);
    setGameStarted(true);
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
      {/* Subtle geometric pattern overlay */}
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

      {/* Introduction */}
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
          Connect 4 is a solved game - Player 1 can guarantee victory with optimal play. Any mistake allows Player 2 to force a draw.
        </h2>
      </div>

      {/* Main Content */}
      <div style={{
        padding: '2rem',
        maxWidth: '1600px',
        margin: '0 auto',
        width: '100%',
        position: 'relative',
        zIndex: 1,
        boxSizing: 'border-box'
      }}>
        {/* Interactive Connect4 Explorer */}
        <section id="interactive-explorer" style={{ marginBottom: '4rem', scrollMarginTop: '2rem' }}>
          <div style={{
            backgroundColor: '#1a1a1a',
            border: '1px solid #333',
            borderRadius: '12px',
            padding: '2rem',
            lineHeight: '1.8',
            color: '#e0e0e0'
          }}>
            {/* Controls */}
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
              </div>
            </div>

            {/* Board and Info Layout */}
            <div style={{
              display: 'flex',
              gap: '2rem',
              alignItems: 'start',
              flexWrap: 'wrap'
            }}>
              {/* Left Column - Board */}
              <div style={{ flex: '0 0 auto' }}>
                <Connect4Board
                  board={game.board}
                  onColumnClick={handleColumnClick}
                  highlightedColumn={highlightedColumn}
                  winningCells={winResult ? winResult.cells : []}
                />
              </div>

              {/* Right Column - Info and Move Options */}
              <div style={{ flex: '1 1 500px', minWidth: '300px' }}>
                {/* Explanation Panel */}
                <div style={{
                  background: '#252525',
                  borderRadius: '8px',
                  padding: '1rem',
                  border: '1px solid #444',
                  borderLeft: '4px solid #3498db',
                  marginBottom: '1.5rem'
                }}>
                  <h3 style={{
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    color: '#3498db',
                    marginBottom: '0.75rem',
                    marginTop: 0
                  }}>
                    Strategy Explanation
                  </h3>
                  <p style={{
                    color: '#d0d0d0',
                    lineHeight: '1.7',
                    margin: 0,
                    fontSize: '1rem'
                  }}>
                    {currentExplanation}
                  </p>

                  {highlightedColumn !== null && gameStarted && (
                    <div style={{
                      marginTop: '1rem',
                      padding: '1rem',
                      background: 'rgba(52, 152, 219, 0.1)',
                      borderRadius: '6px',
                      border: '1px solid rgba(52, 152, 219, 0.3)'
                    }}>
                      <div style={{ color: '#3498db', fontWeight: '600', marginBottom: '0.5rem' }}>
                        Recommended Move:
                      </div>
                      <div style={{ color: '#e0e0e0', fontSize: '1.1rem' }}>
                        ➜ Column {highlightedColumn + 1}
                      </div>
                      <div style={{ color: '#b0b0b0', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                        (Highlighted in blue on the board)
                      </div>
                    </div>
                  )}

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

                {/* Move Options - Now beside the board */}
                {possibleMoves && (
                  <div>
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
                        background: game.currentPlayer === 1 ? '#e74c3c' : '#f1c40f',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                      }}></div>
                      {game.currentPlayer === 1 ? 'Player 1 (Red)' : 'Player 2 (Yellow)'}'s Turn
                    </h3>

                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem'
                    }}>
                      {possibleMoves.map((moveOption, index) => {
                        const isOptimal = moveOption.isOptimal !== false;

                        return (
                          <button
                            key={index}
                            onClick={() => handleMoveSelection(moveOption.move)}
                            style={{
                              background: isOptimal
                                ? '#40916c'
                                : '#e85d04',
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
                              e.currentTarget.style.transform = 'translateX(4px)';
                              e.currentTarget.style.boxShadow = isOptimal
                                ? '0 4px 12px rgba(64, 145, 108, 0.4)'
                                : '0 4px 12px rgba(232, 93, 4, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'translateX(0)';
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
                                fontSize: '0.7rem',
                                fontWeight: '600',
                                color: '#fff'
                              }}>
                                ⭐ OPTIMAL
                              </div>
                            )}

                            <div style={{
                              fontSize: '0.95rem',
                              color: '#fff',
                              lineHeight: '1.5'
                            }}>
                              <span style={{ fontWeight: '600' }}>
                                {moveOption.label || `Column ${moveOption.move + 1}`}
                              </span>
                              {' - '}
                              <span style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                                {moveOption.explanation}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Player 1 Strategy Section */}
        <section id="player1-strategy" style={{ marginBottom: '4rem', scrollMarginTop: '2rem' }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#f0f0f0',
            marginBottom: '1.5rem',
            letterSpacing: '-0.025em'
          }}>
            Player 1 Strategy
          </h1>

          <div style={{
            backgroundColor: '#1a1a1a',
            border: '1px solid #333',
            borderRadius: '12px',
            padding: '2rem',
            lineHeight: '1.8',
            color: '#e0e0e0'
          }}>
            {/* Opening Move */}
            <h2 style={{ fontSize: '1.8rem', fontWeight: '600', color: '#f0f0f0', marginBottom: '1rem' }}>
              1. The Opening Move: Control the Center
            </h2>
            <p style={{ marginBottom: '1.5rem', color: '#d0d0d0' }}>
              The winning strategy for Player 1 begins with the first move. <strong>Always play in the center column (column 4)</strong>.
              This is the most strategically valuable position on the board because it:
            </p>
            <ul style={{ paddingLeft: '1.5rem', marginBottom: '2rem', lineHeight: '2', color: '#d0d0d0' }}>
              <li>Provides access to the most possible winning combinations (vertical, horizontal, and both diagonals)</li>
              <li>Forces Player 2 into a defensive position immediately</li>
              <li>Creates multiple threat paths that are difficult to defend simultaneously</li>
            </ul>

            {/* Understanding Threats */}
            <h2 style={{ fontSize: '1.8rem', fontWeight: '600', color: '#f0f0f0', marginBottom: '1rem', marginTop: '2rem' }}>
              2. Understanding Threats and Odd/Even Strategy
            </h2>
            <p style={{ marginBottom: '1.5rem', color: '#d0d0d0' }}>
              Connect 4 strategy revolves around controlling specific squares based on their <strong>vertical position</strong>:
            </p>
            <div style={{
              backgroundColor: '#252525',
              borderRadius: '8px',
              padding: '1.5rem',
              marginBottom: '1.5rem',
              border: '1px solid #444'
            }}>
              <p style={{ marginBottom: '1rem', color: '#e0e0e0' }}>
                <strong style={{ color: '#4CAF50' }}>Odd Rows (1, 3, 5)</strong> - Bottom, middle-low, middle-high
              </p>
              <p style={{ marginBottom: '1rem', color: '#e0e0e0' }}>
                <strong style={{ color: '#FF9800' }}>Even Rows (2, 4, 6)</strong> - Second from bottom, middle, top
              </p>
              <p style={{ margin: 0, color: '#b0b0b0', fontSize: '0.95rem' }}>
                The player who controls more odd-row squares in crucial columns typically wins. This is because
                pieces settle naturally, and controlling odd squares means you can block your opponent while building your own threats.
              </p>
            </div>

            {/* Core Winning Principles */}
            <h2 style={{ fontSize: '1.8rem', fontWeight: '600', color: '#f0f0f0', marginBottom: '1rem', marginTop: '2rem' }}>
              3. Core Winning Principles
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              <div style={{
                backgroundColor: '#252525',
                padding: '1.5rem',
                borderRadius: '8px',
                border: '1px solid #444'
              }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#4CAF50', marginBottom: '0.75rem' }}>
                  Build Multiple Threats
                </h3>
                <p style={{ fontSize: '0.95rem', color: '#c0c0c0', margin: 0 }}>
                  Create situations where you have two ways to win on your next turn. Your opponent can only block one,
                  guaranteeing your victory.
                </p>
              </div>
              <div style={{
                backgroundColor: '#252525',
                padding: '1.5rem',
                borderRadius: '8px',
                border: '1px solid #444'
              }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#2196F3', marginBottom: '0.75rem' }}>
                  Control the Center Three Columns
                </h3>
                <p style={{ fontSize: '0.95rem', color: '#c0c0c0', margin: 0 }}>
                  Columns 3, 4, and 5 are the most valuable. Prioritize placing pieces in these columns to maximize
                  your winning combinations.
                </p>
              </div>
              <div style={{
                backgroundColor: '#252525',
                padding: '1.5rem',
                borderRadius: '8px',
                border: '1px solid #444'
              }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#FF9800', marginBottom: '0.75rem' }}>
                  Think Vertically
                </h3>
                <p style={{ fontSize: '0.95rem', color: '#c0c0c0', margin: 0 }}>
                  Always consider what happens above your move. Giving your opponent a winning position directly
                  above your piece is a common losing mistake.
                </p>
              </div>
            </div>

            {/* Mid-Game Strategy */}
            <h2 style={{ fontSize: '1.8rem', fontWeight: '600', color: '#f0f0f0', marginBottom: '1rem', marginTop: '2rem' }}>
              4. Mid-Game Strategy
            </h2>
            <p style={{ marginBottom: '1rem', color: '#d0d0d0' }}>
              Once the center is established, follow these strategic priorities:
            </p>
            <ol style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem', lineHeight: '2', color: '#d0d0d0' }}>
              <li><strong>Force your opponent to play in outer columns (1, 2, 6, 7)</strong> - These columns provide fewer winning opportunities</li>
              <li><strong>Create "traps"</strong> - Build positions where your opponent must block one threat, but doing so creates another threat for you</li>
              <li><strong>Maintain vertical control</strong> - Keep track of column heights and ensure you're not giving your opponent advantageous positions</li>
              <li><strong>Build connected pieces horizontally and diagonally</strong> - Two pieces in a row can become three different threats</li>
            </ol>

            {/* Common Winning Patterns */}
            <h2 style={{ fontSize: '1.8rem', fontWeight: '600', color: '#f0f0f0', marginBottom: '1rem', marginTop: '2rem' }}>
              5. Common Winning Patterns
            </h2>
            <div style={{
              backgroundColor: '#252525',
              borderRadius: '8px',
              padding: '1.5rem',
              marginBottom: '1.5rem',
              border: '1px solid #444'
            }}>
              <p style={{ marginBottom: '1rem', color: '#e0e0e0' }}>
                <strong style={{ color: '#4CAF50' }}>The "7 Trap"</strong>
              </p>
              <p style={{ marginBottom: '1.5rem', color: '#c0c0c0', fontSize: '0.95rem' }}>
                Create three pieces in a row with open ends on both sides. Your opponent can only block one end,
                allowing you to complete four-in-a-row on the next turn. This is most powerful in rows 1 and 3.
              </p>

              <p style={{ marginBottom: '1rem', color: '#e0e0e0' }}>
                <strong style={{ color: '#2196F3' }}>Diagonal Dominance</strong>
              </p>
              <p style={{ marginBottom: '1.5rem', color: '#c0c0c0', fontSize: '0.95rem' }}>
                Build diagonal threats while forcing your opponent to defend horizontally or vertically.
                Diagonals are often overlooked and can lead to surprise wins.
              </p>

              <p style={{ marginBottom: '1rem', color: '#e0e0e0' }}>
                <strong style={{ color: '#FF9800' }}>The Fork</strong>
              </p>
              <p style={{ margin: 0, color: '#c0c0c0', fontSize: '0.95rem' }}>
                Position your pieces so that a single move creates two separate three-in-a-row threats.
                Your opponent can only block one, guaranteeing your victory on the next move.
              </p>
            </div>

            {/* Critical Mistakes to Avoid */}
            <h2 style={{ fontSize: '1.8rem', fontWeight: '600', color: '#f0f0f0', marginBottom: '1rem', marginTop: '2rem' }}>
              6. Critical Mistakes to Avoid
            </h2>
            <div style={{
              backgroundColor: '#2d1f1f',
              borderRadius: '8px',
              padding: '1.5rem',
              borderLeft: '4px solid #c62828'
            }}>
              <ul style={{ paddingLeft: '1.5rem', lineHeight: '2', margin: 0, color: '#e0e0e0' }}>
                <li><strong>Never create a "free win"</strong> - Don't place a piece that creates an empty square directly above it where your opponent can win immediately</li>
                <li><strong>Don't ignore vertical stacking</strong> - Always visualize how the column will look 2-3 moves ahead</li>
                <li><strong>Avoid playing too high too early</strong> - Building in upper rows without controlling the foundation often leads to defeat</li>
                <li><strong>Don't become predictable</strong> - If you only block threats without creating your own, you'll eventually lose to a double threat</li>
              </ul>
            </div>

            {/* Quick Reference */}
            <div style={{
              marginTop: '2rem',
              padding: '1.5rem',
              backgroundColor: '#1f2d1f',
              borderRadius: '8px',
              borderLeft: '4px solid #4CAF50'
            }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '600', color: '#f0f0f0', marginBottom: '1rem' }}>
                Quick Reference: Player 1 Winning Checklist
              </h3>
              <ul style={{ paddingLeft: '1.5rem', lineHeight: '2', margin: 0, color: '#e0e0e0' }}>
                <li>✓ First move: Center column (column 4)</li>
                <li>✓ Control columns 3, 4, and 5</li>
                <li>✓ Always check what's above your move</li>
                <li>✓ Build multiple simultaneous threats</li>
                <li>✓ Force opponent to outer columns</li>
                <li>✓ Think 2-3 moves ahead</li>
                <li>✓ Create "fork" situations when possible</li>
              </ul>
            </div>

            {/* Final Note */}
            <div style={{
              marginTop: '1.5rem',
              padding: '1rem',
              backgroundColor: '#2d2d1f',
              borderRadius: '8px',
              borderLeft: '4px solid #FF9800'
            }}>
              <p style={{ fontSize: '0.95rem', color: '#d0d0d0', margin: 0 }}>
                <strong>Remember:</strong> Connect 4 is a game of forced moves and pattern recognition. With perfect play,
                Player 1 always wins. However, even a single mistake can allow Player 2 to force a draw. Practice these
                principles, stay focused, and always think several moves ahead.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Connect4Guide;
