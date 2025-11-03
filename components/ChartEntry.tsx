import React from 'react';
import type { ChartItem } from '../types';
import { PlayArrowIcon, MoreVertIcon } from './icons';

interface ChartEntryProps {
  item: ChartItem;
  onPlay: (song: ChartItem['song']) => void;
}

const RankChange: React.FC<{ change: ChartItem['change'] }> = ({ change }) => {
  if (change.status === 'same') {
    return <span className="text-xs text-gray-500">-</span>;
  }
  if (change.status === 'new') {
    return <span className="text-xs text-red-500 font-bold">NEW</span>;
  }
  const color = change.status === 'up' ? 'text-red-500' : 'text-blue-500';
  const symbol = change.status === 'up' ? '▲' : '▼';
  return (
    <span className={`text-xs ${color} flex items-center`}>
      {symbol}
      <span className="ml-1">{change.value}</span>
    </span>
  );
};

const ChartEntry: React.FC<ChartEntryProps> = ({ item, onPlay }) => {
  return (
    <div className="flex items-center p-2 rounded-lg hover:bg-white/5">
      <div className="w-10 flex-shrink-0 flex items-center justify-center">
        <p className="text-lg font-bold">{item.rank}</p>
      </div>
      <div className="w-16 flex-shrink-0 text-center">
        <RankChange change={item.change} />
      </div>
      <img src={item.song.imageUrl} alt={item.song.song} className="w-12 h-12 rounded-md mx-2" />
      <div className="flex-1 min-w-0">
        <p className="font-semibold truncate text-white">{item.song.song.split(' - ')[0]}</p>
        <p className="text-sm truncate text-gray-400">{item.song.user.name}</p>
      </div>
      <button onClick={() => onPlay(item.song)} className="p-2 text-gray-400 hover:text-white" aria-label={`Play ${item.song.song}`}>
        <PlayArrowIcon />
      </button>
       <button onClick={() => alert(`More options for ${item.song.song}`)} className="p-2 text-gray-400 hover:text-white" aria-label={`More options for ${item.song.song}`}>
        <MoreVertIcon />
      </button>
    </div>
  );
};

export default ChartEntry;