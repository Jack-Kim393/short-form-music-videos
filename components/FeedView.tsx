import React, { useState, useEffect, useRef, useMemo } from 'react';
import type { Genre, Album } from '../types';
import { GENRES, generateArtistVideos } from '../constants';
import ShortFormVideo from './ShortFormVideo';
import ScrollIndicator from './ScrollIndicator';
import RecommendedFeed from './RecommendedFeed';
import { BackIcon } from './icons';

interface FeedViewProps {
  genre?: Genre;
  artist?: { name: string; avatarUrl: string };
  onGoBack: () => void;
  onSelectGenre: (genre: Genre) => void;
  onSelectArtist: (artist: { name: string; avatarUrl: string }) => void;
  onSelectAlbum: (album: Album) => void;
}

const FeedView: React.FC<FeedViewProps> = ({ genre, artist, onGoBack, onSelectGenre, onSelectArtist, onSelectAlbum }) => {
  // --- Artist-Specific Feed Logic ---
  if (artist) {
    const [showScrollIndicator, setShowScrollIndicator] = useState(true);
    const feedRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      feedRef.current?.scrollTo(0, 0);
      setShowScrollIndicator(true);
      const handleScroll = () => {
        if (feedRef.current && feedRef.current.scrollTop > 50) setShowScrollIndicator(false);
      };
      const currentRef = feedRef.current;
      currentRef?.addEventListener('scroll', handleScroll, { passive: true });
      const timer = setTimeout(() => setShowScrollIndicator(false), 5000);
      return () => {
        currentRef?.removeEventListener('scroll', handleScroll);
        clearTimeout(timer);
      };
    }, [artist]);
    
    const feedVideos = useMemo(() => generateArtistVideos(artist.name, 8), [artist]);
    const recommendedVideos = useMemo(() => {
        const allOtherVideos = GENRES.flatMap(g => g.videos);
        return allOtherVideos.sort(() => 0.5 - Math.random()).slice(0, 4);
    }, []);

    return (
      <div ref={feedRef} className="h-full w-full overflow-y-auto snap-y snap-mandatory relative bg-black scrollbar-hide pb-[calc(9rem+env(safe-area-inset-bottom))]">
        <button onClick={onGoBack} className="fixed top-4 left-4 z-20 p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-75 transition-colors" aria-label={`Go back from ${artist.name} feed`}>
          <BackIcon />
        </button>
        {feedVideos.map(video => <ShortFormVideo key={video.id} video={video} onSelectArtist={onSelectArtist} onSelectAlbum={onSelectAlbum} />)}
        <RecommendedFeed videos={recommendedVideos} onSelectGenre={onSelectGenre} />
        {showScrollIndicator && <ScrollIndicator />}
      </div>
    );
  }

  // --- Genre Feeds with Header and Horizontal Swiping ---
  if (genre) {
    const horizontalScrollerRef = useRef<HTMLDivElement>(null);
    const [activeGenreId, setActiveGenreId] = useState<string>(genre.id);
    const swipeState = useRef({
        isPointerDown: false,
        startX: 0,
        startY: 0,
        scrollLeft: 0,
        isScrolling: false, // Prevents interfering with native scroll
        isLockedHorizontal: false, // True when we've determined it's a horizontal swipe
    });

    const orderedGenres = useMemo(() => {
      const otherGenres = GENRES.filter(g => g.id !== genre.id);
      return [genre, ...otherGenres];
    }, [genre]);

    const handleSelectGenreInHeader = (genreId: string) => {
        const index = orderedGenres.findIndex(g => g.id === genreId);
        if (index !== -1 && horizontalScrollerRef.current) {
            horizontalScrollerRef.current.scrollTo({
                left: index * window.innerWidth,
                behavior: 'smooth',
            });
        }
    };
    
    useEffect(() => {
        const scroller = horizontalScrollerRef.current;
        if (!scroller) return;

        let timeoutId: number | null = null;
        const handleScroll = () => {
            if (swipeState.current.isPointerDown) return; // Don't update during manual drag
            if (timeoutId === null) {
                timeoutId = window.setTimeout(() => {
                    const scrollLeft = scroller.scrollLeft;
                    const screenWidth = window.innerWidth;
                    const currentIndex = Math.round(scrollLeft / screenWidth);
                    const currentGenre = orderedGenres[currentIndex];
                    if (currentGenre && currentGenre.id !== activeGenreId) {
                        setActiveGenreId(currentGenre.id);
                    }
                    timeoutId = null;
                }, 150);
            }
        };

        scroller.addEventListener('scroll', handleScroll);
        return () => scroller.removeEventListener('scroll', handleScroll);
    }, [orderedGenres, activeGenreId]);


    const firstFeedRef = useRef<HTMLDivElement>(null);
    const [showInitialScrollIndicator, setShowInitialScrollIndicator] = useState(true);

    useEffect(() => {
      const handleScroll = () => {
        if (firstFeedRef.current && firstFeedRef.current.scrollTop > 50) setShowInitialScrollIndicator(false);
      };
      const currentRef = firstFeedRef.current;
      currentRef?.addEventListener('scroll', handleScroll, { passive: true });
      const timer = setTimeout(() => setShowInitialScrollIndicator(false), 5000);
      return () => {
        currentRef?.removeEventListener('scroll', handleScroll);
        clearTimeout(timer);
      };
    }, []);

    const onPointerDown = (e: React.PointerEvent) => {
        if (!horizontalScrollerRef.current) return;
        swipeState.current = {
            isPointerDown: true,
            startX: e.pageX,
            startY: e.pageY,
            scrollLeft: horizontalScrollerRef.current.scrollLeft,
            isScrolling: true,
            isLockedHorizontal: false,
        };
        // Remove smooth scrolling during drag
        horizontalScrollerRef.current.style.scrollBehavior = 'auto';
    };

    const onPointerMove = (e: React.PointerEvent) => {
        if (!swipeState.current.isPointerDown || !horizontalScrollerRef.current) return;
        
        const { startX, startY, isLockedHorizontal } = swipeState.current;
        const currentX = e.pageX;
        const currentY = e.pageY;
        
        if (!isLockedHorizontal) {
            const deltaX = Math.abs(currentX - startX);
            const deltaY = Math.abs(currentY - startY);
            if (deltaX > 10 || deltaY > 10) {
                if (deltaX > deltaY) {
                    swipeState.current.isLockedHorizontal = true;
                } else {
                    swipeState.current.isPointerDown = false; // It's a vertical scroll, release control
                    return;
                }
            }
        }
        
        if (swipeState.current.isLockedHorizontal) {
            e.preventDefault();
            const walk = currentX - startX;
            horizontalScrollerRef.current.scrollLeft = swipeState.current.scrollLeft - walk;
        }
    };

    const onPointerUp = () => {
        if (!horizontalScrollerRef.current) return;
        horizontalScrollerRef.current.style.scrollBehavior = 'smooth';
        
        if (!swipeState.current.isPointerDown) return;
        
        const wasLockedHorizontal = swipeState.current.isLockedHorizontal;
        swipeState.current.isPointerDown = false;
        
        if (wasLockedHorizontal) {
            const scroller = horizontalScrollerRef.current;
            const screenWidth = window.innerWidth;
            const targetIndex = Math.round(scroller.scrollLeft / screenWidth);
            
            scroller.scrollTo({
                left: targetIndex * screenWidth,
                behavior: 'smooth',
            });
        }
    };

    return (
      <div className="h-full w-full relative bg-black flex flex-col">
         <button onClick={onGoBack} className="fixed top-4 left-4 z-30 p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-75 transition-colors" aria-label="Go back to genres">
            <BackIcon />
        </button>

        <div
            ref={horizontalScrollerRef}
            className="flex-1 w-full flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp} // End drag if mouse leaves container
        >
          {orderedGenres.map((currentGenre, index) => {
            const recommendedVideos = useMemo(() => {
              const currentVideoIds = new Set(currentGenre.videos.map(v => v.id));
              const allOtherVideos = GENRES.filter(g => g.id !== currentGenre.id)
                .flatMap(g => g.videos)
                .filter(v => !currentVideoIds.has(v.id));
              return allOtherVideos.sort(() => 0.5 - Math.random()).slice(0, 4);
            }, [currentGenre]);

            return (
              <div key={currentGenre.id} ref={index === 0 ? firstFeedRef : null} className="h-full w-screen flex-shrink-0 overflow-y-auto snap-y snap-mandatory relative bg-black overscroll-y-contain scrollbar-hide pb-[calc(9rem+env(safe-area-inset-bottom))]">
                {currentGenre.videos.map(video => (
                  <ShortFormVideo
                    key={video.id}
                    video={{...video, genreName: currentGenre.name}}
                    onSelectArtist={onSelectArtist}
                    onSelectAlbum={onSelectAlbum}
                    genres={orderedGenres}
                    activeGenreId={activeGenreId}
                    onSelectGenre={handleSelectGenreInHeader}
                  />
                ))}
                <RecommendedFeed videos={recommendedVideos} onSelectGenre={onSelectGenre} />
                {index === 0 && showInitialScrollIndicator && <ScrollIndicator />}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
};

export default FeedView;
