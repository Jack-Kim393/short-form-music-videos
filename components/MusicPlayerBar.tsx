import React from 'react';
import type { ShortFormVideo } from '../types';
import { PlayArrowIcon, SkipForwardIcon, QueueIcon } from './icons';

interface MusicPlayerBarProps {
  song: ShortFormVideo;
  onPlay: () => void;
}

const MusicPlayerBar: React.FC<MusicPlayerBarProps> = ({ song, onPlay }) => {
  return (
    <div 
        className="bg-[#2a2a2a] p-2 flex items-center gap-3 text-white"
        onClick={onPlay}
    >
      <img src={song.imageUrl} alt={song.song} className="w-12 h-12 rounded-md" />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm truncate">{song.song.split(' - ')[0]}</p>
        <p className="text-xs text-gray-400 truncate">{song.user.name}</p>
      </div>
      <div className="flex items-center gap-4 pr-2">
        <button onClick={(e) => { e.stopPropagation(); alert('Play!'); }}><PlayArrowIcon className="h-7 w-7" /></button>
        <button onClick={(e) => { e.stopPropagation(); alert('Next song!'); }}><SkipForwardIcon className="h-7 w-7" /></button>
        <button onClick={(e) => { e.stopPropagation(); alert('Show queue!'); }}><QueueIcon className="h-6 w-6" /></button>
      </div>
    </div>
  );
};

export default MusicPlayerBar;
