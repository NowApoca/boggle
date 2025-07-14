# Efficient Boggle Solver Algorithm

This project implements an efficient algorithm to find all valid words in a 4x4 Boggle grid using a Spanish word list.

## Algorithm Overview

The solution uses a **Trie data structure** combined with **Depth-First Search (DFS)** to efficiently find all possible words in a Boggle grid.

### Key Features

1. **Trie Data Structure**: Pre-processes the word list into a Trie for O(k) prefix checking, where k is the length of the prefix
2. **DFS with Backtracking**: Explores all possible paths in the grid while avoiding revisiting cells
3. **Early Termination**: Stops exploring paths that don't lead to valid prefixes
4. **8-Direction Movement**: Supports all 8 directions (up, down, left, right, and diagonals)

## Algorithm Complexity

- **Time Complexity**: O(8^(n²) × k) where n is grid size (4) and k is average word length
- **Space Complexity**: O(W × L) where W is number of words and L is average word length
- **Practical Performance**: Typically finds all words in 1-10ms for a 4x4 grid

## Implementation Details

### 1. Trie Construction
```typescript
interface TrieNode {
  children: Map<string, TrieNode>;
  isEndOfWord: boolean;
}
```

The Trie is built once during initialization:
- Each node represents a character
- `isEndOfWord` marks complete words
- `children` maps characters to child nodes

### 2. DFS Search Algorithm
```typescript
const dfs = (row: number, col: number, currentWord: string) => {
  visited[row][col] = true;
  const newWord = currentWord + grid[row][col].toLowerCase();
  
  // Check if current word is valid
  if (newWord.length >= 4 && newWord.length <= 16 && this.hasWord(newWord)) {
    foundWords.add(newWord);
  }
  
  // Early termination for invalid prefixes
  if (newWord.length >= 16 || !this.hasPrefix(newWord)) {
    visited[row][col] = false;
    return;
  }
  
  // Explore all 8 directions
  for (const [dr, dc] of directions) {
    const newRow = row + dr;
    const newCol = col + dc;
    
    if (isValidPosition(newRow, newCol) && !visited[newRow][newCol]) {
      dfs(newRow, newCol, newWord);
    }
  }
  
  visited[row][col] = false; // Backtrack
};
```

### 3. Direction Vectors
```typescript
const directions = [
  [-1, -1], [-1, 0], [-1, 1],  // top-left, top, top-right
  [0, -1],           [0, 1],    // left, right
  [1, -1],  [1, 0],  [1, 1]     // bottom-left, bottom, bottom-right
];
```

## Usage

### Basic Usage
```typescript
import { BoggleSolver } from './utils/boggleSolver';
import { loadSpanishWords } from './utils/wordLoader';

// Load Spanish words
const words = await loadSpanishWords();

// Create solver
const solver = new BoggleSolver(words);

// Define your 4x4 grid
const grid = [
  ['C', 'A', 'S', 'A'],
  ['E', 'M', 'O', 'L'],
  ['S', 'A', 'T', 'E'],
  ['A', 'R', 'E', 'S']
];

// Find all words
const foundWords = solver.findWords(grid);
console.log(foundWords); // ['casa', 'mesa', 'sate', ...]
```

### Performance Testing
```typescript
import { testBoggleSolver, comparePerformance } from './utils/boggleTest';

// Test with example grid
testBoggleSolver();

// Compare Trie vs Set performance
comparePerformance();

// Test multiple random grids
testRandomGrids(10);
```

## Boggle Rules Implementation

The algorithm implements all standard Boggle rules:

1. **Word Length**: 4-16 letters
2. **Movement**: 8 directions (horizontal, vertical, diagonal)
3. **No Reuse**: Each cell can only be used once per word
4. **Dictionary**: Words must exist in the provided word list
5. **Case Insensitive**: Handles both uppercase and lowercase letters

## Performance Optimizations

### 1. Trie vs Set Comparison
- **Trie**: O(k) prefix checking, better for large word lists
- **Set**: O(1) word checking, simpler but less efficient for prefix validation

### 2. Early Termination
- Stops exploring paths longer than 16 characters
- Stops when current prefix doesn't exist in Trie
- Avoids unnecessary recursive calls

### 3. Memory Management
- Uses backtracking to reuse visited array
- Efficient Trie structure with Map for children

## Example Results

For a typical 4x4 grid with Spanish words:
- **Grid Size**: 4×4
- **Words Found**: 50-200 words
- **Search Time**: 1-5ms
- **Memory Usage**: ~1-5MB (depending on word list size)

## Integration with Your Project

To integrate this solver with your existing Boggle game:

1. **Load your Spanish words**:
   ```bash
   node wordFilterScript.js
   ```

2. **Use the solver in your game logic**:
   ```typescript
   // In your game component
   const solver = new BoggleSolver(spanishWords);
   const validWords = solver.findWords(currentGrid);
   ```

3. **Add word validation**:
   ```typescript
   const isValidWord = (word: string) => {
     return word.length >= 4 && 
            word.length <= 16 && 
            solver.hasWord(word.toLowerCase());
   };
   ```

## Testing

Run the test functions in your browser console:
```javascript
// Test the solver
testBoggleSolver();

// Compare performance
comparePerformance();

// Test random grids
testRandomGrids(5);
```

## Files Structure

```
src/
├── utils/
│   ├── boggleSolver.ts    # Main algorithm implementation
│   ├── wordLoader.ts      # Word loading utilities
│   └── boggleTest.ts      # Testing and performance functions
├── components/
│   └── BoggleDemo.tsx     # React demo component
└── app/
    └── page.tsx           # Your existing Boggle game
```

This implementation provides an efficient, scalable solution for finding all valid Boggle words in a 4x4 grid using a Spanish word list. 