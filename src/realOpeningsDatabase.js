// Real Chess Openings Database - Uses live data from Lichess and other sources
// Replaces the local database with actual game statistics

import { fetchOpeningStats } from './chessDataService.js';

// Starting position FEN
const STARTING_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";


/**
 * Fetches moves for a given position using real game data
 * @param {string} fen - Position FEN string  
 * @param {Array<string>} moveHistory - History of moves to reach this position
 * @returns {Promise<Array>} Array of possible moves with statistics
 */
export async function getRealMoves(fen, moveHistory = []) {
  try {
    console.log(`Fetching real data for position: ${fen}`);
    console.log(`Move history: ${moveHistory.join(' ')}`);
    
    const openingData = await fetchOpeningStats(fen, {
      moves: 15 // Get top 15 moves
    });

    if (openingData.error) {
      console.error('API error:', openingData.error);
      throw new Error(`Failed to fetch opening data: ${openingData.error}`);
    }

    console.log(`Found ${openingData.moves.length} moves with ${openingData.totalGames} total games`);
    
    // Filter out moves with very low play count (less than 0.1% of total games)
    const minGames = Math.max(10, openingData.totalGames * 0.001);
    const filteredMoves = openingData.moves.filter(move => move.totalGames >= minGames);
    
    return filteredMoves;
    
  } catch (error) {
    console.error('Error fetching real moves:', error);
    throw error;
  }
}

/**
 * Gets the complete opening tree starting from a position
 * This builds the tree structure that the UI expects
 * @param {string} fen - Starting position FEN
 * @param {Array<string>} moveHistory - Current move history
 * @param {number} maxDepth - Maximum depth to explore
 * @returns {Promise<Object>} Tree structure with children
 */
export async function getRealOpeningTree(fen = STARTING_FEN, moveHistory = [], maxDepth = 4) {
  const tree = {
    fen: fen,
    moves: [],
    children: new Map(),
    depth: moveHistory.length
  };

  try {
    // Get moves for current position
    const moves = await getRealMoves(fen, moveHistory);
    tree.moves = moves;

    // If we haven't reached max depth, explore children for popular moves
    if (moveHistory.length < maxDepth) {
      // Only explore the most popular moves to avoid too many API calls
      const popularMoves = moves.slice(0, Math.min(8, moves.length));
      
      for (const moveData of popularMoves) {
        try {
          // Calculate the resulting position after this move
          const { Chess } = await import('chess.js');
          const game = new Chess(fen);
          const move = game.move(moveData.move);
          
          if (move) {
            const newFen = game.fen();
            const newMoveHistory = [...moveHistory, moveData.move];
            
            // Recursively get the child tree
            const childTree = await getRealOpeningTree(newFen, newMoveHistory, maxDepth);
            tree.children.set(moveData.move, childTree);
            
            // Small delay to respect rate limits
            await new Promise(resolve => setTimeout(resolve, 200));
          }
        } catch (error) {
          console.warn(`Error exploring move ${moveData.move}:`, error);
        }
      }
    }

  } catch (error) {
    console.error('Error building opening tree:', error);
  }

  return tree;
}

/**
 * Enhanced function that combines real data with opening name enrichment
 * This replaces the local getMovesForPosition function
 * @param {string} fen - Position FEN
 * @param {Array<string>} moveHistory - Move history
 * @returns {Promise<Array>} Enhanced moves with opening names
 */
export async function getMovesForPosition(fen, moveHistory = []) {
  const moves = await getRealMoves(fen, moveHistory);
  
  // Enhance moves with additional opening information
  return moves.map(move => ({
    ...move,
    // Add ECO codes if we can determine them
    eco: getECOCode(moveHistory, move.move),
    // Ensure we have all required fields
    winRate: move.winRate || 50,
    drawRate: move.drawRate || 25,
    loseRate: move.loseRate || 25,
    totalGames: move.totalGames || 0,
    popularity: move.popularity || 0
  }));
}

/**
 * Gets ECO (Encyclopedia of Chess Openings) code for a move sequence
 * This is a simplified version - a full implementation would use a comprehensive ECO database
 * @param {Array<string>} moveHistory - Previous moves
 * @param {string} nextMove - The move to classify
 * @returns {string} ECO code
 */
function getECOCode(moveHistory, nextMove) {
  const fullSequence = [...moveHistory, nextMove];
  
  // Basic ECO classification (simplified)
  if (fullSequence.length === 1) {
    switch (fullSequence[0]) {
      case 'e4': return 'B00-C99';
      case 'd4': return 'A40-E99';
      case 'Nf3': return 'A04-A09';
      case 'c4': return 'A10-A39';
      case 'f4': return 'A02-A03';
      case 'g3': return 'A00';
      default: return 'A00';
    }
  }
  
  // For longer sequences, we'd need a more sophisticated lookup
  return 'A00';
}

/**
 * Preloads opening data for common positions to improve performance
 * @returns {Promise<void>}
 */
export async function preloadCommonOpenings() {
  console.log('Preloading common opening positions...');
  
  try {
    // Preload starting position
    await getRealMoves(STARTING_FEN);
    
    // Preload after 1.e4
    const { Chess } = await import('chess.js');
    let game = new Chess();
    game.move('e4');
    await getRealMoves(game.fen());
    
    // Preload after 1.d4
    game = new Chess();
    game.move('d4');
    await getRealMoves(game.fen());
    
    console.log('Common openings preloaded successfully');
    
  } catch (error) {
    console.warn('Error preloading openings:', error);
  }
}

/**
 * Development helper to test the real data integration
 * @returns {Promise<Object>} Test results
 */
export async function testRealDataIntegration() {
  console.log('Testing real data integration...');
  
  try {
    const startTime = Date.now();
    const moves = await getRealMoves(STARTING_FEN);
    const endTime = Date.now();
    
    const result = {
      success: true,
      responseTime: endTime - startTime,
      movesFound: moves.length,
      totalGames: moves.reduce((sum, move) => sum + move.totalGames, 0),
      topMoves: moves.slice(0, 5).map(m => ({ 
        move: m.move, 
        games: m.totalGames, 
        winRate: m.winRate 
      }))
    };
    
    console.log('Real data integration test results:', result);
    return result;
    
  } catch (error) {
    console.error('Real data integration test failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}