import React from 'react';
import type { ShortFormVideo, Genre } from '../types';
import { GENRES } from '../constants';
import RecommendationCard from './RecommendationCard';

interface RecommendedFeedProps {
  videos: ShortFormVideo[];
  onSelectGenre: (genre: Genre) => void;
}

const RecommendedFeed: React.FC<RecommendedFeedProps> = ({ videos, onSelectGenre }) => {
  const handleCardClick = (video: ShortFormVideo) => {
    const targetGenre = GENRES.find(g => g.name === video.genreName);
    if (targetGenre) {
      onSelectGenre(targetGenre);
    }
  };

  return (
    // This is the full-screen snap area, same as the video player.
    // It centers its child (the recommendations container).
    <div className="h-screen w-full snap-center relative flex items-center justify-center p-4">
      
      {/* This is the actual content container with a 9:16 aspect ratio for uniformity. */}
      <div 
        className="relative h-full w-auto aspect-[9/16] max-w-full overflow-hidden bg-black flex flex-col items-center justify-center rounded-2xl"
      >
        <div className="p-6 text-center w-full">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
            Looking for more music?
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {videos.map(video => (
                <RecommendationCard 
                  key={video.id} 
                  video={video} 
                  onClick={() => handleCardClick(video)}
                />
            ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendedFeed;