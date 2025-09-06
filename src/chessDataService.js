// Chess Data Service - Fetches real game data from Lichess and other sources
// Replaces the local database with live statistics from actual games

import { getEnhancedOpeningName } from './ecoService.js';

const LICHESS_API_BASE = 'https://explorer.lichess.ovh';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

// Cache to avoid excessive API calls
const cache = new Map();

/**
 * Fetches opening statistics from Lichess Opening Explorer
 * @param {string} fen - Position FEN string
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Opening statistics
 */
export async function fetchOpeningStats(fen, options = {}) {
  // Extract options (currently just using defaults)
  const { moves = 12, moveHistory = [] } = options; // eslint-disable-line no-unused-vars

  // Create cache key
  const cacheKey = `${fen}-${JSON.stringify(options)}`;
  
  // Check cache first
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  try {
    // Build query parameters
    const params = new URLSearchParams({
      fen: fen
    });

    const url = `${LICHESS_API_BASE}/lichess?${params}`;
    
    console.log('Fetching opening data from:', url);

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'ChessOpeningsExplorer/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`Lichess API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Transform the data to match our internal format
    const transformedData = await transformLichessData(data, moveHistory);
    
    // Cache the result
    cache.set(cacheKey, {
      data: transformedData,
      timestamp: Date.now()
    });

    return transformedData;
    
  } catch (error) {
    console.error('Error fetching opening data:', error);
    
    // Return fallback data on error
    return {
      fen: fen,
      moves: [],
      totalGames: 0,
      error: error.message
    };
  }
}

/**
 * Transforms Lichess API response to our internal format
 * @param {Object} lichessData - Raw data from Lichess API
 * @param {Array<string>} moveHistory - Current move history for context
 * @returns {Promise<Object>} Transformed data
 */
async function transformLichessData(lichessData, moveHistory = []) {
  const { white, draws, black, moves } = lichessData;
  
  const totalGames = white + draws + black;
  
  // Calculate percentages
  const whiteWinRate = totalGames > 0 ? (white / totalGames) * 100 : 0;
  const drawRate = totalGames > 0 ? (draws / totalGames) * 100 : 0;
  const blackWinRate = totalGames > 0 ? (black / totalGames) * 100 : 0;

  // Transform moves data with enhanced opening names
  const transformedMoves = await Promise.all(moves.map(async (move) => {
    const moveTotal = move.white + move.draws + move.black;
    const moveWhiteWin = moveTotal > 0 ? (move.white / moveTotal) * 100 : 0;
    const moveDrawRate = moveTotal > 0 ? (move.draws / moveTotal) * 100 : 0;
    const moveBlackWin = moveTotal > 0 ? (move.black / moveTotal) * 100 : 0;
    
    // Calculate popularity as percentage of total games
    const popularity = totalGames > 0 ? (moveTotal / totalGames) * 100 : 0;

    // Get enhanced opening name using ECO database
    const newMoveHistory = [...moveHistory, move.san];
    let openingName;
    
    try {
      // Calculate the resulting FEN for this move
      const { Chess } = await import('chess.js');
      const game = new Chess();
      
      // Play through the move history
      for (const historyMove of moveHistory) {
        game.move(historyMove);
      }
      game.move(move.san);
      const resultingFEN = game.fen();
      
      // Get enhanced opening name
      openingName = await getEnhancedOpeningName(move.san, resultingFEN, newMoveHistory);
    } catch (error) {
      console.warn(`Error getting enhanced opening name for ${move.san}:`, error);
      openingName = getBasicOpeningName(move.san);
    }

    return {
      move: move.san,
      uci: move.uci,
      name: openingName,
      winRate: Math.round(moveWhiteWin * 10) / 10,
      drawRate: Math.round(moveDrawRate * 10) / 10, 
      loseRate: Math.round(moveBlackWin * 10) / 10,
      totalGames: moveTotal,
      popularity: Math.round(popularity * 10) / 10
    };
  }));

  // Sort by popularity
  transformedMoves.sort((a, b) => b.totalGames - a.totalGames);

  return {
    fen: lichessData.fen,
    moves: transformedMoves,
    totalGames: totalGames,
    whiteWinRate: Math.round(whiteWinRate * 10) / 10,
    drawRate: Math.round(drawRate * 10) / 10,
    blackWinRate: Math.round(blackWinRate * 10) / 10
  };
}

/**
 * Gets basic opening name for a move (fallback function)
 * @param {string} move - Chess move in SAN notation
 * @returns {string} Opening name
 */
function getBasicOpeningName(move) {
  const openingNames = {
    'e4': "King's Pawn",
    'd4': "Queen's Pawn", 
    'Nf3': 'Réti Opening',
    'c4': 'English Opening',
    'g3': 'Benko Opening',
    'b3': 'Nimzowitsch-Larsen Attack',
    'f4': "Bird's Opening",
    'Nc3': 'Van Geet Opening',
    'e5': 'Open Game',
    'd5': "Queen's Gambit Declined",
    'c5': 'Sicilian Defense',
    'e6': 'French Defense',
    'c6': 'Caro-Kann Defense',
    'g6': 'Modern Defense',
    'Nf6': 'Indian Defense',
    'd6': 'Pirc Defense',
    'f5': 'Dutch Defense',
    'b6': "Queen's Indian Defense",
    'Nc6': 'Nimzowitsch Defense'
  };
  
  return openingNames[move] || 'Opening';
}

/**
 * Fetches opening data for multiple positions in parallel
 * @param {Array<string>} fens - Array of FEN strings
 * @param {Object} options - Query options
 * @returns {Promise<Map>} Map of FEN to opening data
 */
export async function fetchMultiplePositions(fens, options = {}) {
  const results = new Map();
  
  // Limit concurrent requests to avoid rate limiting
  const batchSize = 3;
  
  for (let i = 0; i < fens.length; i += batchSize) {
    const batch = fens.slice(i, i + batchSize);
    
    const promises = batch.map(async (fen) => {
      const data = await fetchOpeningStats(fen, options);
      results.set(fen, data);
    });
    
    await Promise.all(promises);
    
    // Small delay between batches to respect rate limits
    if (i + batchSize < fens.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  return results;
}

/**
 * Clears the cache (useful for development/testing)
 */
export function clearCache() {
  cache.clear();
}

/**
 * Gets cache statistics
 */
export function getCacheStats() {
  return {
    size: cache.size,
    entries: Array.from(cache.keys())
  };
}