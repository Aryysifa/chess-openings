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
export function getOptimalMove(moveHistory) {
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
    return {
      player: 2,
      possibleMoves: treeNode.moves,
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

  // Default strategy principles for later moves
  const game = new Connect4Game();
  moveHistory.forEach(col => game.makeMove(col));

  return {
    move: getBestMoveHeuristic(game),
    explanation: "Continue building threats in the center columns while blocking opponent's winning moves.",
    player: game.currentPlayer
  };
}

// Simple heuristic for move selection
function getBestMoveHeuristic(game) {
  const validMoves = game.getValidMoves();

  // Prioritize center columns
  const centerPriority = [3, 2, 4, 1, 5, 0, 6];

  for (const col of centerPriority) {
    if (validMoves.includes(col)) {
      return col;
    }
  }

  return validMoves[0] || 3;
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
