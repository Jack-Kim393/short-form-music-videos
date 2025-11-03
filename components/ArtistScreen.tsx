import React, { useMemo, useState } from 'react';
import type { Album, ShortFormVideo } from '../types';
import { generateArtistVideos } from '../constants';
import { BackIcon, VerifiedIcon, PlayArrowIcon } from './icons';
import VideoThumbnailCard from './VideoThumbnailCard';
import MusicPlayerScreen from './MusicPlayerScreen';
import MusicVideoPlayer from './MusicVideoPlayer';

// Mock data generation for this artist screen
const useArtistData = (artistName: string) => {
    const artistVideos = useMemo(() => generateArtistVideos(artistName, 8), [artistName]);

    const popularTracks: ShortFormVideo[] = useMemo(() => {
        return artistVideos.slice(0, 5).map((video, i) => ({
            ...video,
            id: video.id + 100, // Make IDs unique from videos
            description: `Popular track #${i + 1}`, // Differentiate
            likes: Math.floor(Math.random() * 5000000) + 1000000, // Mock play counts
        }));
    }, [artistVideos]);

    const mockAlbums: Album[] = useMemo(() => [
        {
            id: `${artistName}-album-1`,
            title: 'Summer Vibes',
            year: 2023,
            imageUrl: `https://picsum.photos/seed/${artistName}album1/400/400`,
            featuredVideo: artistVideos[0],
            tracks: Array.from({ length: 8 }, (_, i) => ({ id: `t${i}`, title: `Track ${i + 1}`, duration: '3:00' })),
        },
        {
            id: `${artistName}-album-2`,
            title: 'Midnight Drive',
            year: 2021,
            imageUrl: `https://picsum.photos/seed/${artistName}album2/400/400`,
            featuredVideo: artistVideos[1],
            tracks: Array.from({ length: 10 }, (_, i) => ({ id: `t${i}`, title: `Song ${i + 1}`, duration: '2:45' })),
        }
    ], [artistName, artistVideos]);
    
    const relatedArtists = useMemo(() => Array.from({ length: 5 }, (_, i) => {
        const cleanName = artistName.replace(/[^a-zA-Z0-9]/g, '');
        return {
            name: `@${cleanName}_related${i + 1}`,
            avatarUrl: `https://picsum.photos/seed/${cleanName}related${i}/96/96`,
        };
    }), [artistName]);

    return { artistVideos, popularTracks, mockAlbums, relatedArtists };
};

const AlbumCard: React.FC<{ album: Album; onClick: () => void }> = ({ album, onClick }) => (
    <div onClick={onClick} className="cursor-pointer group">
        <div className="aspect-square rounded-lg overflow-hidden mb-2 transform transition-transform duration-300 group-hover:scale-105">
            <img src={album.imageUrl} alt={album.title} className="w-full h-full object-cover" />
        </div>
        <p className="font-semibold truncate text-sm">{album.title}</p>
        <p className="text-xs text-gray-400">{album.year}</p>
    </div>
);

const ArtistAvatar: React.FC<{ artist: { name: string; avatarUrl: string }; onClick: () => void; }> = ({ artist, onClick }) => (
    <div onClick={onClick} className="flex flex-col items-center cursor-pointer group w-24 flex-shrink-0">
        <img src={artist.avatarUrl} alt={artist.name} className="w-24 h-24 rounded-full mb-2 object-cover transform transition-transform duration-300 group-hover:scale-110" />
        <p className="text-sm font-semibold text-center truncate w-full">{artist.name}</p>
    </div>
);

const MusicVideoCard: React.FC<{ video: ShortFormVideo; onClick: () => void; }> = ({ video, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="relative rounded-lg overflow-hidden cursor-pointer group aspect-[16/9] bg-gray-800 transform transition-transform duration-300 hover:scale-105"
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

interface ArtistScreenProps {
    artist: { name: string; avatarUrl: string };
    onGoBack: () => void;
    onSelectVideoFeed: (artist: { name: string; avatarUrl: string }) => void;
    onSelectAlbum: (album: Album) => void;
    onSelectArtist: (artist: { name:string; avatarUrl: string; }) => void;
}

const ArtistScreen: React.FC<ArtistScreenProps> = ({ artist, onGoBack, onSelectVideoFeed, onSelectAlbum, onSelectArtist }) => {
    const { artistVideos, popularTracks, mockAlbums, relatedArtists } = useArtistData(artist.name);
    const [nowPlayingVideo, setNowPlayingVideo] = useState<ShortFormVideo | null>(null);
    const [nowPlayingMusicVideo, setNowPlayingMusicVideo] = useState<ShortFormVideo | null>(null);

    return (
        <>
            <div className="h-screen w-full bg-black text-white overflow-y-auto scrollbar-hide">
                <div className="relative h-48 sm:h-64">
                    <img src={artist.avatarUrl.replace('/48/48', '/400/400')} alt={`${artist.name} banner`} className="w-full h-full object-cover opacity-30" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
                    <button onClick={onGoBack} className="fixed top-4 left-4 z-20 p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-75 transition-colors" aria-label="Go back">
                        <BackIcon />
                    </button>
                </div>

                <div className="relative -mt-24 px-4 sm:px-6 pb-[calc(9rem+env(safe-area-inset-bottom))]">
                     <div className="flex items-end gap-4 mb-4">
                        <img src={artist.avatarUrl} alt={artist.name} className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-black object-cover flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                           <div className="flex items-center gap-2">
                                <h1 className="text-2xl sm:text-4xl font-bold truncate">{artist.name}</h1>
                                <VerifiedIcon />
                            </div>
                            <p className="text-sm text-gray-400">{(Math.floor(Math.random() * 10) + 1).toLocaleString()}M monthly listeners</p>
                        </div>
                        <div className="w-20 h-36 sm:w-24 sm:h-40 flex-shrink-0">
                             <VideoThumbnailCard video={artistVideos[0]} onClick={() => onSelectVideoFeed(artist)} />
                        </div>
                    </div>

                    <div className="flex gap-2 mb-8">
                        <button className="bg-white text-black font-semibold px-4 py-2 rounded-full text-sm">Follow</button>
                        <button onClick={() => setNowPlayingVideo(popularTracks[0])} className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center transform hover:scale-105 transition-transform">
                            <PlayArrowIcon className="h-6 w-6 text-white" />
                        </button>
                    </div>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold mb-4">Popular</h2>
                        <div className="space-y-2">
                            {popularTracks.map((track, index) => (
                                <div 
                                    key={track.id} 
                                    className="flex items-center p-2 rounded-lg hover:bg-gray-900 transition-colors cursor-pointer group"
                                    onClick={() => setNowPlayingVideo(track)}
                                >
                                    <div className="text-gray-400 w-6 text-center mr-4 relative">
                                        <span className="group-hover:opacity-0 transition-opacity">{index + 1}</span>
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <PlayArrowIcon className="h-5 w-5" />
                                        </div>
                                    </div>
                                    <img src={track.imageUrl.replace('/400/800', '/96/96')} alt={track.song} className="w-10 h-10 rounded-md object-cover mr-4" />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold truncate">{track.song.split(' - ')[0]}</p>
                                    </div>
                                    <div className="text-gray-400 text-sm hidden sm:block">{track.likes.toLocaleString()}</div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold mb-4">Albums</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {mockAlbums.map(album => (
                                <AlbumCard key={album.id} album={album} onClick={() => onSelectAlbum(album)} />
                            ))}
                        </div>
                    </section>
                    
                    <section className="mb-8">
                        <h2 className="text-xl font-bold mb-4">Music Videos</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {artistVideos.slice(0, 4).map(video => (
                                <MusicVideoCard key={video.id} video={video} onClick={() => setNowPlayingMusicVideo(video)} />
                            ))}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-4">Fans Also Like</h2>
                        <div className="flex space-x-4 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-4">
                            {relatedArtists.map(relatedArtist => (
                            <ArtistAvatar key={relatedArtist.name} artist={relatedArtist} onClick={() => onSelectArtist(relatedArtist)} />
                            ))}
                        </div>
                    </section>
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
            {nowPlayingMusicVideo && (
                <MusicVideoPlayer
                    video={nowPlayingMusicVideo}
                    onClose={() => setNowPlayingMusicVideo(null)}
                />
            )}
        </>
    );
};

export default ArtistScreen;