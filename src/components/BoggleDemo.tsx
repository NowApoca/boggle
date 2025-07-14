'use client';

import React, { useState, useEffect } from 'react';
import { BoggleSolver } from '../utils/boggleSolver';
import { loadSpanishWords } from '../utils/wordLoader';

interface BoggleDemoProps {
  initialGrid?: string[][];
}

export default function BoggleDemo({ initialGrid }: BoggleDemoProps) {
  const [grid, setGrid] = useState<string[][]>(
    initialGrid || [
      ['A', 'B', 'C', 'D'],
      ['E', 'F', 'G', 'H'],
      ['I', 'J', 'K', 'L'],
      ['M', 'N', 'O', 'P']
    ]
  );
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [solver, setSolver] = useState<BoggleSolver | null>(null);
  const [stats, setStats] = useState({
    totalWords: 0,
    searchTime: 0
  });

  // Initialize the solver with Spanish words
  useEffect(() => {
    const initializeSolver = async () => {
      setIsLoading(true);
      try {
        const words = await loadSpanishWords();
        const newSolver = new BoggleSolver(words);
        setSolver(newSolver);
        console.log(`Loaded ${words.length} Spanish words`);
      } catch (error) {
        console.error('Error initializing solver:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeSolver();
  }, []);

  // Update a cell in the grid
  const updateCell = (row: number, col: number, value: string) => {
    const newGrid = grid.map((r, i) =>
      r.map((c, j) => (i === row && j === col ? value.toUpperCase() : c))
    );
    setGrid(newGrid);
  };

  // Find all words in the current grid
  const findWords = () => {
    if (!solver) return;

    setIsLoading(true);
    const startTime = performance.now();
    
    try {
      const words = solver.findWords(grid);
      const endTime = performance.now();
      
      setFoundWords(words);
      setStats({
        totalWords: words.length,
        searchTime: endTime - startTime
      });
    } catch (error) {
      console.error('Error finding words:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate a random grid
  const generateRandomGrid = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const newGrid = Array(4).fill(null).map(() =>
      Array(4).fill(null).map(() =>
        letters[Math.floor(Math.random() * letters.length)]
      )
    );
    setGrid(newGrid);
    setFoundWords([]);
    setStats({ totalWords: 0, searchTime: 0 });
  };

  // Clear the grid
  const clearGrid = () => {
    const emptyGrid = Array(4).fill(null).map(() => Array(4).fill(''));
    setGrid(emptyGrid);
    setFoundWords([]);
    setStats({ totalWords: 0, searchTime: 0 });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Boggle Solver</h1>
      
      {/* Grid */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">4x4 Grid</h2>
        <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto">
          {grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <input
                key={`${rowIndex}-${colIndex}`}
                type="text"
                value={cell}
                onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
                className="w-16 h-16 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none uppercase"
                maxLength={1}
                placeholder=""
              />
            ))
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={findWords}
          disabled={isLoading || !solver}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Finding Words...' : 'Find Words'}
        </button>
        <button
          onClick={generateRandomGrid}
          className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Random Grid
        </button>
        <button
          onClick={clearGrid}
          className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Clear Grid
        </button>
      </div>

      {/* Stats */}
      {stats.totalWords > 0 && (
        <div className="text-center mb-6 p-4 bg-gray-100 rounded-lg">
          <p className="text-lg">
            Found <span className="font-bold text-blue-600">{stats.totalWords}</span> words
          </p>
          <p className="text-sm text-gray-600">
            Search time: <span className="font-mono">{stats.searchTime.toFixed(2)}ms</span>
          </p>
        </div>
      )}

      {/* Results */}
      {foundWords.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Found Words</h2>
          <div className="bg-white border rounded-lg p-4 max-h-96 overflow-y-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {foundWords.map((word, index) => (
                <div
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                >
                  {word}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="font-semibold text-yellow-800 mb-2">How to play:</h3>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Words must be 4-16 letters long</li>
          <li>• You can move in any direction: up, down, left, right, or diagonal</li>
          <li>• You cannot use the same letter twice in a word</li>
          <li>• Words must exist in the Spanish dictionary</li>
        </ul>
      </div>
    </div>
  );
} 