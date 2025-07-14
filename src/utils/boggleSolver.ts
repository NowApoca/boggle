// Trie node structure for efficient word lookup
interface TrieNode {
  children: Map<string, TrieNode>;
  isEndOfWord: boolean;
}

// Boggle solver class
export class BoggleSolver {
  private trie: TrieNode;
  private words: Set<string>;

  constructor(wordList: string[]) {
    this.trie = this.buildTrie(wordList);
    this.words = new Set(wordList);
  }

  // Build a Trie from the word list for efficient prefix checking
  private buildTrie(words: string[]): TrieNode {
    const root: TrieNode = {
      children: new Map(),
      isEndOfWord: false
    };

    for (const word of words) {
      let current = root;
      for (const char of word.toLowerCase()) {
        if (!current.children.has(char)) {
          current.children.set(char, {
            children: new Map(),
            isEndOfWord: false
          });
        }
        current = current.children.get(char)!;
      }
      current.isEndOfWord = true;
    }

    return root;
  }

  // Check if a prefix exists in the Trie
  private hasPrefix(prefix: string): boolean {
    let current = this.trie;
    for (const char of prefix.toLowerCase()) {
      if (!current.children.has(char)) {
        return false;
      }
      current = current.children.get(char)!;
    }
    return true;
  }

  // Check if a word exists in the Trie
  private hasWord(word: string): boolean {
    let current = this.trie;
    for (const char of word.toLowerCase()) {
      if (!current.children.has(char)) {
        return false;
      }
      current = current.children.get(char)!;
    }
    return current.isEndOfWord;
  }

  // Get all valid words from a Boggle grid
  public findWords(grid: string[][]): string[] {
    if (!grid || grid.length === 0 || grid[0].length === 0) {
      return [];
    }

    const rows = grid.length;
    const cols = grid[0].length;
    const foundWords = new Set<string>();
    const visited = Array(rows).fill(null).map(() => Array(cols).fill(false));

    // Direction vectors for 8 possible moves (up, down, left, right, and diagonals)
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],  // top-left, top, top-right
      [0, -1],           [0, 1],    // left, right
      [1, -1],  [1, 0],  [1, 1]     // bottom-left, bottom, bottom-right
    ];

    // DFS function to explore all possible paths
    const dfs = (row: number, col: number, currentWord: string) => {
      // Mark current cell as visited
      visited[row][col] = true;

      // Add current letter to word
      const newWord = currentWord + grid[row][col].toLowerCase();

      // Check if current word is a valid word (4-16 letters)
      if (newWord.length >= 4 && newWord.length <= 16 && this.hasWord(newWord)) {
        foundWords.add(newWord);
      }

      // If word is too long or no valid prefix, stop exploring
      if (newWord.length >= 16 || !this.hasPrefix(newWord)) {
        visited[row][col] = false;
        return;
      }

      // Explore all 8 directions
      for (const [dr, dc] of directions) {
        const newRow = row + dr;
        const newCol = col + dc;

        // Check bounds and if not visited
        if (newRow >= 0 && newRow < rows && 
            newCol >= 0 && newCol < cols && 
            !visited[newRow][newCol]) {
          dfs(newRow, newCol, newWord);
        }
      }

      // Backtrack: unmark current cell
      visited[row][col] = false;
    };

    // Start DFS from every cell in the grid
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        dfs(row, col, '');
      }
    }

    return Array.from(foundWords).sort();
  }

  // Alternative method using the Set for word checking (simpler but less efficient for large word lists)
  public findWordsSimple(grid: string[][]): string[] {
    if (!grid || grid.length === 0 || grid[0].length === 0) {
      return [];
    }

    const rows = grid.length;
    const cols = grid[0].length;
    const foundWords = new Set<string>();
    const visited = Array(rows).fill(null).map(() => Array(cols).fill(false));

    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1]
    ];

    const dfs = (row: number, col: number, currentWord: string) => {
      visited[row][col] = true;
      const newWord = currentWord + grid[row][col].toLowerCase();

      if (newWord.length >= 4 && newWord.length <= 16 && this.words.has(newWord)) {
        foundWords.add(newWord);
      }

      if (newWord.length < 16) {
        for (const [dr, dc] of directions) {
          const newRow = row + dr;
          const newCol = col + dc;

          if (newRow >= 0 && newRow < rows && 
              newCol >= 0 && newCol < cols && 
              !visited[newRow][newCol]) {
            dfs(newRow, newCol, newWord);
          }
        }
      }

      visited[row][col] = false;
    };

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        dfs(row, col, '');
      }
    }

    return Array.from(foundWords).sort();
  }
}

// Utility function to create a solver instance
export function createBoggleSolver(wordList: string[]): BoggleSolver {
  return new BoggleSolver(wordList);
}

// Example usage function
export function solveBoggle(grid: string[][], wordList: string[]): string[] {
  const solver = createBoggleSolver(wordList);
  return solver.findWords(grid);
} 