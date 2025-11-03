import React from 'react';
import type { ShortFormVideo } from '../types';
import { PlayArrowIcon } from './icons';

interface VideoThumbnailCardProps {
  video: ShortFormVideo;
  onClick: () => void;
}

const VideoThumbnailCard: React.FC<VideoThumbnailCardProps> = ({ video, onClick }) => {
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
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="bg-black/50 rounded-full p-2">
            <PlayArrowIcon className="h-6 w-6 text-white" />
        </div>
      </div>
      <div className="absolute bottom-2 left-2 right-2 text-white text-xs">
          <p className="font-bold truncate">{video.song}</p>
          <p className="truncate opacity-80">{video.likes.toLocaleString()} views</p>
      </div>
    </div>
  );
};

export default VideoThumbnailCard;