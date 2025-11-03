import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { ShortFormVideo as ShortFormVideoType, Genre, Album } from '../types';
import GenreHeader from './GenreHeader';
import MusicPlayerScreen from './MusicPlayerScreen';
import CommentsSheet from './CommentsSheet';
import MoreOptionsSheet from './MoreOptionsSheet';
import SongInfoScreen from './SongInfoScreen';
import { PlayIcon, MusicNoteIcon, LikeIcon, CommentIcon, ShareIcon, MoreIcon } from './icons';

// Helper component: Toast
const Toast: React.FC<{ message: string }> = ({ message }) => (
  <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-full text-sm z-50 animate-fade-in-out">
    {message}
  </div>
);

// Helper component: SeekableProgressBar
const SeekableProgressBar: React.FC<{
  progress: number;
  onSeek: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSeekStart: () => void;
  onSeekEnd: () => void;
}> = ({ progress, onSeek, onSeekStart, onSeekEnd }) => (
    <div className="relative w-full h-1 bg-white/30 rounded-full cursor-pointer group">
        <style>{`
            input[type=range].seek-slider {
              -webkit-appearance: none;
              appearance: none;
              background: transparent;
              cursor: pointer;
              width: 100%;
            }

            input[type=range].seek-slider::-webkit-slider-thumb {
              -webkit-appearance: none;
              appearance: none;
              height: 12px;
              width: 12px;
              background-color: #fff;
              border-radius: 50%;
              border: none;
              transition: background-color 0.2s ease-in-out;
              margin-top: -5px; /* (thumb height - track height) / 2 */
            }

            input[type=range].seek-slider::-moz-range-thumb {
              height: 12px;
              width: 12px;
              background-color: #fff;
              border-radius: 50%;
              border: none;
              transition: background-color 0.2s ease-in-out;
            }
        `}</style>
        <div className="absolute h-full bg-white rounded-full" style={{ width: `${progress}%` }}></div>
        <input
            type="range"
            min="0"
            max="100"
            step="0.1"
            value={progress}
            onChange={onSeek}
            onMouseDown={onSeekStart}
            onTouchStart={onSeekStart}
            onMouseUp={onSeekEnd}
            onTouchEnd={onSeekEnd}
            className="seek-slider absolute w-full h-full top-0 left-0"
        />
    </div>
);


interface ShortFormVideoProps {
  video: ShortFormVideoType;
  onSelectArtist: (artist: { name: string; avatarUrl: string }) => void;
  onSelectAlbum: (album: Album) => void;
  genres?: Genre[];
  activeGenreId?: string;
  onSelectGenre?: (genreId: string) => void;
}

const ShortFormVideo: React.FC<ShortFormVideoProps> = ({ video, onSelectArtist, onSelectAlbum, genres, activeGenreId, onSelectGenre }) => {
    const videoElRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(video.likes);
    const [isSeeking, setIsSeeking] = useState(false);
    
    const [showMusicPlayer, setShowMusicPlayer] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [showMoreOptions, setShowMoreOptions] = useState(false);
    const [showSongInfo, setShowSongInfo] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const togglePlay = () => {
        if (!videoElRef.current) return;
        if (videoElRef.current.paused) {
            videoElRef.current.play().catch(e => console.error("Play failed", e));
        } else {
            videoElRef.current.pause();
        }
    };
    
    const showToast = useCallback((message: string) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(null), 3000);
    }, []);

    const handleLike = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsLiked(prev => !prev);
        setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    };

    const handleComment = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowComments(true);
    };

    const handleShare = (e: React.MouseEvent) => {
        e.stopPropagation();
        showToast('Link copied to clipboard!');
    };
    
    const handleMore = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowMoreOptions(true);
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!videoElRef.current) return;
        const newProgress = Number(e.target.value);
        setProgress(newProgress);
        if (videoElRef.current.duration) {
            videoElRef.current.currentTime = (newProgress / 100) * videoElRef.current.duration;
        }
    };

    const handleSeekStart = () => setIsSeeking(true);
    const handleSeekEnd = () => setIsSeeking(false);

    useEffect(() => {
        const videoEl = videoElRef.current;
        if (!videoEl) return;

        const onTimeUpdate = () => {
            if (isSeeking || !videoEl.duration || Number.isNaN(videoEl.duration)) return;
            setProgress((videoEl.currentTime / videoEl.duration) * 100);
        };
        const onPlay = () => setIsPlaying(true);
        const onPause = () => setIsPlaying(false);

        videoEl.addEventListener('timeupdate', onTimeUpdate);
        videoEl.addEventListener('play', onPlay);
        videoEl.addEventListener('pause', onPause);

        return () => {
            videoEl.removeEventListener('timeupdate', onTimeUpdate);
            videoEl.removeEventListener('play', onPlay);
            videoEl.removeEventListener('pause', onPause);
        };
    }, [isSeeking]);
    
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    videoElRef.current?.play().catch(e => {
                        setIsPlaying(false);
                    });
                } else {
                    videoElRef.current?.pause();
                }
            },
            { threshold: 0.5 }
        );

        const currentContainer = containerRef.current;
        if (currentContainer) observer.observe(currentContainer);
        return () => {
            if (currentContainer) observer.unobserve(currentContainer);
        };
    }, []);

    const formatCount = (num: number): string => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toString();
    };

    return (
<div ref={containerRef} className="h-screen w-full snap-center relative flex items-center justify-center bg-black">
      <div
        className="relative h-full w-auto aspect-[9/16] max-w-full mx-auto overflow-hidden shadow-2xl bg-black"
        onClick={togglePlay}
      >
        <video
          ref={videoElRef}
          src={video.videoUrl}
          poster={video.imageUrl}
          className="absolute inset-0 w-full h-full object-cover"
          loop
          playsInline
          muted
          preload="auto"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/60"></div>
        
        {genres && activeGenreId && onSelectGenre && (
            <div className="absolute top-0 left-0 right-0 pt-16 z-20">
                <GenreHeader
                    genres={genres}
                    activeGenreId={activeGenreId}
                    onSelectGenre={onSelectGenre}
                />
            </div>
        )}
        
        {!isPlaying && (
          <div 
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            aria-hidden="true"
          >
            <PlayIcon className="w-20 h-20 text-green-400 drop-shadow-lg" />
          </div>
        )}

        {/* UI Overlay Container: p-4 provides safe area padding */}
        <div
          className="absolute bottom-0 left-0 right-0 px-4 pt-4 pb-4 z-10 text-white"
        >
          <div className="flex items-end justify-between gap-4">
            {/* Left Column (User Info) */}
            <div className="flex-1 min-w-0">
              <button 
                className="flex items-center mb-2 text-left hover:opacity-80 transition-opacity"
                onClick={(e) => {
                    e.stopPropagation();
                    onSelectArtist(video.user);
                }}
              >
                <img src={video.user.avatarUrl} alt={video.user.name} className="w-10 h-10 rounded-full border-2 border-white flex-shrink-0" />
                <p className="ml-3 font-bold drop-shadow-md truncate">{video.user.name}</p>
              </button>
              <p className="mb-2 text-sm drop-shadow-md">{video.description}</p>
              <button
                onClick={(e) => {
                    e.stopPropagation();
                    setShowMusicPlayer(true);
                }}
                className="mt-2 inline-flex items-center rounded-full bg-black/30 backdrop-blur-md border border-white/20 px-4 py-2 hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 max-w-full"
                aria-label={`Play full song: ${video.song}`}
              >
                <MusicNoteIcon />
                <p className="ml-2 text-sm truncate">{video.song}</p>
              </button>
            </div>

            {/* Right Column (Action Buttons) */}
            <div className="flex flex-col items-center space-y-4">
               <button onClick={handleLike} className="flex flex-col items-center text-center" aria-label="Like this video">
                  <LikeIcon filled={isLiked} className={`h-8 w-8 drop-shadow-lg transition-colors ${isLiked ? 'text-red-500' : 'text-white'}`} />
                  <span className="text-xs font-semibold mt-1 drop-shadow-md">{formatCount(likeCount)}</span>
              </button>
              <button onClick={handleComment} className="flex flex-col items-center text-center" aria-label="View comments">
                  <CommentIcon />
                  <span className="text-xs font-semibold mt-1 drop-shadow-md">{formatCount(video.comments)}</span>
              </button>
               <button onClick={handleShare} className="flex flex-col items-center text-center" aria-label="Share this video">
                  <ShareIcon />
              </button>
              <button onClick={handleMore} className="flex flex-col items-center text-center mt-2" aria-label="More options">
                  <MoreIcon />
              </button>
            </div>
          </div>
          
          {/* Seekable Progress Bar is now inside the padded container */}
          <div className="mt-2" onClick={(e) => e.stopPropagation()}>
            <SeekableProgressBar
              progress={progress}
              onSeek={handleSeek}
              onSeekStart={handleSeekStart}
              onSeekEnd={handleSeekEnd}
            />
          </div>
        </div>

        {showMusicPlayer && <MusicPlayerScreen video={video} onClose={() => setShowMusicPlayer(false)} onSelectArtist={onSelectArtist} onSelectAlbum={onSelectAlbum} />}
        {showComments && <CommentsSheet video={video} onClose={() => setShowComments(false)} />}
        {showMoreOptions && <MoreOptionsSheet video={video} onClose={() => setShowMoreOptions(false)} onSelectAlbum={onSelectAlbum} onShowSongInfo={() => setShowSongInfo(true)} showToast={showToast} />}
        {showSongInfo && <SongInfoScreen video={video} onClose={() => setShowSongInfo(false)} onSelectArtist={onSelectArtist} onSelectAlbum={onSelectAlbum} />}
        {toastMessage && <Toast message={toastMessage} />}
      </div>
    </div>
    );
};

export default ShortFormVideo;