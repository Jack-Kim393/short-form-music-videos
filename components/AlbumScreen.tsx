import React, { useState } from 'react';
import type { Album, ShortFormVideo } from '../types';
import { BackIcon, PlayArrowIcon, MoreVertIcon } from './icons';
import MusicPlayerScreen from './MusicPlayerScreen';
import VideoThumbnailCard from './VideoThumbnailCard';
import { generateSongDetails } from '../constants';

interface AlbumScreenProps {
    artist: { name: string; avatarUrl: string };
    album: Album;
    onGoBack: () => void;
    onSelectVideoFeed: (artist: { name: string; avatarUrl: string }) => void;
    onSelectArtist: (artist: { name: string; avatarUrl: string }) => void;
    onSelectAlbum: (album: Album) => void;
}

const AlbumScreen: React.FC<AlbumScreenProps> = ({ artist, album, onGoBack, onSelectVideoFeed, onSelectArtist, onSelectAlbum }) => {
    const [nowPlayingVideo, setNowPlayingVideo] = useState<ShortFormVideo | null>(null);

    const handleFeaturedVideoClick = () => {
        if (album.featuredVideo.user) {
            onSelectVideoFeed(album.featuredVideo.user);
        }
    };
    
    const playTrack = (trackIndex: number) => {
        const track = album.tracks[trackIndex];
        const songTitle = `${track.title} - ${artist.name}`;
        // Create a mock ShortFormVideo object for the player
        const mockVideo: ShortFormVideo = {
            id: new Date().getTime(), // Unique ID
            user: artist,
            description: `From the album: ${album.title}`,
            song: songTitle,
            imageUrl: album.imageUrl,
            videoUrl: album.featuredVideo.videoUrl,
            likes: Math.floor(Math.random() * 10000),
            comments: Math.floor(Math.random() * 1000),
            genreName: 'Album Track',
            songDetails: generateSongDetails(songTitle),
        };
        setNowPlayingVideo(mockVideo);
    };

    return (
        <>
            <div className="h-screen w-full bg-black text-white overflow-y-auto scrollbar-hide">
                <div className="relative h-64 sm:h-80">
                    <img src={album.imageUrl} alt={album.title} className="w-full h-full object-cover opacity-30" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
                    
                    <button onClick={onGoBack} className="fixed top-4 left-4 z-20 p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-75 transition-colors" aria-label="Go back">
                        <BackIcon />
                    </button>
                    <button className="fixed top-4 right-4 z-20 p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-75 transition-colors" aria-label="More options">
                        <MoreVertIcon />
                    </button>
                </div>

                <div className="relative -mt-32 sm:-mt-40 px-4 sm:px-6 pb-[calc(9rem+env(safe-area-inset-bottom))]">
                    <div className="flex items-end gap-4 mb-4">
                        <div className="w-36 h-36 sm:w-48 sm:h-48 rounded-lg shadow-2xl overflow-hidden flex-shrink-0 border-4 border-black">
                            <img src={album.imageUrl} alt={album.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                           <p className="text-sm font-bold uppercase text-gray-400 mb-1 hidden sm:block">Album</p>
                           <h1 className="text-2xl sm:text-4xl font-bold truncate">{album.title}</h1>
                           <button onClick={() => onSelectArtist(artist)} className="text-gray-300 hover:underline mt-1 text-left">
                                {artist.name} • {album.year}
                            </button>
                        </div>
                        <div className="w-20 h-36 sm:w-24 sm:h-40 flex-shrink-0">
                             <VideoThumbnailCard video={album.featuredVideo} onClick={handleFeaturedVideoClick} />
                        </div>
                    </div>

                    <div className="flex items-center gap-6 my-6">
                        <button 
                            onClick={() => setNowPlayingVideo(album.featuredVideo)}
                            className="w-16 h-16 bg-white rounded-full flex items-center justify-center transform hover:scale-105 transition-transform flex-shrink-0"
                        >
                            <PlayArrowIcon className="h-8 w-8 text-black" />
                        </button>
                         <p className="text-sm text-gray-400 hidden sm:block">
                            {album.tracks.length} songs • {Math.floor(album.tracks.length * 3.5)} min
                        </p>
                    </div>

                    <div className="space-y-2">
                        {album.tracks.map((track, index) => (
                            <div 
                                key={track.id} 
                                className="flex items-center p-2 rounded-lg hover:bg-gray-900 transition-colors cursor-pointer group"
                                onClick={() => playTrack(index)}
                            >
                                <div className="text-gray-400 w-6 text-center mr-4 relative">
                                    <span className="group-hover:opacity-0 transition-opacity">{index + 1}</span>
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <PlayArrowIcon className="h-5 w-5" />
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold truncate">{track.title}</p>
                                    <p className="text-sm text-gray-400 truncate sm:hidden">{artist.name}</p>
                                </div>
                                <div className="text-gray-400 text-sm mr-4">{track.duration}</div>
                                <button onClick={(e) => e.stopPropagation()} aria-label={`More options for ${track.title}`}>
                                    <MoreVertIcon className="h-5 w-5 text-gray-400" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {nowPlayingVideo && (
                <MusicPlayerScreen
                    video={nowPlayingVideo}
                    onClose={() => setNowPlayingVideo(null)}
                    onSelectArtist={onSelectArtist}
                    onSelectAlbum={onSelectAlbum}
                />
            )}
        </>
    );
};

export default AlbumScreen;