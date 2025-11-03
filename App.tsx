import React, { useState } from 'react';
import type { Genre, Album, ShortFormVideo } from './types';
import { GENRES, generateArtistVideos } from './constants';
import FeedView from './components/FeedView';
import ArtistScreen from './components/ArtistScreen';
import AlbumScreen from './components/AlbumScreen';
import HomeScreen from './components/HomeScreen';
import BottomNavBar from './components/BottomNavBar';
import MusicPlayerBar from './components/MusicPlayerBar';

const App: React.FC = () => {
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const [selectedArtist, setSelectedArtist] = useState<{ name: string; avatarUrl: string } | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [artistForFeed, setArtistForFeed] = useState<{ name: string; avatarUrl: string } | null>(null);
  const [nowPlaying, setNowPlaying] = useState<ShortFormVideo | null>(null);

  const handleSelectGenre = (genre: Genre) => {
    setSelectedGenre(genre);
    setSelectedArtist(null);
    setArtistForFeed(null);
    setSelectedAlbum(null);
  };
  
  const handleSelectArtist = (artist: { name: string; avatarUrl: string }) => {
    setSelectedArtist(artist);
    setArtistForFeed(null); 
    setSelectedAlbum(null);
    setSelectedGenre(null);
  };

  const handleSelectAlbum = (album: Album) => {
    const artistFromAlbum = GENRES.flatMap(g => g.videos)
                                .concat(artistForFeed ? generateArtistVideos(artistForFeed.name, 8) : [])
                                .find(v => v.id === album.featuredVideo.id)?.user;
    if (artistFromAlbum && !selectedArtist) {
        setSelectedArtist(artistFromAlbum);
    }
    setSelectedAlbum(album);
  };

  const handleSelectArtistVideoFeed = (artist: { name: string; avatarUrl: string }) => {
      setArtistForFeed(artist);
      setSelectedArtist(null); 
      setSelectedAlbum(null);
      setSelectedGenre(null);
  };
  
  const handlePlaySong = (song: ShortFormVideo) => {
    setNowPlaying(song);
  };

  const handleGoBack = () => {
    if (selectedAlbum) {
        setSelectedAlbum(null); // From album to artist
    } else if (selectedArtist) {
        setSelectedArtist(null); // From artist to home/feed
        // Decide where to go back to. If they came from a feed, we might want to go back there.
        // For simplicity now, we go back to home by clearing everything.
        setSelectedGenre(null);
        setArtistForFeed(null);
    } else if (artistForFeed) {
        setArtistForFeed(null); // From artist feed to home
    } else if (selectedGenre) {
        setSelectedGenre(null); // From genre feed to home
    }
  };


  return (
    <div className="bg-[#121212] text-white h-full font-sans antialiased relative overflow-hidden">
      {/* Screens Container */}
      <div className="relative h-full w-full">

        {/* Home Screen */}
        <div className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
            (selectedGenre || artistForFeed || selectedArtist || selectedAlbum) ? '-translate-x-full' : 'translate-x-0'
          }`}>
          <HomeScreen 
            onSelectGenre={handleSelectGenre} 
            onSelectArtist={handleSelectArtist}
            onSelectAlbum={handleSelectAlbum}
            onPlaySong={handlePlaySong}
          />
        </div>

        {/* Feed View Container */}
        <div className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
            !(selectedGenre || artistForFeed) || selectedArtist || selectedAlbum ? 'translate-x-full' : 'translate-x-0'
          }`}>
          {(selectedGenre || artistForFeed) && (
            <FeedView 
              key={artistForFeed?.name || selectedGenre?.id}
              genre={selectedGenre || undefined}
              artist={artistForFeed || undefined}
              onGoBack={handleGoBack} 
              onSelectGenre={handleSelectGenre} 
              onSelectArtist={handleSelectArtist} 
              // FIX: The 'onSelectAlbum' variable was not defined. Using 'handleSelectAlbum' handler instead.
              onSelectAlbum={handleSelectAlbum}
            />
          )}
        </div>
        
        {/* Artist Screen Container */}
        <div className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
            !selectedArtist || selectedAlbum ? 'translate-x-full' : 'translate-x-0'
          }`}>
            {selectedArtist && <ArtistScreen 
              artist={selectedArtist} 
              onGoBack={handleGoBack} 
              onSelectVideoFeed={handleSelectArtistVideoFeed} 
              onSelectAlbum={handleSelectAlbum} 
              onSelectArtist={handleSelectArtist}
            />}
        </div>

        {/* Album Screen Container */}
        <div className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
            !selectedAlbum ? 'translate-x-full' : 'translate-x-0'
          }`}>
            {selectedAlbum && selectedArtist && (
              <AlbumScreen 
                  artist={selectedArtist}
                  // FIX: The 'album' variable was not defined. Using the 'selectedAlbum' state variable instead.
                  album={selectedAlbum} 
                  onGoBack={handleGoBack}
                  onSelectVideoFeed={handleSelectArtistVideoFeed}
                  onSelectArtist={handleSelectArtist}
                  // FIX: The 'onSelectAlbum' variable was not defined. Using 'handleSelectAlbum' handler instead.
                  onSelectAlbum={handleSelectAlbum}
              />
            )}
        </div>
      </div>

      {/* Player and Nav Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-30">
        {nowPlaying && <MusicPlayerBar song={nowPlaying} onPlay={() => {
            const mockAlbum = {
                id: `album-${nowPlaying.id}`,
                title: 'Single',
                year: new Date().getFullYear(),
                imageUrl: nowPlaying.imageUrl,
                featuredVideo: nowPlaying,
                tracks: [],
                artistName: nowPlaying.user.name
            };
            handleSelectAlbum(mockAlbum);
        }} />}
        <BottomNavBar />
      </div>
    </div>
  );
};

export default App;
