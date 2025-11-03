import React, { useState } from 'react';
import type { ShortFormVideo as ShortFormVideoType, Album } from '../types';
import { 
    CloseIcon, 
    AlbumIcon, 
    MusicNoteIcon, 
    PenIcon,
    ProducerIcon,
    CalendarIcon
} from './icons';

// Re-using mock album generation logic
const generateMockAlbum = (video: ShortFormVideoType): Album => {
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

interface SongInfoScreenProps {
  video: ShortFormVideoType;
  onClose: () => void;
  onSelectArtist: (artist: { name: string; avatarUrl: string }) => void;
  onSelectAlbum: (album: Album) => void;
}

const CreditRow: React.FC<{ icon: React.ReactNode, label: string, value: string }> = ({ icon, label, value }) => (
    <div className="flex items-start py-2">
        <div className="text-gray-400 mt-1 mr-4">{icon}</div>
        <div>
            <p className="font-semibold">{value}</p>
            <p className="text-sm text-gray-400">{label}</p>
        </div>
    </div>
);


const SongInfoScreen: React.FC<SongInfoScreenProps> = ({ video, onClose, onSelectArtist, onSelectAlbum }) => {
  const [lyricsExpanded, setLyricsExpanded] = useState(false);

  const handleAlbumClick = () => {
    const mockAlbum = generateMockAlbum(video);
    onSelectAlbum(mockAlbum);
  };
  
  const handleArtistClick = () => {
    onSelectArtist(video.user);
  };

  const { songDetails } = video;
  const shortLyrics = songDetails.lyrics.split('\n\n')[0]; // Get first paragraph

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-gray-800 to-black z-50 flex flex-col animate-slide-up">
       <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out forwards;
        }
      `}</style>
      
      <div className="absolute top-0 left-0 right-0 h-80">
        <img src={video.imageUrl} alt={video.song} className="w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
      </div>

      <div className="relative flex-1 flex flex-col min-h-0">
          {/* Header */}
          <div className="flex justify-between items-center p-4 flex-shrink-0 z-10">
            <button onClick={onClose} aria-label="Close song information">
              <CloseIcon />
            </button>
            <div className="text-center">
              <p className="font-bold">Song Information</p>
            </div>
            <div className="w-6"></div> {/* Spacer */}
          </div>

          <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-6 scrollbar-hide">
                {/* Song Info Header */}
                <div className="flex flex-col items-center text-center mt-16 mb-8">
                    <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-lg shadow-2xl overflow-hidden mb-6 flex-shrink-0">
                        <img src={video.imageUrl} alt={video.song} className="w-full h-full object-cover" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold truncate max-w-sm">{video.song.split(' - ')[0] || video.song}</h2>
                    <button onClick={handleArtistClick} className="text-gray-300 hover:underline text-lg">
                        {video.user.name}
                    </button>
                </div>

                {/* Lyrics Section */}
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-4 mb-6">
                    <h3 className="font-bold text-lg mb-2">Lyrics</h3>
                    <p className="text-gray-300 whitespace-pre-line leading-relaxed">
                        {lyricsExpanded ? songDetails.lyrics : shortLyrics}
                    </p>
                    {!lyricsExpanded && (
                         <button onClick={() => setLyricsExpanded(true)} className="font-semibold text-white mt-3">
                           Show more...
                         </button>
                    )}
                </div>

                {/* Credits Section */}
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-4 mb-6">
                    <h3 className="font-bold text-lg mb-2">Credits</h3>
                    <div className="space-y-2">
                        <CreditRow icon={<PenIcon className="h-5 w-5"/>} label="Composer" value={songDetails.credits.composer} />
                        <CreditRow icon={<PenIcon className="h-5 w-5"/>} label="Lyricist" value={songDetails.credits.lyricist} />
                        <CreditRow icon={<ProducerIcon className="h-5 w-5"/>} label="Producer" value={songDetails.credits.producer} />
                    </div>
                </div>
                
                {/* Details Section */}
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-4 mb-6">
                     <div className="divide-y divide-white/10">
                        <div onClick={handleAlbumClick} className="flex justify-between items-center py-3 cursor-pointer hover:bg-white/5 -mx-4 px-4 rounded-md">
                            <div className="flex items-center text-gray-300"><AlbumIcon className="mr-4"/> Album</div>
                            <div className="font-semibold">Single</div>
                        </div>
                        {video.genreName && (
                             <div className="flex justify-between items-center py-3">
                                <div className="flex items-center text-gray-300"><MusicNoteIcon className="h-6 w-6 mr-4"/> Genre</div>
                                <div className="font-semibold">{video.genreName}</div>
                            </div>
                        )}
                        <div className="flex justify-between items-center py-3">
                            <div className="flex items-center text-gray-300"><CalendarIcon className="mr-4"/> Released</div>
                            <div className="font-semibold">{songDetails.releaseDate}</div>
                        </div>
                    </div>
                </div>
          </div>
      </div>
    </div>
  );
};

export default SongInfoScreen;
