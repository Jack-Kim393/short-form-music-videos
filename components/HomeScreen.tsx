import React, { useState } from 'react';
import type { Genre, Album, ShortFormVideo } from '../types';
import { 
    LATEST_ALBUMS, 
    CHART, 
    SHORT_FORM_VIDEOS, 
    MOOD_PLAYLISTS,
    HOT_TREND_VIDEOS,
    DJ_PICKS,
    MAGAZINE_ARTICLES,
    GENRES
} from '../constants';
import { ChartBarIcon, PlayArrowIcon, MusicNoteIcon } from './icons';
import SectionHeader from './SectionHeader';
import AlbumCarouselCard from './AlbumCarouselCard';
import ChartEntry from './ChartEntry';
import PlaylistCard from './PlaylistCard';
import MagazineCard from './MagazineCard';
import VideoThumbnailCard from './VideoThumbnailCard';


interface HomeScreenProps {
  onSelectGenre: (genre: Genre) => void;
  onSelectArtist: (artist: { name: string; avatarUrl: string }) => void;
  onSelectAlbum: (album: Album) => void;
  onPlaySong: (song: ShortFormVideo) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onSelectGenre, onSelectArtist, onSelectAlbum, onPlaySong }) => {
  const [activeChartTab, setActiveChartTab] = useState('Weekly');
  const [activeMoodTab, setActiveMoodTab] = useState('Drive');
  const [activeMagazineTab, setActiveMagazineTab] = useState('Latest');
  
  const handleSelectVideo = (video: ShortFormVideo) => {
    const genre = GENRES.find(g => g.name === video.genreName) || GENRES[0];
    onSelectGenre(genre);
  };

  const handlePlayChart = () => {
    if (CHART.length > 0) {
      onPlaySong(CHART[0].song);
      alert(`Playing the ${activeChartTab} Chart!`);
    }
  };

  return (
    <div className="h-full overflow-y-auto scrollbar-hide pb-[calc(9rem+env(safe-area-inset-bottom))]">
      <header className="h-16 p-4 flex justify-between items-center">
        {/* Header content removed as requested. This space is kept for layout consistency. */}
      </header>
      <div className="space-y-8">
        {/* 1. Latest Albums */}
        <section>
          <SectionHeader title="Latest Music" tabs={['All', 'Domestic', 'Overseas']} />
          <div className="flex space-x-4 overflow-x-auto scrollbar-hide px-4">
            {LATEST_ALBUMS.map(album => <AlbumCarouselCard key={album.id} album={album} onClick={() => onSelectAlbum(album)} />)}
          </div>
        </section>
        
        {/* 2. Chart */}
        <section>
            <div className="px-4">
                <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                        <h2 className="text-2xl font-bold">Chart</h2>
                        <ChartBarIcon className="w-5 h-5 ml-2 text-green-400" />
                    </div>
                    <button onClick={() => alert('Viewing all chart songs!')} className="text-sm text-gray-400">View All</button>
                </div>
                <div className="flex space-x-4 border-b border-gray-800">
                    {['Weekly', 'TOP100', 'HOT100', 'Drama OST'].map(tab => (
                        <button key={tab} onClick={() => setActiveChartTab(tab)} className={`py-2 font-semibold ${activeChartTab === tab ? 'text-white border-b-2 border-green-400' : 'text-gray-500'}`}>{tab}</button>
                    ))}
                </div>
            </div>
            <div className="px-2 mt-2">
                {CHART.map(item => <ChartEntry key={item.rank} item={item} onPlay={onPlaySong} />)}
            </div>
             <div className="px-4 mt-2">
                <button onClick={handlePlayChart} className="w-full text-center py-3 bg-white/5 rounded-lg font-semibold hover:bg-white/10">Listen to {activeChartTab} Chart</button>
            </div>
        </section>

        {/* 3. Short Form Video */}
        <section>
          <SectionHeader title="Today's Short Music" />
          <div className="flex space-x-4 overflow-x-auto scrollbar-hide px-4">
            {SHORT_FORM_VIDEOS.map(video => (
              <div key={video.id} className="w-40 flex-shrink-0">
                  <VideoThumbnailCard video={video} onClick={() => handleSelectVideo(video)} />
              </div>
            ))}
          </div>
        </section>
        
        {/* 4. Mood Play */}
        <section>
            <SectionHeader title="Mood Play" />
             <div className="px-4 mb-4">
                <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
                    {['Drive', 'Lazy', 'Stress Relief', 'Workout'].map(tab => (
                        <button key={tab} onClick={() => setActiveMoodTab(tab)} className={`px-4 py-2 text-sm font-semibold rounded-full flex-shrink-0 ${activeMoodTab === tab ? 'bg-green-500 text-black' : 'bg-white/10 text-white'}`}>{tab}</button>
                    ))}
                </div>
            </div>
             <div className="grid grid-cols-2 gap-4 px-4">
                {MOOD_PLAYLISTS.slice(0, 2).map(playlist => <PlaylistCard key={playlist.id} playlist={playlist} />)}
            </div>
        </section>

        {/* 5. Hot Trend 50 */}
        <section>
            <SectionHeader title="HOT TREND 50" subtitle="Top 50 Latest Hits by Genre" />
             <div className="flex space-x-4 overflow-x-auto scrollbar-hide px-4">
                 {HOT_TREND_VIDEOS.map(video => (
                    <div key={video.id} className="w-40 flex-shrink-0">
                        <div className="aspect-square rounded-lg overflow-hidden mb-2 relative group cursor-pointer" onClick={() => onPlaySong(video)}>
                            <img src={video.imageUrl} alt={video.song} className="w-full h-full object-cover"/>
                             <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <PlayArrowIcon className="w-10 h-10 text-white/80" />
                            </div>
                        </div>
                        <p className="font-semibold truncate text-sm text-gray-100">{video.song.split(' - ')[0]}</p>
                        <p className="text-xs text-gray-400 truncate">{video.user.name}</p>
                    </div>
                ))}
            </div>
        </section>

        {/* 6. Power DJ Pick */}
        <section>
            <SectionHeader title="Power DJ Pick" />
            <div className="flex space-x-4 overflow-x-auto scrollbar-hide px-4">
                 {DJ_PICKS.map(playlist => (
                    <div key={playlist.id} className="w-40 flex-shrink-0">
                       <PlaylistCard playlist={playlist} />
                    </div>
                ))}
            </div>
        </section>

        {/* 7. Magazine */}
        <section className="pb-8">
            <SectionHeader title="Trendy Music News Magazine" />
            <div className="px-4 mb-4">
                <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
                    {['Latest', 'Popular', 'Edition M', 'Data Lab'].map(tab => (
                        <button key={tab} onClick={() => setActiveMagazineTab(tab)} className={`px-4 py-2 text-sm font-semibold rounded-full flex-shrink-0 ${activeMagazineTab === tab ? 'bg-green-500 text-black' : 'bg-white/10 text-white'}`}>{tab}</button>
                    ))}
                </div>
            </div>
             <div className="flex space-x-4 overflow-x-auto scrollbar-hide px-4">
                 {MAGAZINE_ARTICLES.map(article => <MagazineCard key={article.id} article={article} />)}
            </div>
        </section>
      </div>
    </div>
  );
};

export default HomeScreen;