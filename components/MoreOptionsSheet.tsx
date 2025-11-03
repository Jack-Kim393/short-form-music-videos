import React from 'react';
import type { ShortFormVideo, Album } from '../types';
import {
  PlaylistAddIcon,
  ShuffleIcon,
  SparklesIcon,
  InfoIcon,
  AlbumIcon,
  VisibilityOffIcon,
  UserRemoveIcon,
} from './icons';

// Generate a mock album for the song
const generateMockAlbum = (video: ShortFormVideo): Album => {
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


interface MoreOptionsSheetProps {
  video: ShortFormVideo;
  onClose: () => void;
  onSelectAlbum: (album: Album) => void;
  onShowSongInfo: () => void;
  showToast: (message: string) => void;
}

const MoreOptionsSheet: React.FC<MoreOptionsSheetProps> = ({
  video,
  onClose,
  onSelectAlbum,
  onShowSongInfo,
  showToast,
}) => {

  const handleAction = (callback: () => void, message: string) => {
    onClose();
    // Use a short timeout to allow the sheet to close before showing the toast
    setTimeout(() => {
      callback();
      showToast(message);
    }, 200);
  };
  
  const handleAlbumInfo = () => {
    onClose();
    setTimeout(() => {
      const mockAlbum = generateMockAlbum(video);
      onSelectAlbum(mockAlbum);
    }, 200);
  };
  
  const handleSongInfo = () => {
    onClose();
    setTimeout(() => {
        onShowSongInfo();
    }, 200);
  };

  const menuItems = [
    { icon: <PlaylistAddIcon />, text: 'Put it on my playlist', action: () => handleAction(() => {}, 'Added to your playlist') },
    { icon: <ShuffleIcon />, text: 'Play the mix-up with this song', action: () => handleAction(() => {}, 'Creating a mix...') },
    { icon: <SparklesIcon />, text: 'View similar songs', action: () => handleAction(() => {}, 'Finding similar songs...') },
    { icon: <InfoIcon />, text: 'Song information', action: handleSongInfo },
    { icon: <AlbumIcon />, text: 'Album information', action: handleAlbumInfo },
    { icon: <VisibilityOffIcon />, text: "Do not play this video", action: () => handleAction(() => {}, 'This video will be shown less') },
    { icon: <UserRemoveIcon />, text: 'Exclude videos from my preference profile', action: () => handleAction(() => {}, 'Video excluded from your profile') },
  ];

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 animate-fade-in-fast"
        onClick={onClose}
      ></div>

      {/* Sheet Content */}
      <div
        className="relative bg-gray-900 rounded-t-2xl pb-4 animate-slide-up-fast"
        onClick={(e) => e.stopPropagation()}
      >
        <style>{`
          @keyframes fade-in-fast { from { opacity: 0; } to { opacity: 1; } }
          .animate-fade-in-fast { animation: fade-in-fast 0.2s ease-out; }
          @keyframes slide-up-fast { from { transform: translateY(100%); } to { transform: translateY(0); } }
          .animate-slide-up-fast { animation: slide-up-fast 0.2s ease-out; }
        `}</style>
        
        <div className="w-12 h-1.5 bg-gray-600 rounded-full mx-auto my-3"></div>

        <ul className="px-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <button
                onClick={item.action}
                className="w-full flex items-center text-left p-3 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <div className="mr-4 text-gray-300">{item.icon}</div>
                <span className="text-base">{item.text}</span>
              </button>
            </li>
          ))}
        </ul>
        
        <button
          onClick={onClose}
          className="mt-4 w-full text-center py-3 text-lg font-semibold bg-gray-800 hover:bg-gray-700 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default MoreOptionsSheet;