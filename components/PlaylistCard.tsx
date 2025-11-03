import React from 'react';
import type { Playlist } from '../types';
import { PlayArrowIcon } from './icons';

interface PlaylistCardProps {
  playlist: Playlist;
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist }) => {
  return (
    <div className="cursor-pointer group">
      <div className="relative aspect-square rounded-lg overflow-hidden mb-2">
        <img src={playlist.imageUrl} alt={playlist.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <PlayArrowIcon className="w-10 h-10 text-white/80" />
        </div>
      </div>
      <p className="font-semibold truncate text-sm text-gray-100">{playlist.title}</p>
      {playlist.subtitle && <p className="text-xs text-gray-400 truncate">{playlist.subtitle}</p>}
      {playlist.curator && 
        <div className="flex items-center mt-1">
            {/* Curator logo placeholder */}
            <div className="w-5 h-5 bg-orange-500 rounded-sm mr-1.5 flex items-center justify-center text-white text-[8px] font-bold">POP</div>
            <p className="text-xs text-gray-300">{playlist.curator.name}</p>
        </div>
      }
    </div>
  );
};

export default PlaylistCard;
