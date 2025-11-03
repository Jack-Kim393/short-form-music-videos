import React from 'react';
import type { Genre } from '../types';

interface GenreCardProps {
  genre: Genre;
  onClick: () => void;
}

const GenreCard: React.FC<GenreCardProps> = ({ genre, onClick }) => {
  const firstVideoImage = genre.videos[0]?.imageUrl || `https://picsum.photos/seed/${genre.id}/400/800`;

  return (
    <div
      onClick={onClick}
      className="relative rounded-xl overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-300 group aspect-[9/16]"
    >
      <img 
        src={firstVideoImage} 
        alt={genre.name} 
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out" 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
      {/* Text content has been removed from the card */}
    </div>
  );
};

export default GenreCard;