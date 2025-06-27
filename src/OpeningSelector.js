import React, { useState } from 'react';

export const OpeningSelector = ({ openings, onSelect, currentOpening }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'e4', 'd4', 'c4', 'other'

  // Group openings by first move
  const groupedOpenings = {
    'e4': openings.filter(o => o.moves[0]?.startsWith('e4') || o.moves[0]?.startsWith('e2e4')),
    'd4': openings.filter(o => o.moves[0]?.startsWith('d4') || o.moves[0]?.startsWith('d2d4')),
    'c4': openings.filter(o => o.moves[0]?.startsWith('c4') || o.moves[0]?.startsWith('c2c4')),
    'Nf3': openings.filter(o => o.moves[0]?.startsWith('Nf3') || o.moves[0]?.startsWith('g1f3')),
    'other': openings.filter(o => {
      const firstMove = o.moves[0];
      return firstMove && 
        !firstMove.startsWith('e4') && 
        !firstMove.startsWith('e2e4') && 
        !firstMove.startsWith('d4') && 
        !firstMove.startsWith('d2d4') && 
        !firstMove.startsWith('c4') && 
        !firstMove.startsWith('c2c4') &&
        !firstMove.startsWith('Nf3') &&
        !firstMove.startsWith('g1f3');
    })
  };

  // Filter openings based on search term
  const filteredOpenings = 
    filter === 'all' 
      ? openings.filter(o => o.name.toLowerCase().includes(searchTerm.toLowerCase()))
      : groupedOpenings[filter].filter(o => o.name.toLowerCase().includes(searchTerm.toLowerCase()));

  // Sort by popularity (win rate for now)
  const sortedOpenings = [...filteredOpenings].sort((a, b) => b.popularity - a.popularity || b.winRate - a.winRate);

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-xl font-bold mb-4">Chess Openings</h2>
      
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search openings..."
          className="w-full p-2 rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="flex gap-2 mb-4 flex-wrap">
        <button 
          className={`filter-button px-3 py-1 rounded ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button 
          className={`px-3 py-1 rounded ${filter === 'e4' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setFilter('e4')}
        >
          1.e4
        </button>
        <button 
          className={`px-3 py-1 rounded ${filter === 'd4' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setFilter('d4')}
        >
          1.d4
        </button>
        <button 
          className={`px-3 py-1 rounded ${filter === 'c4' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setFilter('c4')}
        >
          1.c4
        </button>
        <button 
          className={`px-3 py-1 rounded ${filter === 'Nf3' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setFilter('Nf3')}
        >
          1.Nf3
        </button>
        <button 
          className={`px-3 py-1 rounded ${filter === 'other' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setFilter('other')}
        >
          Other
        </button>
      </div>
      
      <div className="overflow-y-auto flex-grow">
        <ul className="space-y-1">
          {sortedOpenings.map((opening, index) => (
            <li 
              key={index}
              className={`opening-item p-2 cursor-pointer rounded ${
                currentOpening?.name === opening.name ? 'opening-selected' : ''
              }`}
              onClick={() => onSelect(opening.name)}
            >
              <div className="font-medium">{opening.name}</div>
              <div className="text-sm text-gray-600">
                Win: {Math.round(opening.winRate)}% • Draw: {Math.round(opening.drawRate)}% • Loss: {Math.round(opening.loseRate)}%
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};