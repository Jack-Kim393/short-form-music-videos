import React, { useState, useEffect, useRef } from 'react';
import type { ShortFormVideo as ShortFormVideoType, Album } from '../types';
import {
  CloseIcon,
  PlayArrowIcon,
  PauseIcon,
  SkipBackIcon,
  SkipForwardIcon,
  ShuffleIcon,
  RepeatIcon,
  MoreVertIcon,
  DevicesIcon,
  QueueIcon,
} from './icons';

interface MusicPlayerScreenProps {
  video: ShortFormVideoType;
  onClose: () => void;
  onSelectArtist: (artist: { name: string; avatarUrl: string }) => void;
  onSelectAlbum: (album: Album) => void;
}

// Generate a mock album for the song
const generateMockAlbum = (video: ShortFormVideoType): Album => {
    const seed = video.song;
    return {
        id: `${video.id}-album`,
        title: `Single`,
        year: new Date().getFullYear(),
        imageUrl: video.imageUrl,
        featuredVideo: video,
        tracks: [{
            id: `${video.id}-track`,
            title: video.song.split(' - ')[0],
            duration: '3:15'
        }],
    };
};

const MusicPlayerScreen: React.FC<MusicPlayerScreenProps> = ({ video, onClose, onSelectArtist, onSelectAlbum }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (intervalRef.current) {
        clearInterval(intervalRef.current);
    }
    if (isPlaying && !isSeeking) {
      intervalRef.current = window.setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            return 0; // Loop song
          }
          // Simulate 3:15 duration (195 seconds)
          const increment = 100 / (195 * (1000 / 100)); 
          return Math.min(prev + increment, 100);
        });
      }, 100);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, isSeeking]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProgress(Number(e.target.value));
  };
  
  const handleSeekStart = () => {
    setIsSeeking(true);
  };
  
  const handleSeekEnd = () => {
    setIsSeeking(false);
  };

  const handleAlbumClick = () => {
    const mockAlbum = generateMockAlbum(video);
    onSelectAlbum(mockAlbum);
  };

  const formatTime = (percentage: number) => {
    const totalSeconds = 195; // 3:15
    const currentSeconds = Math.floor((percentage / 100) * totalSeconds);
    const minutes = Math.floor(currentSeconds / 60);
    const seconds = (currentSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col animate-slide-up pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
       <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out forwards;
        }
        .seek-slider-player {
          -webkit-appearance: none; appearance: none;
          width: 100%; height: 4px; background: transparent;
          outline: none; cursor: pointer;
        }
        .seek-slider-player::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none;
          width: 16px; height: 16px;
          background: white; border-radius: 50%;
          cursor: pointer;
        }
        .seek-slider-player::-moz-range-thumb {
          width: 16px; height: 16px;
          background: white; border-radius: 50%;
          cursor: pointer; border: none;
        }
      `}</style>

      {/* Header */}
      <div className="flex justify-between items-center p-4 flex-shrink-0">
        <button onClick={onClose} aria-label="Close music player">
          <CloseIcon />
        </button>
        <div className="text-center">
          <p className="text-xs uppercase text-gray-400">Playing from Artist</p>
          <p className="font-bold">{video.user.name}</p>
        </div>
        <button aria-label="More options">
            <MoreVertIcon />
        </button>
      </div>

      {/* Album Art */}
      <div className="flex-1 flex items-center justify-center px-6 sm:px-16 min-h-0">
        <button onClick={handleAlbumClick} className="w-full aspect-square max-w-md rounded-lg shadow-2xl overflow-hidden">
            <img src={video.imageUrl} alt={video.song} className="w-full h-full object-cover" />
        </button>
      </div>

      {/* Song Info & Controls */}
      <div className="p-4 sm:p-6 flex-shrink-0">
        <div className="flex justify-between items-center mb-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold truncate">{video.song.split(' - ')[0] || video.song}</h2>
            <button onClick={() => onSelectArtist(video.user)} className="text-gray-300 hover:underline">
              {video.user.name}
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="relative w-full h-1 bg-gray-700 rounded-full">
            <div className="absolute h-full bg-white rounded-full" style={{ width: `${progress}%` }}></div>
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={handleSeek}
              onMouseDown={handleSeekStart}
              onTouchStart={handleSeekStart}
              onMouseUp={handleSeekEnd}
              onTouchEnd={handleSeekEnd}
              className="seek-slider-player absolute w-full -top-1.5"
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>{formatTime(progress)}</span>
            <span>3:15</span>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-between">
          <button className="text-gray-400 hover:text-white"><ShuffleIcon /></button>
          <button><SkipBackIcon className="h-10 w-10" /></button>
          <button onClick={() => setIsPlaying(!isPlaying)} className="bg-white text-black rounded-full h-16 w-16 flex items-center justify-center">
            {isPlaying ? <PauseIcon className="h-8 w-8 text-black" /> : <PlayArrowIcon className="h-8 w-8 text-black" />}
          </button>
          <button><SkipForwardIcon className="h-10 w-10" /></button>
          <button className="text-gray-400 hover:text-white"><RepeatIcon /></button>
        </div>

        {/* Bottom Bar */}
        <div className="flex justify-between items-center mt-4">
            <button><DevicesIcon className="h-5 w-5 text-gray-300"/></button>
            <button><QueueIcon className="h-5 w-5 text-gray-300"/></button>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayerScreen;