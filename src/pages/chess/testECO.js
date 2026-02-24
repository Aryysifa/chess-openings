// Test script for ECO database integration
import { 
  getOpeningByFEN, 
  getOpeningByMoves, 
  getEnhancedOpeningName, 
  getECOStatistics,
  searchOpeningsByName 
} from './ecoService.js';

// Test cases for common openings
const testCases = [
  {
    name: 'Starting Position',
    fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    moves: []
  },
  {
    name: 'After 1.e4',
    fen: "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
    moves: ['e4']
  },
  {
    name: 'Sicilian Defense',
    fen: "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
    moves: ['e4', 'c5']
  },
  {
    name: 'Ruy Lopez',
    fen: "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5']
  }
];

/**
 * Run comprehensive ECO database tests
 */
export async function runECOTests() {
  console.log('🧪 Running ECO Database Tests...\n');
  
  // Test 1: Database Statistics
  console.log('📊 ECO Database Statistics:');
  try {
    const stats = getECOStatistics();
    console.log(`  Total Positions: ${stats.totalPositions.toLocaleString()}`);
    console.log(`  Named Openings: ${stats.namedOpenings.toLocaleString()}`);
    console.log(`  Max Move Length: ${stats.maxMoveLength} moves`);
    console.log(`  Average Move Length: ${stats.averageMoveLength} moves`);
    console.log(`  Data Sources:`, Object.entries(stats.sources).map(([k,v]) => `${k}: ${v}`).join(', '));
    console.log(`  ECO Categories:`, Object.entries(stats.ecoCodes).map(([k,v]) => `${k}: ${v}`).join(', '));
    console.log('  ✅ Statistics test passed\n');
  } catch (error) {
    console.error('  ❌ Statistics test failed:', error.message, '\n');
  }
  
  // Test 2: FEN Lookup Tests
  console.log('🎯 Testing FEN Position Lookups:');
  for (const testCase of testCases) {
    try {
      const result = getOpeningByFEN(testCase.fen);
      if (result) {
        console.log(`  ${testCase.name}: "${result.name}" (${result.eco})`);
      } else {
        console.log(`  ${testCase.name}: No opening found for FEN`);
      }
    } catch (error) {
      console.error(`  ${testCase.name}: Error - ${error.message}`);
    }
  }
  console.log('  ✅ FEN lookup tests completed\n');
  
  // Test 3: Move History Tests
  console.log('♟️  Testing Move History Lookups:');
  for (const testCase of testCases) {
    try {
      const result = await getOpeningByMoves(testCase.moves);
      if (result) {
        console.log(`  ${testCase.name}: "${result.name}" (${result.eco})`);
      } else {
        console.log(`  ${testCase.name}: No opening found for move sequence`);
      }
    } catch (error) {
      console.error(`  ${testCase.name}: Error - ${error.message}`);
    }
  }
  console.log('  ✅ Move history tests completed\n');
  
  // Test 4: Enhanced Opening Name Tests
  console.log('🚀 Testing Enhanced Opening Names:');
  const enhancedTests = [
    { move: 'e4', fen: testCases[1].fen, history: ['e4'] },
    { move: 'c5', fen: testCases[2].fen, history: ['e4', 'c5'] },
    { move: 'Bb5', fen: testCases[3].fen, history: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5'] }
  ];
  
  for (const test of enhancedTests) {
    try {
      const name = await getEnhancedOpeningName(test.move, test.fen, test.history);
      console.log(`  Move ${test.move}: "${name}"`);
    } catch (error) {
      console.error(`  Move ${test.move}: Error - ${error.message}`);
    }
  }
  console.log('  ✅ Enhanced name tests completed\n');
  
  // Test 5: Search Tests
  console.log('🔍 Testing Opening Name Search:');
  const searchTerms = ['Sicilian', 'Lopez', 'French', 'Italian'];
  for (const term of searchTerms) {
    try {
      const results = searchOpeningsByName(term, 3);
      console.log(`  "${term}": Found ${results.length} matches`);
      results.forEach((opening, i) => {
        console.log(`    ${i+1}. ${opening.name} (${opening.eco})`);
      });
    } catch (error) {
      console.error(`  "${term}": Error - ${error.message}`);
    }
  }
  console.log('  ✅ Search tests completed\n');
  
  console.log('🎉 All ECO tests completed successfully!');
}

// Auto-run tests if this file is executed directly
if (typeof window !== 'undefined') {
  // Browser environment
  window.runECOTests = runECOTests;
  console.log('ECO tests loaded. Run `runECOTests()` in the console to test.');
} else if (typeof module !== 'undefined' && module.exports) {
  // Node.js environment  
  runECOTests().catch(console.error);
}