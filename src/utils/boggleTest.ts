import { BoggleSolver } from './boggleSolver';
import { getTestWords } from './wordLoader';

// Example usage and testing of the Boggle solver
export function testBoggleSolver() {
  console.log('Testing Boggle Solver...');
  
  // Get test words
  const testWords = getTestWords();
  console.log(`Loaded ${testWords.length} test words`);
  
  // Create solver
  const solver = new BoggleSolver(testWords);
  
  // Test grid with some Spanish words
  const testGrid = [
    ['C', 'A', 'S', 'A'],
    ['E', 'M', 'O', 'L'],
    ['S', 'A', 'T', 'E'],
    ['A', 'R', 'E', 'S']
  ];
  
  console.log('Test grid:');
  testGrid.forEach(row => console.log(row.join(' ')));
  
  // Find words
  const startTime = performance.now();
  const foundWords = solver.findWords(testGrid);
  const endTime = performance.now();
  
  console.log(`\nFound ${foundWords.length} words in ${(endTime - startTime).toFixed(2)}ms:`);
  console.log(foundWords);
  
  return {
    grid: testGrid,
    words: foundWords,
    searchTime: endTime - startTime,
    totalWords: foundWords.length
  };
}

// Performance comparison between Trie and Set approaches
export function comparePerformance() {
  console.log('\n=== Performance Comparison ===');
  
  const testWords = getTestWords();
  const solver = new BoggleSolver(testWords);
  
  // Test grid
  const testGrid = [
    ['A', 'B', 'C', 'D'],
    ['E', 'F', 'G', 'H'],
    ['I', 'J', 'K', 'L'],
    ['M', 'N', 'O', 'P']
  ];
  
  // Test Trie approach
  const trieStart = performance.now();
  const trieWords = solver.findWords(testGrid);
  const trieEnd = performance.now();
  const trieTime = trieEnd - trieStart;
  
  // Test Set approach
  const setStart = performance.now();
  const setWords = solver.findWordsSimple(testGrid);
  const setEnd = performance.now();
  const setTime = setEnd - setStart;
  
  console.log(`Trie approach: ${trieWords.length} words in ${trieTime.toFixed(2)}ms`);
  console.log(`Set approach: ${setWords.length} words in ${setTime.toFixed(2)}ms`);
  console.log(`Performance ratio: ${(setTime / trieTime).toFixed(2)}x`);
  
  return {
    trie: { words: trieWords, time: trieTime },
    set: { words: setWords, time: setTime }
  };
}

// Generate random grids and test
export function testRandomGrids(numGrids: number = 5) {
  console.log(`\n=== Testing ${numGrids} Random Grids ===`);
  
  const testWords = getTestWords();
  const solver = new BoggleSolver(testWords);
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  
  const results = [];
  
  for (let i = 0; i < numGrids; i++) {
    // Generate random grid
    const grid = Array(4).fill(null).map(() =>
      Array(4).fill(null).map(() =>
        letters[Math.floor(Math.random() * letters.length)]
      )
    );
    
    const startTime = performance.now();
    const words = solver.findWords(grid);
    const endTime = performance.now();
    
    results.push({
      grid,
      words: words.length,
      time: endTime - startTime
    });
    
    console.log(`Grid ${i + 1}: ${words.length} words in ${(endTime - startTime).toFixed(2)}ms`);
  }
  
  const avgWords = results.reduce((sum, r) => sum + r.words, 0) / results.length;
  const avgTime = results.reduce((sum, r) => sum + r.time, 0) / results.length;
  
  console.log(`\nAverage: ${avgWords.toFixed(1)} words in ${avgTime.toFixed(2)}ms`);
  
  return results;
}

// Test the specific RIFO issue
export function testRifoIssue() {
  console.log('=== Testing RIFO Issue ===');
  
  const testWords = getTestWords();
  const solver = new BoggleSolver(testWords);
  
  // User's grid
  const grid = [
    ['S', 'N', 'J', 'E'],
    ['O', 'S', 'I', 'Z'],
    ['R', 'O', 'F', 'R'],
    ['A', 'A', 'H', 'S']
  ];
  
  console.log('Grid:');
  grid.forEach(row => console.log(row.join(' ')));
  
  // Check if "rifo" is in the word list
  console.log('\nIs "rifo" in the word list?', testWords.includes('rifo'));
  console.log('Is "casa" in the word list?', testWords.includes('casa'));
  
  // Find words
  const startTime = performance.now();
  const foundWords = solver.findWords(grid);
  const endTime = performance.now();
  
  console.log(`\nFound ${foundWords.length} words in ${(endTime - startTime).toFixed(2)}ms`);
  console.log('Found words:', foundWords);
  
  // Check specific words
  console.log('\nSpecific word checks:');
  console.log('Was "rifo" found?', foundWords.includes('rifo'));
  console.log('Was "casa" found?', foundWords.includes('casa'));
  
  // Test if the path exists by checking prefixes
  console.log('\nPrefix checks:');
  console.log('Has prefix "r"?', solver['hasPrefix']('r'));
  console.log('Has prefix "ri"?', solver['hasPrefix']('ri'));
  console.log('Has prefix "rif"?', solver['hasPrefix']('rif'));
  console.log('Has prefix "rifo"?', solver['hasPrefix']('rifo'));
  
  return {
    grid,
    foundWords,
    searchTime: endTime - startTime,
    rifoInList: testWords.includes('rifo'),
    rifoFound: foundWords.includes('rifo')
  };
}

// Export for use in browser console or other modules
if (typeof window !== 'undefined') {
  (window as any).testBoggleSolver = testBoggleSolver;
  (window as any).comparePerformance = comparePerformance;
  (window as any).testRandomGrids = testRandomGrids;
} 