import React, { useEffect, useRef } from 'react';
import type { ShortFormVideo } from '../types';
import { CloseIcon } from './icons';

interface MusicVideoPlayerProps {
  video: ShortFormVideo;
  onClose: () => void;
}

const MusicVideoPlayer: React.FC<MusicVideoPlayerProps> = ({ video, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Lock body scroll
    document.body.style.overflow = 'hidden';

    // Autoplay video
    videoRef.current?.play().catch(e => console.error("Autoplay was prevented.", e));

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4 animate-fade-in"
      onClick={onClose} // Close on backdrop click
    >
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>

      <button
        className="absolute top-4 right-4 text-white z-20 p-2 bg-black/30 rounded-full hover:bg-white/20 transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="Close music video"
      >
        <CloseIcon />
      </button>

      <div 
        className="w-full max-w-5xl relative"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the video container
      >
        <div className="aspect-video w-full bg-black rounded-lg overflow-hidden shadow-2xl mb-4">
          <video
            ref={videoRef}
            src={video.videoUrl}
            poster={video.imageUrl}
            controls
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full"
          />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white truncate">{video.song.split(' - ')[0] || video.song}</h2>
          <p className="text-gray-300">{video.user.name}</p>
        </div>
      </div>
    </div>
  );
};

export default MusicVideoPlayer;
