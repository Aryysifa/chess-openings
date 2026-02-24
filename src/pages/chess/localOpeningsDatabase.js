// Comprehensive local chess openings database with tree structure
// This provides fast access without API calls and avoids circular references

export const localOpeningsTree = {
  // Root position
  fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  moves: [
    {
      move: "e4",
      name: "King's Pawn",
      eco: "B00-C99",
      winRate: 54.5,
      drawRate: 23.2,
      loseRate: 22.3,
      totalGames: 2500000,
      popularity: 45
    },
    {
      move: "d4",
      name: "Queen's Pawn",
      eco: "A40-E99",
      winRate: 55.1,
      drawRate: 27.8,
      loseRate: 17.1,
      totalGames: 2200000,
      popularity: 40
    },
    {
      move: "Nf3",
      name: "Réti Opening",
      eco: "A04-A09",
      winRate: 52.3,
      drawRate: 31.2,
      loseRate: 16.5,
      totalGames: 800000,
      popularity: 10
    },
    {
      move: "c4",
      name: "English Opening",
      eco: "A10-A39",
      winRate: 53.8,
      drawRate: 29.4,
      loseRate: 16.8,
      totalGames: 750000,
      popularity: 5
    }
  ]
};

// Main variations database - organized by move sequence
export const openingVariations = {
  // 1.e4 variations
  "e4": {
    fen: "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
    moves: [
      {
        move: "e5",
        name: "Open Game",
        eco: "C20-C99",
        winRate: 45.2,
        drawRate: 28.1,
        loseRate: 26.7,
        totalGames: 1200000,
        popularity: 35
      },
      {
        move: "c5",
        name: "Sicilian Defense",
        eco: "B20-B99",
        winRate: 43.8,
        drawRate: 25.4,
        loseRate: 30.8,
        totalGames: 1100000,
        popularity: 40
      },
      {
        move: "e6",
        name: "French Defense",
        eco: "C00-C19",
        winRate: 44.1,
        drawRate: 29.2,
        loseRate: 26.7,
        totalGames: 650000,
        popularity: 15
      },
      {
        move: "c6",
        name: "Caro-Kann Defense",
        eco: "B10-B19",
        winRate: 44.5,
        drawRate: 30.1,
        loseRate: 25.4,
        totalGames: 420000,
        popularity: 8
      },
      {
        move: "d6",
        name: "Pirc Defense",
        eco: "B07-B09",
        winRate: 42.3,
        drawRate: 26.5,
        loseRate: 31.2,
        totalGames: 180000,
        popularity: 2
      }
    ]
  },
  
  // 1.e4 e5 variations
  "e4,e5": {
    fen: "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
    moves: [
      {
        move: "Nf3",
        name: "King's Knight",
        eco: "C40-C99",
        winRate: 56.2,
        drawRate: 26.8,
        loseRate: 17.0,
        totalGames: 980000,
        popularity: 75
      },
      {
        move: "Bc4",
        name: "Bishop's Opening",
        eco: "C23-C24",
        winRate: 54.1,
        drawRate: 28.2,
        loseRate: 17.7,
        totalGames: 120000,
        popularity: 10
      },
      {
        move: "f4",
        name: "King's Gambit",
        eco: "C30-C39",
        winRate: 52.8,
        drawRate: 22.1,
        loseRate: 25.1,
        totalGames: 80000,
        popularity: 8
      },
      {
        move: "Nc3",
        name: "Vienna Game",
        eco: "C25-C29",
        winRate: 53.5,
        drawRate: 25.3,
        loseRate: 21.2,
        totalGames: 70000,
        popularity: 7
      }
    ]
  },
  
  // 1.e4 e5 2.Nf3 variations
  "e4,e5,Nf3": {
    fen: "rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2",
    moves: [
      {
        move: "Nc6",
        name: "Knight to c6",
        eco: "C44-C99",
        winRate: 44.8,
        drawRate: 29.5,
        loseRate: 25.7,
        totalGames: 850000,
        popularity: 80
      },
      {
        move: "Nf6",
        name: "Petrov's Defense",
        eco: "C42-C43",
        winRate: 43.2,
        drawRate: 38.1,
        loseRate: 18.7,
        totalGames: 120000,
        popularity: 15
      },
      {
        move: "d6",
        name: "Philidor Defense",
        eco: "C41",
        winRate: 40.5,
        drawRate: 26.3,
        loseRate: 33.2,
        totalGames: 30000,
        popularity: 5
      }
    ]
  },
  
  // 1.e4 e5 2.Nf3 Nc6 variations
  "e4,e5,Nf3,Nc6": {
    fen: "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3",
    moves: [
      {
        move: "Bb5",
        name: "Ruy Lopez",
        eco: "C60-C99",
        winRate: 55.8,
        drawRate: 28.2,
        loseRate: 16.0,
        totalGames: 450000,
        popularity: 45
      },
      {
        move: "Bc4",
        name: "Italian Game",
        eco: "C50-C59",
        winRate: 54.2,
        drawRate: 27.5,
        loseRate: 18.3,
        totalGames: 320000,
        popularity: 35
      },
      {
        move: "d4",
        name: "Scotch Game",
        eco: "C44-C45",
        winRate: 53.7,
        drawRate: 26.8,
        loseRate: 19.5,
        totalGames: 150000,
        popularity: 15
      },
      {
        move: "Nc3",
        name: "Three Knights",
        eco: "C46",
        winRate: 52.1,
        drawRate: 29.4,
        loseRate: 18.5,
        totalGames: 30000,
        popularity: 5
      }
    ]
  },
  
  // 1.e4 c5 Sicilian variations
  "e4,c5": {
    fen: "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
    moves: [
      {
        move: "Nf3",
        name: "Open Sicilian",
        eco: "B30-B99",
        winRate: 55.3,
        drawRate: 24.8,
        loseRate: 19.9,
        totalGames: 950000,
        popularity: 85
      },
      {
        move: "Nc3",
        name: "Closed Sicilian",
        eco: "B23-B26",
        winRate: 52.8,
        drawRate: 26.5,
        loseRate: 20.7,
        totalGames: 120000,
        popularity: 10
      },
      {
        move: "c3",
        name: "Alapin Variation",
        eco: "B22",
        winRate: 53.1,
        drawRate: 27.2,
        loseRate: 19.7,
        totalGames: 50000,
        popularity: 5
      }
    ]
  },
  
  // 1.e4 c5 2.Nf3 variations
  "e4,c5,Nf3": {
    fen: "rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2",
    moves: [
      {
        move: "d6",
        name: "Classical Sicilian",
        eco: "B50-B99",
        winRate: 42.8,
        drawRate: 26.5,
        loseRate: 30.7,
        totalGames: 400000,
        popularity: 35
      },
      {
        move: "Nc6",
        name: "Old Sicilian",
        eco: "B30-B39",
        winRate: 43.5,
        drawRate: 25.8,
        loseRate: 30.7,
        totalGames: 350000,
        popularity: 30
      },
      {
        move: "e6",
        name: "French Sicilian",
        eco: "B40-B49",
        winRate: 44.2,
        drawRate: 27.3,
        loseRate: 28.5,
        totalGames: 250000,
        popularity: 25
      },
      {
        move: "g6",
        name: "Hyperaccelerated Dragon",
        eco: "B27",
        winRate: 42.1,
        drawRate: 24.9,
        loseRate: 33.0,
        totalGames: 80000,
        popularity: 10
      }
    ]
  },
  
  // 1.d4 variations
  "d4": {
    fen: "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1",
    moves: [
      {
        move: "Nf6",
        name: "Indian Defense",
        eco: "A45-E99",
        winRate: 46.8,
        drawRate: 31.2,
        loseRate: 22.0,
        totalGames: 1500000,
        popularity: 55
      },
      {
        move: "d5",
        name: "Closed Game",
        eco: "D00-D99",
        winRate: 45.5,
        drawRate: 32.8,
        loseRate: 21.7,
        totalGames: 1200000,
        popularity: 40
      },
      {
        move: "f5",
        name: "Dutch Defense",
        eco: "A80-A99",
        winRate: 42.3,
        drawRate: 26.5,
        loseRate: 31.2,
        totalGames: 80000,
        popularity: 3
      },
      {
        move: "e6",
        name: "Horwitz Defense",
        eco: "A40",
        winRate: 44.2,
        drawRate: 33.1,
        loseRate: 22.7,
        totalGames: 50000,
        popularity: 2
      }
    ]
  },
  
  // 1.d4 Nf6 variations
  "d4,Nf6": {
    fen: "rnbqkb1r/pppppppp/5n2/8/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 1 2",
    moves: [
      {
        move: "c4",
        name: "Indian Game",
        eco: "A50-E99",
        winRate: 54.7,
        drawRate: 30.8,
        loseRate: 14.5,
        totalGames: 1400000,
        popularity: 90
      },
      {
        move: "Nf3",
        name: "Torre Attack",
        eco: "A46-A48",
        winRate: 52.3,
        drawRate: 31.5,
        loseRate: 16.2,
        totalGames: 120000,
        popularity: 8
      },
      {
        move: "Bg5",
        name: "Trompowsky Attack",
        eco: "A45",
        winRate: 51.8,
        drawRate: 29.7,
        loseRate: 18.5,
        totalGames: 30000,
        popularity: 2
      }
    ]
  },
  
  // 1.d4 Nf6 2.c4 variations
  "d4,Nf6,c4": {
    fen: "rnbqkb1r/pppppppp/5n2/8/2PP4/8/PP2PPPP/RNBQKBNR b KQkq - 0 2",
    moves: [
      {
        move: "g6",
        name: "King's Indian Defense",
        eco: "E60-E99",
        winRate: 43.2,
        drawRate: 28.5,
        loseRate: 28.3,
        totalGames: 600000,
        popularity: 40
      },
      {
        move: "e6",
        name: "Nimzo/Queen's Indian",
        eco: "E10-E59",
        winRate: 44.8,
        drawRate: 33.2,
        loseRate: 22.0,
        totalGames: 550000,
        popularity: 35
      },
      {
        move: "c5",
        name: "Benoni Defense",
        eco: "A60-A79",
        winRate: 42.5,
        drawRate: 26.8,
        loseRate: 30.7,
        totalGames: 200000,
        popularity: 15
      },
      {
        move: "d5",
        name: "Semi-Slav/QGD",
        eco: "D30-D69",
        winRate: 45.2,
        drawRate: 34.1,
        loseRate: 20.7,
        totalGames: 150000,
        popularity: 10
      }
    ]
  },
  
  // 1.d4 d5 variations
  "d4,d5": {
    fen: "rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 0 2",
    moves: [
      {
        move: "c4",
        name: "Queen's Gambit",
        eco: "D06-D69",
        winRate: 56.2,
        drawRate: 30.5,
        loseRate: 13.3,
        totalGames: 1100000,
        popularity: 85
      },
      {
        move: "Nf3",
        name: "Queen's Pawn Game",
        eco: "D02-D05",
        winRate: 53.8,
        drawRate: 31.2,
        loseRate: 15.0,
        totalGames: 150000,
        popularity: 12
      },
      {
        move: "Bf4",
        name: "London System",
        eco: "D00",
        winRate: 52.5,
        drawRate: 30.8,
        loseRate: 16.7,
        totalGames: 40000,
        popularity: 3
      }
    ]
  },
  
  // 1.d4 d5 2.c4 variations
  "d4,d5,c4": {
    fen: "rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq - 0 2",
    moves: [
      {
        move: "e6",
        name: "Queen's Gambit Declined",
        eco: "D30-D69",
        winRate: 43.5,
        drawRate: 35.2,
        loseRate: 21.3,
        totalGames: 600000,
        popularity: 50
      },
      {
        move: "c6",
        name: "Slav Defense",
        eco: "D10-D19",
        winRate: 44.2,
        drawRate: 34.5,
        loseRate: 21.3,
        totalGames: 400000,
        popularity: 35
      },
      {
        move: "dxc4",
        name: "Queen's Gambit Accepted",
        eco: "D20-D29",
        winRate: 42.8,
        drawRate: 32.1,
        loseRate: 25.1,
        totalGames: 150000,
        popularity: 15
      }
    ]
  },
  
  // 1.Nf3 variations
  "Nf3": {
    fen: "rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQKB1R b KQkq - 1 1",
    moves: [
      {
        move: "d5",
        name: "Queen's Pawn",
        eco: "A06-A09",
        winRate: 45.8,
        drawRate: 33.5,
        loseRate: 20.7,
        totalGames: 500000,
        popularity: 55
      },
      {
        move: "Nf6",
        name: "Indian Game",
        eco: "A04-A05",
        winRate: 46.2,
        drawRate: 32.8,
        loseRate: 21.0,
        totalGames: 300000,
        popularity: 35
      },
      {
        move: "c5",
        name: "Sicilian Invitation",
        eco: "A04",
        winRate: 44.5,
        drawRate: 31.2,
        loseRate: 24.3,
        totalGames: 80000,
        popularity: 10
      }
    ]
  },
  
  // 1.c4 variations
  "c4": {
    fen: "rnbqkbnr/pppppppp/8/8/2P5/8/PP1PPPPP/RNBQKBNR b KQkq - 0 1",
    moves: [
      {
        move: "e5",
        name: "Reversed Sicilian",
        eco: "A20-A29",
        winRate: 44.2,
        drawRate: 32.5,
        loseRate: 23.3,
        totalGames: 300000,
        popularity: 35
      },
      {
        move: "Nf6",
        name: "Indian Defense",
        eco: "A15-A19",
        winRate: 45.8,
        drawRate: 31.8,
        loseRate: 22.4,
        totalGames: 280000,
        popularity: 35
      },
      {
        move: "c5",
        name: "Symmetrical English",
        eco: "A30-A39",
        winRate: 46.5,
        drawRate: 33.2,
        loseRate: 20.3,
        totalGames: 150000,
        popularity: 20
      },
      {
        move: "e6",
        name: "Agincourt Defense",
        eco: "A13-A14",
        winRate: 45.2,
        drawRate: 34.1,
        loseRate: 20.7,
        totalGames: 70000,
        popularity: 10
      }
    ]
  }
};

// Function to get moves for a position
export function getMovesForPosition(moveHistory) {
  const key = moveHistory.join(',') || 'root';
  
  if (key === 'root') {
    return localOpeningsTree.moves;
  }
  
  if (openingVariations[key]) {
    return openingVariations[key].moves;
  }
  
  return [];
}

// Function to build tree structure without circular references
export function buildLocalTree() {
  const tree = {
    fen: localOpeningsTree.fen,
    moves: localOpeningsTree.moves,
    children: new Map()
  };
  
  // Recursively build tree
  function addVariations(node, moveHistory = []) {
    const moves = getMovesForPosition(moveHistory);
    
    moves.forEach(moveData => {
      const newHistory = [...moveHistory, moveData.move];
      const key = newHistory.join(',');
      
      if (openingVariations[key]) {
        const childNode = {
          fen: openingVariations[key].fen,
          moves: openingVariations[key].moves,
          children: new Map(),
          moveSan: moveData.move,
          depth: moveHistory.length + 1
        };
        
        node.children.set(moveData.move, childNode);
        
        // Add more variations if they exist
        if (newHistory.length < 6) { // Limit depth to prevent too deep recursion
          addVariations(childNode, newHistory);
        }
      }
    });
  }
  
  addVariations(tree);
  return tree;
}