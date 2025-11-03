import React from 'react';
import type { Genre } from '../types';
import GenreCard from './GenreCard';

interface FeedCarouselProps {
  genres: Genre[];
  onSelectGenre: (genre: Genre) => void;
  isFullView: boolean;
}

const FeedCarousel: React.FC<FeedCarouselProps> = ({ genres, onSelectGenre, isFullView }) => {
  if (isFullView) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-8 pb-10">
        {genres.map(genre => (
          <div key={genre.id}>
            <h2 className="text-base sm:text-lg font-bold mb-2 truncate text-gray-200">{genre.name}</h2>
            <GenreCard genre={genre} onClick={() => onSelectGenre(genre)} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex space-x-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
      {genres.map(genre => (
        <div key={genre.id} className="w-36 sm:w-40 flex-shrink-0">
           <h2 className="text-base sm:text-lg font-bold mb-2 truncate text-gray-200">{genre.name}</h2>
          <GenreCard genre={genre} onClick={() => onSelectGenre(genre)} />
        </div>
      ))}
    </div>
  );
};

export default FeedCarousel;