"use client";
import { useCallback, useEffect, useState } from "react";

const { words } = require("./words");

export default function Home() {
  const [grid, setGrid] = useState<string[][]>([]);
  const [currentWords, setCurrentWords] = useState<string[]>([]);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds
  const [showAllWords, setShowAllWords] = useState(false);
  const [keyboardInput, setKeyboardInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Keyboard input detection
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      setKeyboardInput(prev => {
        const newInput = prev + key;
        
        // Check if "soyputo" is typed
        if (newInput.includes("soyputo")) {
          setShowAllWords(true);
          return ""; // Reset input
        }
        
        // Keep only last 7 characters to avoid memory issues
        return newInput.slice(-7);
      });
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const DICE = [
    ['N', 'D', 'S', 'E', 'A', 'O'],
    ['A', 'O', 'U', 'E', 'A', 'I'],
    ['N', 'I', 'T', 'A', 'G', 'U'],
    ['V', 'O', 'N', 'J', 'S', 'L'],
    ['E', 'S', 'O', 'Ñ', 'A', 'D'],
    ['E', 'Qu', 'O', 'S', 'H', 'D'],
    ['C', 'E', 'N', 'O', 'L', 'S'],
    ['D', 'T', 'A', 'R', 'O', 'I'],
    ['C', 'N', 'I', 'R', 'T', 'F'],
    ['P', 'S', 'C', 'E', 'L', 'O'],
    ['E', 'H', 'I', 'X', 'U', 'R'],
    ['B', 'O', 'M', 'L', 'E', 'Z'],
    ['A', 'R', 'E', 'C', 'M', 'A'],
    ['S', 'A', 'C', 'E', 'N', 'O'],
    ['P', 'O', 'D', 'E', 'T', 'A'],
    ['B', 'R', 'A', 'E', 'L', 'A'],
  ];

  function shuffle<T>(array: T[]): T[] {
    const arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Generate 4x4 grid with exactly 6 vowels
  const generateGrid = useCallback(() => {
    if (words.length === 0) return; // Don't generate if words aren't loaded yet
    
    // Shuffle the dice order
    const shuffledDice = shuffle(DICE);
    // Roll each die (pick a random face)
    const faces = shuffledDice.map(die => {
      const faceIndex = Math.floor(Math.random() * die.length);
      return die[faceIndex];
    });
    // Build 4x4 grid
    const newGrid = Array(4).fill(null).map((_, row) =>
      Array(4).fill(null).map((_, col) => faces[row * 4 + col])
    );
    setGrid(newGrid);
    setTimeLeft(120); // Reset timer
    setIsTimerRunning(true);
    setShowAllWords(false); // Reset show all words when generating new grid
    
    const solver = createBoggleSolver(words);
    const wordsDoable = solver.findWords(newGrid);
    setCurrentWords(wordsDoable);
  }, [words]);

  // Handle start timer with 5-second delay
  const handleStartTimer = useCallback(() => {
    setIsGenerating(true);
    setTimeLeft(120);
    setTimeout(() => {
      generateGrid();
      setIsGenerating(false);
    }, 3000);
  }, [isTimerRunning, generateGrid]);

  // Timer effect
  useEffect(() => {
    let timer: number;
    if (isTimerRunning && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerRunning(false);
    }
    return () => window.clearInterval(timer);
  }, [isTimerRunning, timeLeft]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Styles
  const outerStyle: React.CSSProperties = {
    minHeight: '100vh',
    minWidth: '100vw',
    background: 'linear-gradient(135deg, #e3f0ff 0%, #f9fbfd 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 0,
    padding: 0,
  };
  const containerStyle: React.CSSProperties = {
    background: '#fff',
    borderRadius: 24,
    boxShadow: '0 4px 32px 0 rgba(0,0,0,0.08)',
    padding: 32,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 320,
    maxWidth: 480,
    width: '90vw',
    gap: 24,
  };
  const titleStyle: React.CSSProperties = {
    fontSize: 36,
    fontWeight: 700,
    textAlign: 'center',
    marginBottom: 8,
    color: '#2563eb',
    letterSpacing: 1,
  };
  const buttonRowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    gap: 16,
    width: '100%',
    marginBottom: 8,
  };
  const buttonStyle: React.CSSProperties = {
    background: '#2563eb',
    color: '#fff',
    fontWeight: 600,
    fontSize: 16,
    padding: '12px 0',
    border: 'none',
    borderRadius: 12,
    width: 140,
    cursor: 'pointer',
    boxShadow: '0 2px 8px 0 rgba(37,99,235,0.08)',
    transition: 'background 0.2s',
  };
  const buttonAltStyle: React.CSSProperties = {
    ...buttonStyle,
    background: isTimerRunning ? '#ef4444' : '#22c55e',
    boxShadow: isTimerRunning
      ? '0 2px 8px 0 rgba(239,68,68,0.08)'
      : '0 2px 8px 0 rgba(34,197,94,0.08)',
  };
  const timerStyle: React.CSSProperties = {
    textAlign: 'center',
    fontSize: 28,
    fontWeight: 700,
    color: '#2563eb',
    margin: '12px 0',
    letterSpacing: 1,
  };
  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 12,
    width: '100%',
    maxWidth: 360,
    margin: '0 auto',
    marginTop: 16,
  };
  const cellStyle: React.CSSProperties = {
    aspectRatio: '1 / 1',
    background: '#e0e7ff',
    borderRadius: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    minWidth: 56,
    minHeight: 56,
    fontSize: 32,
    color: '#1e293b',
    boxShadow: '0 1px 4px 0 rgba(30,41,59,0.08)',
    userSelect: 'none',
  };
  const wordsContainerStyle: React.CSSProperties = {
    width: '100%',
    background: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    border: '1px solid #e2e8f0',
  };
  const wordItemStyle: React.CSSProperties = {
    padding: '4px 8px',
    margin: '2px 0',
    background: '#e0e7ff',
    borderRadius: 6,
    fontSize: 14,
    color: '#1e293b',
  };
  const generatingStyle: React.CSSProperties = {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 600,
    color: '#f59e0b',
    margin: '12px 0',
  };

  return (
    <div style={outerStyle}>
      <div style={containerStyle}>
        <h1 style={titleStyle}>Boggle Game</h1>
        <div style={buttonRowStyle}>
          <button
            onClick={handleStartTimer}
            style={buttonStyle}
            onMouseOver={e => (e.currentTarget.style.background = '#1d4ed8')}
            onMouseOut={e => (e.currentTarget.style.background = '#2563eb')}
            disabled={isGenerating}
          >
            Generate New Grid
          </button>
        </div>
        
        {isGenerating && (
          <div style={generatingStyle}>
            Generating grid in 3 seconds...
          </div>
        )}
        
        <div style={timerStyle}>
          Time: {formatTime(timeLeft)}
        </div>
        
        {grid.length > 0 && (
          <div style={gridStyle}>
            {grid.map((row, i) =>
              row.map((letter, j) => (
                <div key={`${i}-${j}`} style={cellStyle}>
                  {letter}
                </div>
              ))
            )}
          </div>
        )}
        
        {showAllWords && currentWords.length > 0 && (
          <div style={{ width: '100%', marginTop: 16 }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: '#2563eb' }}>
              All Possible Words ({currentWords.length}):
            </h3>
            <div style={wordsContainerStyle}>
              {currentWords.map((word, index) => (
                <div key={index} style={wordItemStyle}>
                  {word}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 

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

