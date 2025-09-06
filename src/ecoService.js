// ECO (Encyclopedia of Chess Openings) Service
// Provides comprehensive opening name lookup using the ECO.json database

import ecoA from './data/ecoA.json';
import ecoB from './data/ecoB.json';
import ecoC from './data/ecoC.json';
import ecoD from './data/ecoD.json';
import ecoE from './data/ecoE.json';
import ecoInterpolated from './data/eco_interpolated.json';

// Combined ECO database for fast lookup
let combinedECODatabase = null;

/**
 * Initialize the ECO database by combining all ECO files
 * This is done lazily on first access for better performance
 */
function initializeECODatabase() {
  if (combinedECODatabase) {
    return combinedECODatabase;
  }

  console.log('Initializing ECO database...');
  const startTime = Date.now();
  
  // Combine all ECO databases
  combinedECODatabase = {
    ...ecoA,
    ...ecoB,
    ...ecoC,
    ...ecoD,
    ...ecoE,
    ...ecoInterpolated
  };
  
  const endTime = Date.now();
  const entryCount = Object.keys(combinedECODatabase).length;
  console.log(`ECO database initialized: ${entryCount} positions in ${endTime - startTime}ms`);
  
  return combinedECODatabase;
}


/**
 * Get opening information by FEN position
 * @param {string} fen - Position FEN string
 * @returns {Object|null} Opening information or null if not found
 */
export function getOpeningByFEN(fen) {
  const ecoDb = initializeECODatabase();
  
  // Try exact FEN match first
  let opening = ecoDb[fen];
  
  if (!opening) {
    // Try with normalized FEN (without move counts)
    const parts = fen.split(' ');
    const positionOnly = parts.slice(0, 4).join(' ');
    opening = ecoDb[positionOnly];
  }
  
  if (!opening) {
    // Try with just piece placement (first part of FEN)
    const piecePlacement = fen.split(' ')[0];
    for (const [key, value] of Object.entries(ecoDb)) {
      if (key.startsWith(piecePlacement)) {
        opening = value;
        break;
      }
    }
  }
  
  return opening ? {
    name: opening.name || 'Opening',
    eco: opening.eco || '',
    moves: opening.moves || '',
    source: opening.src || 'unknown'
  } : null;
}

/**
 * Get opening information from move history using chess.js
 * This is more reliable than FEN lookup for complex positions
 * @param {Array<string>} moveHistory - Array of moves in SAN notation
 * @returns {Object|null} Opening information
 */
export async function getOpeningByMoves(moveHistory) {
  if (!moveHistory || moveHistory.length === 0) {
    return {
      name: 'Starting Position',
      eco: '',
      moves: '',
      source: 'default'
    };
  }
  
  try {
    // Import chess.js dynamically
    const { Chess } = await import('chess.js');
    const game = new Chess();
    
    // Play through the moves to get the final FEN
    for (const move of moveHistory) {
      const result = game.move(move);
      if (!result) {
        console.warn(`Invalid move in sequence: ${move}`);
        break;
      }
    }
    
    const finalFEN = game.fen();
    return getOpeningByFEN(finalFEN);
    
  } catch (error) {
    console.error('Error getting opening by moves:', error);
    return null;
  }
}

/**
 * Enhanced opening name function that replaces the simple one
 * Tries multiple approaches to find the best opening name
 * @param {string} move - Current move (for fallback)
 * @param {string} fen - Position FEN (primary lookup)
 * @param {Array<string>} moveHistory - Full move history
 * @returns {Promise<string>} Opening name
 */
export async function getEnhancedOpeningName(move, fen, moveHistory = []) {
  try {
    // Primary approach: lookup by FEN
    let opening = getOpeningByFEN(fen);
    
    if (!opening && moveHistory.length > 0) {
      // Secondary approach: lookup by move history
      opening = await getOpeningByMoves(moveHistory);
    }
    
    if (opening && opening.name && opening.name !== 'Opening') {
      return opening.name;
    }
    
    // Fallback to basic move classification
    return getBasicOpeningName(move, moveHistory);
    
  } catch (error) {
    console.error('Error in enhanced opening name lookup:', error);
    return getBasicOpeningName(move, moveHistory);
  }
}

/**
 * Basic opening name classification as fallback
 * Enhanced version of the original getOpeningName function
 * @param {string} move - Chess move in SAN notation
 * @param {Array<string>} moveHistory - Move history for context
 * @returns {string} Opening name
 */
function getBasicOpeningName(move, moveHistory = []) {
  // First move classifications
  if (moveHistory.length === 0) {
    const firstMoveNames = {
      'e4': "King's Pawn Opening",
      'd4': "Queen's Pawn Opening", 
      'Nf3': 'Réti Opening',
      'c4': 'English Opening',
      'g3': 'Benko Opening',
      'b3': 'Nimzowitsch-Larsen Attack',
      'f4': "Bird's Opening",
      'Nc3': 'Van Geet Opening',
      'e3': 'Van\'t Kruijs Opening',
      'd3': 'Mieses Opening',
      'h4': 'Kadas Opening',
      'a4': 'Ware Opening',
      'h3': 'Clemenz Opening',
      'Na3': 'Durkin Opening',
      'f3': 'Barnes Opening',
      'c3': 'Saragossa Opening'
    };
    return firstMoveNames[move] || 'Irregular Opening';
  }
  
  // Response classifications based on first move
  if (moveHistory.length === 1) {
    const firstMove = moveHistory[0];
    if (firstMove === 'e4') {
      const responses = {
        'e5': 'Open Game',
        'c5': 'Sicilian Defense',
        'e6': 'French Defense',
        'c6': 'Caro-Kann Defense',
        'd6': 'Pirc Defense',
        'g6': 'Modern Defense',
        'Nf6': 'Alekhine Defense',
        'd5': 'Scandinavian Defense',
        'f5': 'Fred Defense',
        'b6': 'Owen Defense',
        'a6': 'St. George Defense',
        'h6': 'Carr Defense',
        'f6': 'Duras Gambit',
        'h5': 'Goldsmith Defense'
      };
      return responses[move] || 'King\'s Pawn Game';
    } else if (firstMove === 'd4') {
      const responses = {
        'd5': 'Closed Game',
        'Nf6': 'Indian Defense',
        'f5': 'Dutch Defense',
        'e6': 'Horwitz Defense',
        'c5': 'Benoni Defense',
        'g6': 'Modern Defense',
        'Nc6': 'Mikenas Defense',
        'e5': 'Englund Gambit',
        'b5': 'Polish Defense',
        'a5': 'Keres Defense'
      };
      return responses[move] || 'Queen\'s Pawn Game';
    }
  }
  
  // For deeper positions, provide contextual names
  return 'Opening Variation';
}

/**
 * Get comprehensive opening statistics
 * @returns {Object} Database statistics
 */
export function getECOStatistics() {
  const ecoDb = initializeECODatabase();
  const entries = Object.values(ecoDb);
  
  const stats = {
    totalPositions: entries.length,
    sources: {},
    ecoCodes: {},
    namedOpenings: 0,
    maxMoveLength: 0,
    averageMoveLength: 0
  };
  
  let totalMoves = 0;
  
  entries.forEach(entry => {
    // Source statistics
    stats.sources[entry.src] = (stats.sources[entry.src] || 0) + 1;
    
    // ECO code statistics
    if (entry.eco) {
      const ecoPrefix = entry.eco.charAt(0);
      stats.ecoCodes[ecoPrefix] = (stats.ecoCodes[ecoPrefix] || 0) + 1;
    }
    
    // Named openings
    if (entry.name && entry.name !== 'Opening') {
      stats.namedOpenings++;
    }
    
    // Move length analysis
    if (entry.moves) {
      const moveCount = entry.moves.split(' ').length;
      stats.maxMoveLength = Math.max(stats.maxMoveLength, moveCount);
      totalMoves += moveCount;
    }
  });
  
  stats.averageMoveLength = Math.round((totalMoves / entries.length) * 100) / 100;
  
  return stats;
}

/**
 * Search openings by name (fuzzy matching)
 * @param {string} searchTerm - Opening name to search for
 * @param {number} limit - Maximum results to return
 * @returns {Array} Array of matching openings
 */
export function searchOpeningsByName(searchTerm, limit = 10) {
  const ecoDb = initializeECODatabase();
  const searchLower = searchTerm.toLowerCase();
  const matches = [];
  
  Object.entries(ecoDb).forEach(([fen, opening]) => {
    if (opening.name && opening.name.toLowerCase().includes(searchLower)) {
      matches.push({
        fen,
        name: opening.name,
        eco: opening.eco,
        moves: opening.moves,
        source: opening.src
      });
    }
  });
  
  // Sort by relevance (exact matches first, then alphabetical)
  matches.sort((a, b) => {
    const aExact = a.name.toLowerCase() === searchLower;
    const bExact = b.name.toLowerCase() === searchLower;
    
    if (aExact && !bExact) return -1;
    if (!aExact && bExact) return 1;
    
    return a.name.localeCompare(b.name);
  });
  
  return matches.slice(0, limit);
}