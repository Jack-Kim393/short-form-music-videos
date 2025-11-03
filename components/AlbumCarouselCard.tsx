import React from 'react';
import type { Album } from '../types';
import { PlayArrowIcon } from './icons';

interface AlbumCarouselCardProps {
  album: Album;
  onClick: () => void;
}

const AlbumCarouselCard: React.FC<AlbumCarouselCardProps> = ({ album, onClick }) => {
  return (
    <div onClick={onClick} className="w-40 flex-shrink-0 cursor-pointer group">
      <div className="relative aspect-square rounded-lg overflow-hidden mb-2">
        <img src={album.imageUrl} alt={album.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <PlayArrowIcon className="w-10 h-10 text-white/80" />
        </div>
      </div>
      <p className="font-semibold truncate text-sm text-gray-100">{album.title}</p>
      <p className="text-xs text-gray-400 truncate">{album.artistName}</p>
    </div>
  );
};

export default AlbumCarouselCard;
