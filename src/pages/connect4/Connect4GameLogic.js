// Connect4 Game Logic and Optimal Strategy Tree

export class Connect4Game {
  constructor() {
    this.ROWS = 6;
    this.COLS = 7;
    this.board = this.createEmptyBoard();
    this.currentPlayer = 1; // 1 = Player 1 (Red), 2 = Player 2 (Yellow)
    this.moveHistory = [];
  }

  createEmptyBoard() {
    return Array(this.ROWS).fill(null).map(() => Array(this.COLS).fill(0));
  }

  clone() {
    const newGame = new Connect4Game();
    newGame.board = this.board.map(row => [...row]);
    newGame.currentPlayer = this.currentPlayer;
    newGame.moveHistory = [...this.moveHistory];
    return newGame;
  }

  makeMove(col) {
    if (col < 0 || col >= this.COLS) return false;

    // Find the lowest empty row in the column
    for (let row = this.ROWS - 1; row >= 0; row--) {
      if (this.board[row][col] === 0) {
        this.board[row][col] = this.currentPlayer;
        this.moveHistory.push(col);
        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
        return true;
      }
    }
    return false; // Column is full
  }

  undoMove() {
    if (this.moveHistory.length === 0) return false;

    const lastCol = this.moveHistory.pop();
    // Find the highest piece in the column and remove it
    for (let row = 0; row < this.ROWS; row++) {
      if (this.board[row][lastCol] !== 0) {
        this.board[row][lastCol] = 0;
        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
        return true;
      }
    }
    return false;
  }

  checkWin() {
    // Check horizontal
    for (let row = 0; row < this.ROWS; row++) {
      for (let col = 0; col < this.COLS - 3; col++) {
        if (this.board[row][col] !== 0 &&
            this.board[row][col] === this.board[row][col + 1] &&
            this.board[row][col] === this.board[row][col + 2] &&
            this.board[row][col] === this.board[row][col + 3]) {
          return {
            winner: this.board[row][col],
            cells: [[row, col], [row, col + 1], [row, col + 2], [row, col + 3]]
          };
        }
      }
    }

    // Check vertical
    for (let row = 0; row < this.ROWS - 3; row++) {
      for (let col = 0; col < this.COLS; col++) {
        if (this.board[row][col] !== 0 &&
            this.board[row][col] === this.board[row + 1][col] &&
            this.board[row][col] === this.board[row + 2][col] &&
            this.board[row][col] === this.board[row + 3][col]) {
          return {
            winner: this.board[row][col],
            cells: [[row, col], [row + 1, col], [row + 2, col], [row + 3, col]]
          };
        }
      }
    }

    // Check diagonal (down-right)
    for (let row = 0; row < this.ROWS - 3; row++) {
      for (let col = 0; col < this.COLS - 3; col++) {
        if (this.board[row][col] !== 0 &&
            this.board[row][col] === this.board[row + 1][col + 1] &&
            this.board[row][col] === this.board[row + 2][col + 2] &&
            this.board[row][col] === this.board[row + 3][col + 3]) {
          return {
            winner: this.board[row][col],
            cells: [[row, col], [row + 1, col + 1], [row + 2, col + 2], [row + 3, col + 3]]
          };
        }
      }
    }

    // Check diagonal (down-left)
    for (let row = 0; row < this.ROWS - 3; row++) {
      for (let col = 3; col < this.COLS; col++) {
        if (this.board[row][col] !== 0 &&
            this.board[row][col] === this.board[row + 1][col - 1] &&
            this.board[row][col] === this.board[row + 2][col - 2] &&
            this.board[row][col] === this.board[row + 3][col - 3]) {
          return {
            winner: this.board[row][col],
            cells: [[row, col], [row + 1, col - 1], [row + 2, col - 2], [row + 3, col - 3]]
          };
        }
      }
    }

    return null;
  }

  isDraw() {
    return this.board[0].every(cell => cell !== 0);
  }

  isGameOver() {
    return this.checkWin() !== null || this.isDraw();
  }

  getValidMoves() {
    const validMoves = [];
    for (let col = 0; col < this.COLS; col++) {
      if (this.board[0][col] === 0) {
        validMoves.push(col);
      }
    }
    return validMoves;
  }
}

// Optimal strategy tree with explanations
export const optimalMoveTree = {
  // Starting position
  position: [],
  player: 1,
  optimalMove: 3, // Column 4 (0-indexed as 3)
  explanation: "Player 1 should always start in the center column (column 4). This provides the maximum number of winning combinations and puts immediate pressure on Player 2.",
  children: [
    // Player 2's possible responses to center opening
    {
      position: [3],
      player: 2,
      moves: [
        {
          move: 2,
          label: "Column 3 (Defensive)",
          explanation: "Player 2 plays column 3 to contest the center area.",
          isOptimal: true,
          response: {
            optimalMove: 4,
            explanation: "Player 1 continues building central control by playing column 5. This creates a strong horizontal threat across columns 3-4-5."
          }
        },
        {
          move: 3,
          label: "Column 4 (Direct Contest)",
          explanation: "Player 2 plays directly above Player 1's piece.",
          isOptimal: true,
          response: {
            optimalMove: 2,
            explanation: "Player 1 extends to column 3, maintaining flexibility for both horizontal and diagonal threats."
          }
        },
        {
          move: 4,
          label: "Column 5 (Defensive)",
          explanation: "Player 2 mirrors the center strategy on the opposite side.",
          isOptimal: true,
          response: {
            optimalMove: 2,
            explanation: "Player 1 plays column 3 to build a horizontal threat. Now Player 1 controls columns 3 and 4, with column 5 contested."
          }
        },
        {
          move: 0,
          label: "Column 1 (Outer - Weak)",
          explanation: "Player 2 plays in the outer column. This is suboptimal as it doesn't contest the center.",
          isOptimal: false,
          response: {
            optimalMove: 2,
            explanation: "Player 1 immediately capitalizes by playing column 3, building a strong central position. Player 2's outer play gives Player 1 too much control."
          }
        },
        {
          move: 6,
          label: "Column 7 (Outer - Weak)",
          explanation: "Player 2 plays in the opposite outer column. Also suboptimal.",
          isOptimal: false,
          response: {
            optimalMove: 4,
            explanation: "Player 1 takes column 5, now controlling a dominant central position across columns 3-4-5."
          }
        }
      ]
    }
  ]
};

// Get the optimal move and explanation for a given position
export async function getOptimalMove(moveHistory) {
  if (moveHistory.length === 0) {
    return {
      move: 3,
      explanation: "Player 1 should always start in the center column (column 4). This provides the maximum number of winning combinations and puts immediate pressure on Player 2.",
      player: 1
    };
  }

  // For positions after the first move, find the corresponding node in the tree
  if (moveHistory.length === 1 && moveHistory[0] === 3) {
    const treeNode = optimalMoveTree.children[0];
    // Find the first optimal move to use as default highlight
    const firstOptimalMove = treeNode.moves.find(m => m.isOptimal !== false);
    return {
      player: 2,
      possibleMoves: treeNode.moves,
      move: firstOptimalMove ? firstOptimalMove.move : treeNode.moves[0].move,
      explanation: "Player 2 must now respond to Player 1's central opening. The best moves contest the center or adjacent columns."
    };
  }

  if (moveHistory.length === 2) {
    const player2Move = moveHistory[1];
    const treeNode = optimalMoveTree.children[0];
    const moveOption = treeNode.moves.find(m => m.move === player2Move);

    if (moveOption && moveOption.response) {
      return {
        move: moveOption.response.optimalMove,
        explanation: moveOption.response.explanation,
        player: 1
      };
    }
  }

  // Extended opening book for Player 1's winning strategy
  // This follows the "Zugzwang" strategy - controlling key squares
  const game = new Connect4Game();
  moveHistory.forEach(col => game.makeMove(col));

  // For all other positions, use the perfect play API
  // This provides mathematically proven optimal moves
  try {
    const apiMove = await getPerfectMove(game);
    if (apiMove !== null) {
      // Prefetch next possible positions in the background
      prefetchNextPositions(game);

      // Generate a detailed explanation for this move
      const explanation = generateMoveExplanation(game, apiMove);

      return {
        move: apiMove,
        explanation: explanation,
        player: game.currentPlayer
      };
    }
  } catch (error) {
    console.error("Failed to fetch perfect move from API, falling back to local AI:", error);
  }

  // Fallback to local minimax if API fails
  const bestMove = findBestMove(game);

  return {
    move: bestMove,
    explanation: "Searching for the best move using tactical analysis. Building threats while blocking opponent's winning chances.",
    player: game.currentPlayer
  };
}

// Generate a detailed explanation for why a move is optimal
function generateMoveExplanation(game, moveCol) {
  const testGame = game.clone();
  const currentPlayer = game.currentPlayer;
  const opponent = currentPlayer === 1 ? 2 : 1;

  testGame.makeMove(moveCol);

  // Check if this move wins immediately
  const winCheck = testGame.checkWin();
  if (winCheck && winCheck.winner === currentPlayer) {
    return `Column ${moveCol + 1} wins the game immediately! This creates four in a row and secures victory.`;
  }

  // Check if this move blocks an opponent win
  const blockingWin = checkIfBlockingWin(game, moveCol, opponent);
  if (blockingWin) {
    return `Column ${moveCol + 1} is critical - it blocks ${opponent === 1 ? 'Player 1 (Red)' : 'Player 2 (Yellow)'} from winning on their next move. This defensive play is essential.`;
  }

  // Count threats created by this move
  const threatsCreated = countThreats(testGame, currentPlayer);
  const opponentThreats = countThreats(testGame, opponent);

  // Analyze position type
  const isCenter = moveCol === 3;
  const isNearCenter = moveCol === 2 || moveCol === 4;
  const columnHeight = getColumnHeight(game.board, moveCol);

  // Build explanation based on strategic factors
  let explanation = `Column ${moveCol + 1} `;

  if (threatsCreated > opponentThreats + 1) {
    explanation += `creates multiple winning threats (${threatsCreated} potential four-in-a-rows), putting significant pressure on the opponent.`;
  } else if (threatsCreated > 0) {
    explanation += `builds a strong threat while maintaining defensive coverage.`;
  } else if (isCenter) {
    explanation += `maintains central control, maximizing future winning possibilities and restricting opponent options.`;
  } else if (isNearCenter) {
    explanation += `strengthens the center position, building connected pieces for future diagonal and horizontal threats.`;
  } else if (opponentThreats > 0) {
    explanation += `neutralizes opponent threats while maintaining a solid position.`;
  } else if (columnHeight === 0) {
    explanation += `establishes a foundation in a key column, preparing for future vertical and diagonal connections.`;
  } else {
    explanation += `continues optimal strategy, maintaining the best winning chances with perfect play.`;
  }

  // Add tactical note if relevant
  if (threatsCreated >= 2) {
    explanation += ` With ${threatsCreated} active threats, the opponent must defend multiple positions simultaneously.`;
  }

  return explanation;
}

// Check if a move blocks opponent's winning move
function checkIfBlockingWin(game, moveCol, opponent) {
  // Test if opponent could win in that column
  const testGame = game.clone();
  testGame.currentPlayer = opponent;
  testGame.makeMove(moveCol);
  const winCheck = testGame.checkWin();
  return winCheck && winCheck.winner === opponent;
}

// Prefetch next positions in the background to speed up future moves
function prefetchNextPositions(game) {
  const validMoves = game.getValidMoves();

  // Prefetch up to 3 most likely next positions (center columns first)
  const movesToPrefetch = validMoves
    .sort((a, b) => Math.abs(a - 3) - Math.abs(b - 3))
    .slice(0, 3);

  movesToPrefetch.forEach(col => {
    const testGame = game.clone();
    testGame.makeMove(col);

    // Fire and forget - don't await
    getPerfectMove(testGame).catch(() => {
      // Silently ignore prefetch errors
    });
  });
}

// Cache for API responses to avoid redundant calls
const moveCache = new Map();

// Get perfect move from external API database
async function getPerfectMove(game) {
  // Convert board to API format: 42 characters (left to right, top to bottom)
  // 0 = empty, 1 = player 1, 2 = player 2
  let boardString = '';
  for (let row = 0; row < game.ROWS; row++) {
    for (let col = 0; col < game.COLS; col++) {
      boardString += game.board[row][col].toString();
    }
  }

  const player = game.currentPlayer;
  const cacheKey = `${boardString}-${player}`;

  // Check cache first
  if (moveCache.has(cacheKey)) {
    return moveCache.get(cacheKey);
  }

  const apiUrl = `https://kevinalbs.com/connect4/back-end/index.php/getMoves?board_data=${boardString}&player=${player}`;

  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  const scores = await response.json();

  // Find the move with the highest score
  let bestMove = null;
  let bestScore = -Infinity;

  for (const [colStr, score] of Object.entries(scores)) {
    const col = parseInt(colStr);
    if (score > bestScore) {
      bestScore = score;
      bestMove = col;
    }
  }

  // Cache the result
  moveCache.set(cacheKey, bestMove);

  return bestMove;
}

// Get all moves with scores from the perfect play API
export async function getAllMovesWithScores(game) {
  // Convert board to API format
  let boardString = '';
  for (let row = 0; row < game.ROWS; row++) {
    for (let col = 0; col < game.COLS; col++) {
      boardString += game.board[row][col].toString();
    }
  }

  const player = game.currentPlayer;
  const cacheKey = `${boardString}-${player}-all`;

  // Check cache first
  if (moveCache.has(cacheKey)) {
    return moveCache.get(cacheKey);
  }

  const apiUrl = `https://kevinalbs.com/connect4/back-end/index.php/getMoves?board_data=${boardString}&player=${player}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      return [];
    }

    const scores = await response.json();
    const validMoves = game.getValidMoves();

    // Convert to array of move objects
    const moves = validMoves.map(col => ({
      column: col,
      score: scores[col] !== undefined ? scores[col] : 0,
      player: game.currentPlayer,
      explanation: generateMoveExplanation(game, col)
    }));

    // Sort by score (descending)
    moves.sort((a, b) => b.score - a.score);

    // Cache the result
    moveCache.set(cacheKey, moves);

    return moves;
  } catch (error) {
    console.error('Error fetching moves with scores:', error);
    return [];
  }
}

// Build the game tree with perfect play data
export async function buildGameTree(game, depth = 2) {
  const root = {
    position: getBoardString(game),
    moves: [],
    children: new Map(),
    depth: 0,
    column: null,
    path: []
  };

  // Get moves for root position
  const rootMoves = await getAllMovesWithScores(game);
  root.moves = rootMoves;

  // Recursively build tree
  const buildRecursive = async (node, currentGame, currentDepth, currentPath = []) => {
    if (currentDepth >= depth || !node.moves || node.moves.length === 0) {
      return;
    }

    // Only expand the top 3 moves to keep tree manageable
    const topMoves = node.moves.slice(0, Math.min(3, node.moves.length));

    for (const moveData of topMoves) {
      const testGame = currentGame.clone();
      if (!testGame.makeMove(moveData.column)) continue;

      // Don't expand if game is over
      if (testGame.isGameOver()) continue;

      const childPosition = getBoardString(testGame);
      const childMoves = await getAllMovesWithScores(testGame);

      const childNode = {
        position: childPosition,
        moves: childMoves,
        children: new Map(),
        depth: currentDepth + 1,
        column: moveData.column,
        path: [...currentPath, moveData.column]
      };

      node.children.set(moveData.column, childNode);

      // Recursively build children
      await buildRecursive(childNode, testGame, currentDepth + 1, childNode.path);
    }
  };

  await buildRecursive(root, game, 0, []);

  return root;
}

// Helper to get board string
function getBoardString(game) {
  let boardString = '';
  for (let row = 0; row < game.ROWS; row++) {
    for (let col = 0; col < game.COLS; col++) {
      boardString += game.board[row][col].toString();
    }
  }
  return boardString;
}

// Opening book with proven winning lines
function getOpeningBookMove(moveHistory, game) {
  const currentPlayer = game.currentPlayer;
  const validMoves = game.getValidMoves();

  // Always check for immediate wins first
  for (const col of validMoves) {
    const testGame = game.clone();
    testGame.makeMove(col);
    if (testGame.checkWin()?.winner === currentPlayer) {
      return col;
    }
  }

  // Always block immediate opponent threats
  const opponent = currentPlayer === 1 ? 2 : 1;
  for (const col of validMoves) {
    const testGame = game.clone();
    testGame.currentPlayer = opponent;
    testGame.makeMove(col);
    if (testGame.checkWin()?.winner === opponent) {
      return col; // Must block
    }
  }

  // For Player 1: Use center-focused aggressive strategy
  if (currentPlayer === 1) {
    // Strategy: Build in columns 2-3-4-5 (center four)
    // Avoid columns 0, 1, 6 unless necessary
    // Never give opponent a setup move

    const centerPriority = [3, 2, 4, 1, 5]; // Prefer center, avoid edges

    for (const col of centerPriority) {
      if (!validMoves.includes(col)) continue;

      // Check if this move is safe (doesn't give opponent an immediate win setup)
      const testGame = game.clone();
      testGame.makeMove(col);

      // Make sure opponent can't win on next move
      if (!canWinNextMove(testGame, opponent)) {
        // Additionally check if opponent can't create an unstoppable double threat
        const opponentBestMove = findBestMoveQuick(testGame);
        if (opponentBestMove !== null) {
          const testGame2 = testGame.clone();
          testGame2.makeMove(opponentBestMove);

          // If opponent still can't win after their best reply, this move is good
          if (!canWinNextMove(testGame2, currentPlayer) ||
              testGame2.checkWin()?.winner !== opponent) {
            return col;
          }
        } else {
          return col;
        }
      }
    }

    // If no safe center move, pick safest available
    for (const col of validMoves) {
      const testGame = game.clone();
      testGame.makeMove(col);
      if (!canWinNextMove(testGame, opponent)) {
        return col;
      }
    }

    // Last resort: pick the least bad move
    return centerPriority.find(col => validMoves.includes(col)) || validMoves[0];
  }

  // For Player 2: Use minimax
  return null;
}

// Quick heuristic to find opponent's likely best move (faster than full minimax)
function findBestMoveQuick(game) {
  const validMoves = game.getValidMoves();
  if (validMoves.length === 0) return null;

  const opponent = game.currentPlayer;

  // Check if opponent has winning move
  for (const col of validMoves) {
    const testGame = game.clone();
    testGame.makeMove(col);
    if (testGame.checkWin()?.winner === opponent) {
      return col;
    }
  }

  // Check if opponent needs to block
  const us = opponent === 1 ? 2 : 1;
  for (const col of validMoves) {
    const testGame = game.clone();
    testGame.currentPlayer = us;
    testGame.makeMove(col);
    if (testGame.checkWin()?.winner === us) {
      return col;
    }
  }

  // Otherwise return center preference
  const centerPref = [3, 2, 4, 1, 5, 0, 6];
  return centerPref.find(col => validMoves.includes(col)) || validMoves[0];
}

// Check if a player can win on their next move
function canWinNextMove(game, player) {
  const validMoves = game.getValidMoves();
  for (const col of validMoves) {
    const testGame = game.clone();
    testGame.makeMove(col);
    if (testGame.checkWin()?.winner === player) {
      return true;
    }
  }
  return false;
}

// Minimax algorithm with alpha-beta pruning to find optimal move
function findBestMove(game) {
  const validMoves = game.getValidMoves();
  if (validMoves.length === 0) return 3;

  // First check for immediate win
  for (const col of validMoves) {
    const testGame = game.clone();
    testGame.makeMove(col);
    if (testGame.checkWin()?.winner === game.currentPlayer) {
      return col;
    }
  }

  // Then check for immediate block
  const opponent = game.currentPlayer === 1 ? 2 : 1;
  for (const col of validMoves) {
    const testGame = game.clone();
    testGame.currentPlayer = opponent;
    testGame.makeMove(col);
    if (testGame.checkWin()?.winner === opponent) {
      return col;
    }
  }

  // Use minimax with adaptive depth
  // More depth for simpler positions, less for complex early game
  const moveCount = game.moveHistory.length;
  let depth;
  if (moveCount < 10) {
    depth = 7; // Early game: moderate depth
  } else if (moveCount < 20) {
    depth = 8; // Mid game: deeper search
  } else {
    depth = 10; // Endgame: deepest search (fewer positions)
  }

  let bestScore = -Infinity;
  let bestMove = validMoves[0];

  for (const col of validMoves) {
    const testGame = game.clone();
    testGame.makeMove(col);
    const score = minimax(testGame, depth - 1, -Infinity, Infinity, false, game.currentPlayer);

    if (score > bestScore) {
      bestScore = score;
      bestMove = col;
    }
  }

  return bestMove;
}

// Minimax with alpha-beta pruning
function minimax(game, depth, alpha, beta, isMaximizing, originalPlayer) {
  // Terminal conditions
  const winCheck = game.checkWin();
  if (winCheck) {
    if (winCheck.winner === originalPlayer) {
      return 1000 + depth; // Prefer faster wins
    } else {
      return -1000 - depth; // Delay losses
    }
  }

  if (game.isDraw() || depth === 0) {
    return evaluatePosition(game, originalPlayer);
  }

  const validMoves = game.getValidMoves();
  if (validMoves.length === 0) {
    return 0; // Draw
  }

  if (isMaximizing) {
    let maxScore = -Infinity;
    for (const col of validMoves) {
      const testGame = game.clone();
      testGame.makeMove(col);
      const score = minimax(testGame, depth - 1, alpha, beta, false, originalPlayer);
      maxScore = Math.max(maxScore, score);
      alpha = Math.max(alpha, score);
      if (beta <= alpha) break; // Alpha-beta pruning
    }
    return maxScore;
  } else {
    let minScore = Infinity;
    for (const col of validMoves) {
      const testGame = game.clone();
      testGame.makeMove(col);
      const score = minimax(testGame, depth - 1, alpha, beta, true, originalPlayer);
      minScore = Math.min(minScore, score);
      beta = Math.min(beta, score);
      if (beta <= alpha) break; // Alpha-beta pruning
    }
    return minScore;
  }
}

// Evaluate a position for the given player
function evaluatePosition(game, player) {
  let score = 0;
  const opponent = player === 1 ? 2 : 1;

  // Count threats for both players
  const playerThreats = countThreats(game, player);
  const opponentThreats = countThreats(game, opponent);

  score += playerThreats * 10;
  score -= opponentThreats * 10;

  // Count two-in-a-rows
  score += countTwoInRow(game, player) * 3;
  score -= countTwoInRow(game, opponent) * 3;

  // Center column control bonus
  for (let row = 0; row < game.ROWS; row++) {
    if (game.board[row][3] === player) score += 5;
    if (game.board[row][3] === opponent) score -= 5;
  }

  return score;
}

// Count potential two-in-a-rows (pairs that could become threats)
function countTwoInRow(game, player) {
  let count = 0;
  const ROWS = game.ROWS;
  const COLS = game.COLS;
  const board = game.board;

  // Check horizontal
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS - 3; col++) {
      const segment = [board[row][col], board[row][col + 1], board[row][col + 2], board[row][col + 3]];
      if (segment.filter(c => c === player).length === 2 && segment.filter(c => c === 0).length === 2) {
        count++;
      }
    }
  }

  // Check vertical
  for (let row = 0; row < ROWS - 3; row++) {
    for (let col = 0; col < COLS; col++) {
      const segment = [board[row][col], board[row + 1][col], board[row + 2][col], board[row + 3][col]];
      if (segment.filter(c => c === player).length === 2 && segment.filter(c => c === 0).length === 2) {
        count++;
      }
    }
  }

  // Check diagonals
  for (let row = 0; row < ROWS - 3; row++) {
    for (let col = 0; col < COLS - 3; col++) {
      const segment = [board[row][col], board[row + 1][col + 1], board[row + 2][col + 2], board[row + 3][col + 3]];
      if (segment.filter(c => c === player).length === 2 && segment.filter(c => c === 0).length === 2) {
        count++;
      }
    }
  }

  for (let row = 0; row < ROWS - 3; row++) {
    for (let col = 3; col < COLS; col++) {
      const segment = [board[row][col], board[row + 1][col - 1], board[row + 2][col - 2], board[row + 3][col - 3]];
      if (segment.filter(c => c === player).length === 2 && segment.filter(c => c === 0).length === 2) {
        count++;
      }
    }
  }

  return count;
}

// Improved heuristic for move selection (kept as fallback but not currently used)
function getBestMoveHeuristic(game) {
  const validMoves = game.getValidMoves();
  if (validMoves.length === 0) return 3;

  // 1. Check if we can win immediately
  for (const col of validMoves) {
    const testGame = game.clone();
    testGame.makeMove(col);
    const winCheck = testGame.checkWin();
    if (winCheck && winCheck.winner === game.currentPlayer) {
      return col;
    }
  }

  // 2. Block opponent's winning move
  const opponent = game.currentPlayer === 1 ? 2 : 1;
  for (const col of validMoves) {
    const testGame = game.clone();
    testGame.currentPlayer = opponent; // Temporarily switch to opponent
    testGame.makeMove(col);
    const winCheck = testGame.checkWin();
    if (winCheck && winCheck.winner === opponent) {
      return col; // Block this winning move
    }
  }

  // 3. Avoid moves that give opponent a winning position
  const safeMoves = validMoves.filter(col => {
    const testGame = game.clone();
    testGame.makeMove(col);

    // Check if opponent can win on their next move
    const opponentValidMoves = testGame.getValidMoves();
    for (const opponentCol of opponentValidMoves) {
      const opponentTestGame = testGame.clone();
      opponentTestGame.makeMove(opponentCol);
      const winCheck = opponentTestGame.checkWin();
      if (winCheck && winCheck.winner === opponent) {
        return false; // This move gives opponent a win - avoid it
      }
    }
    return true;
  });

  // Use safe moves if available, otherwise use all valid moves
  const movesToConsider = safeMoves.length > 0 ? safeMoves : validMoves;

  // 4. Evaluate remaining moves based on strategic value
  const moveScores = movesToConsider.map(col => {
    let score = 0;
    const testGame = game.clone();
    testGame.makeMove(col);

    // Prefer center columns
    const centerDistance = Math.abs(col - 3);
    score += (3 - centerDistance) * 10;

    // Count potential threats created
    score += countThreats(testGame, game.currentPlayer) * 5;

    // Penalize high column fills (prefer lower rows)
    const columnHeight = getColumnHeight(game.board, col);
    score -= columnHeight * 2;

    return { col, score };
  });

  // Sort by score and return best move
  moveScores.sort((a, b) => b.score - a.score);
  return moveScores[0].col;
}

// Helper function to count the number of threats (potential wins) for a player
function countThreats(game, player) {
  let threats = 0;
  const ROWS = game.ROWS;
  const COLS = game.COLS;
  const board = game.board;

  // Check horizontal threats (3 in a row with an empty space)
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS - 3; col++) {
      const segment = [board[row][col], board[row][col + 1], board[row][col + 2], board[row][col + 3]];
      if (segment.filter(c => c === player).length === 3 && segment.filter(c => c === 0).length === 1) {
        threats++;
      }
    }
  }

  // Check vertical threats
  for (let row = 0; row < ROWS - 3; row++) {
    for (let col = 0; col < COLS; col++) {
      const segment = [board[row][col], board[row + 1][col], board[row + 2][col], board[row + 3][col]];
      if (segment.filter(c => c === player).length === 3 && segment.filter(c => c === 0).length === 1) {
        threats++;
      }
    }
  }

  // Check diagonal threats (down-right)
  for (let row = 0; row < ROWS - 3; row++) {
    for (let col = 0; col < COLS - 3; col++) {
      const segment = [board[row][col], board[row + 1][col + 1], board[row + 2][col + 2], board[row + 3][col + 3]];
      if (segment.filter(c => c === player).length === 3 && segment.filter(c => c === 0).length === 1) {
        threats++;
      }
    }
  }

  // Check diagonal threats (down-left)
  for (let row = 0; row < ROWS - 3; row++) {
    for (let col = 3; col < COLS; col++) {
      const segment = [board[row][col], board[row + 1][col - 1], board[row + 2][col - 2], board[row + 3][col - 3]];
      if (segment.filter(c => c === player).length === 3 && segment.filter(c => c === 0).length === 1) {
        threats++;
      }
    }
  }

  return threats;
}

// Helper function to get the height of a column (number of pieces in it)
function getColumnHeight(board, col) {
  let height = 0;
  for (let row = board.length - 1; row >= 0; row--) {
    if (board[row][col] !== 0) {
      height++;
    } else {
      break;
    }
  }
  return height;
}

export function getMoveExplanation(moveHistory, move) {
  if (moveHistory.length === 0 && move === 3) {
    return "Opening in the center column (column 4) is always optimal for Player 1.";
  }

  if (moveHistory.length === 1 && moveHistory[0] === 3) {
    const treeNode = optimalMoveTree.children[0];
    const moveOption = treeNode.moves.find(m => m.move === move);
    return moveOption ? moveOption.explanation : "This move is playable but not optimal.";
  }

  return "This move follows general strategic principles.";
}
