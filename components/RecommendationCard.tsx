import React from 'react';
import type { ShortFormVideo } from '../types';

interface RecommendationCardProps {
  video: ShortFormVideo;
  onClick: () => void;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ video, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="relative rounded-lg overflow-hidden cursor-pointer group aspect-[9/16] bg-gray-800 transform transition-transform duration-300 hover:scale-105"
    >
      <img 
        src={video.imageUrl} 
        alt={video.description} 
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out" 
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent"></div>
      
      {video.genreName && (
        <p className="absolute top-2 left-2 text-white text-xs font-bold drop-shadow-md p-1 px-2 bg-black/30 rounded-full">
            {video.genreName}
        </p>
      )}
    </div>
  );
};

export default RecommendationCard;