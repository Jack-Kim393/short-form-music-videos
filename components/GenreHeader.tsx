import React, { useRef, useEffect } from 'react';
import type { Genre } from '../types';

interface GenreHeaderProps {
  genres: Genre[];
  activeGenreId: string;
  onSelectGenre: (genreId: string) => void;
}

const GenreHeader: React.FC<GenreHeaderProps> = ({ genres, activeGenreId, onSelectGenre }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeTagRef = useRef<HTMLButtonElement>(null);

  // This effect scrolls the active tag into view when the active genre changes (e.g., from a user swipe)
  useEffect(() => {
    if (activeTagRef.current && containerRef.current) {
        const container = containerRef.current;
        const tag = activeTagRef.current;
        
        const containerRect = container.getBoundingClientRect();
        const tagRect = tag.getBoundingClientRect();

        // Calculate the scroll position to center the tag
        const scrollLeft = container.scrollLeft + tagRect.left - containerRect.left - (containerRect.width / 2) + (tagRect.width / 2);
        
        container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  }, [activeGenreId]);

  return (
    <div 
        ref={containerRef}
        className="flex space-x-3 overflow-x-auto scrollbar-hide pl-14 pr-4 sm:pr-6"
    >
      {genres.map(genre => (
        <button
          key={genre.id}
          ref={genre.id === activeGenreId ? activeTagRef : null}
          onClick={() => onSelectGenre(genre.id)}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors flex-shrink-0 ${
            activeGenreId === genre.id
              ? 'bg-white text-black'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          {`#${genre.name.replace(/\s+/g, '')}`}
        </button>
      ))}
    </div>
  );
};

export default GenreHeader;