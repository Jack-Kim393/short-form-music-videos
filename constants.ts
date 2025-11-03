import type { Comment, Genre, SongDetails, ShortFormVideo, Album, ChartItem, Playlist, MagazineArticle } from './types';

const SAMPLE_VIDEOS = [
    'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
];

const MOCK_NAMES = ['NMIXX', 'HUNTR/X', 'Davichi', 'WOODZ', 'Tyla', 'ROY KIM', 'Cigarettes After Sex', 'Taylor Swift'];
const MOCK_LYRICS_START = `(Verse 1)
Yeah, the city lights callin' my name
Got the whole world watchin', playin' the game
Every step I take, I'm breakin' the chain
Nothin' left to lose, everything to gain`;
const MOCK_LYRICS_FULL = `${MOCK_LYRICS_START}

(Chorus)
Oh, we're runnin' wild in the midnight hour
Feelin' the power, standin' tall like a tower
This is our moment, can't you feel the fire?
Takin' it higher, fuelin' the desire

(Verse 2)
Sunrise paintin' the sky gold and red
Forget all the worries, leave 'em for dead
Got the rhythm in my heart, the beat in my head
Livin' for right now, not what's ahead`;

export const generateSongDetails = (songTitle: string): SongDetails => {
  const randomDate = new Date(+(new Date()) - Math.floor(Math.random()*10000000000));
  return {
    lyrics: MOCK_LYRICS_FULL,
    credits: {
      composer: MOCK_NAMES[Math.floor(Math.random() * MOCK_NAMES.length)],
      lyricist: MOCK_NAMES[Math.floor(Math.random() * MOCK_NAMES.length)],
      producer: MOCK_NAMES[Math.floor(Math.random() * MOCK_NAMES.length)],
    },
    releaseDate: randomDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    duration: `3:${Math.floor(Math.random() * 50 + 10)}`
  };
};


const generateVideos = (genre: string, count: number): ShortFormVideo[] => {
  return Array.from({ length: count }, (_, i) => {
    const artistName = MOCK_NAMES[i % MOCK_NAMES.length];
    const songName = `Cool ${genre} Song #${i + 1} - ${artistName}`;
    return {
        id: i + 1 + (count * Math.random()),
        user: {
        name: artistName,
        avatarUrl: `https://picsum.photos/seed/${artistName.replace(/\s/g, '')}/48/48`,
        },
        description: `Vibing to this ${genre} track! #music #${genre.toLowerCase().replace(' ', '')}`,
        song: songName,
        imageUrl: `https://picsum.photos/seed/${genre}${i}/400/800`,
        videoUrl: SAMPLE_VIDEOS[(i + Math.floor(Math.random() * 5)) % SAMPLE_VIDEOS.length],
        likes: Math.floor(Math.random() * 1000) + 100,
        comments: Math.floor(Math.random() * 500),
        genreName: genre,
        songDetails: generateSongDetails(songName),
    };
  });
};

export const generateArtistVideos = (artistName: string, count: number): ShortFormVideo[] => {
  const cleanName = artistName.replace('@', '');
  return Array.from({ length: count }, (_, i) => {
    const songName = `Artist Song #${i + 1}`;
    return {
        id: i + 1 + (count * Math.random()),
        user: {
        name: artistName,
        avatarUrl: `https://picsum.photos/seed/${cleanName}/48/48`,
        },
        description: `Check out my new track! #${cleanName} #music`,
        song: `${songName} - ${artistName}`,
        imageUrl: `https://picsum.photos/seed/${cleanName}${i}/400/800`,
        videoUrl: SAMPLE_VIDEOS[i % SAMPLE_VIDEOS.length],
        likes: Math.floor(Math.random() * 5000) + 1000,
        comments: Math.floor(Math.random() * 1000),
        genreName: ['Pop', 'Rock', 'Hip Hop'][Math.floor(Math.random() * 3)],
        songDetails: generateSongDetails(songName),
    };
  });
};

export const generateComments = (count: number): Comment[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `comment-${i}-${Date.now()}`,
    user: {
      name: `@user${Math.floor(Math.random() * 900) + 100}`,
      avatarUrl: `https://picsum.photos/seed/commenter${i}/48/48`,
    },
    text: [
      'This is a banger! 🔥',
      'OMG I love this song!',
      'What a vibe ✨',
      'Seriously underrated.',
      'Playing this on repeat.',
      'Who is this artist?? They are amazing!',
      'This song made my day.',
    ][Math.floor(Math.random() * 7)],
    timestamp: `${Math.floor(Math.random() * 59) + 1}m ago`,
  }));
};

export const GENRES: Genre[] = [
  { id: 'foryou', name: 'For You', description: 'A mix of trending and recommended tracks.', gradient: 'from-purple-500 to-pink-500', videos: [...generateVideos('Pop', 4), ...generateVideos('Electronic', 3)], },
  { id: 'rnb', name: 'R&B', description: 'Smooth rhythms and soulful melodies.', gradient: 'from-blue-500 to-indigo-600', videos: generateVideos('R&B', 8), },
  { id: 'rock', name: 'Rock', description: 'Guitar riffs and powerful anthems.', gradient: 'from-red-500 to-yellow-500', videos: generateVideos('Rock', 8), },
  { id: 'hiphop', name: 'Hip Hop', description: 'Beats, rhymes, and lyrical flows.', gradient: 'from-green-400 to-blue-500', videos: generateVideos('Hip Hop', 8), },
  { id: 'electronic', name: 'Electronic', description: 'Synthetic sounds and dance-floor fillers.', gradient: 'from-teal-400 to-cyan-600', videos: generateVideos('Electronic', 8), },
  { id: 'pop', name: 'Pop', description: 'Catchy hooks and chart-topping hits.', gradient: 'from-pink-400 to-rose-500', videos: generateVideos('Pop', 8), },
  { id: 'jazz', name: 'Jazz', description: 'Improvisation and timeless cool.', gradient: 'from-amber-400 to-orange-600', videos: generateVideos('Jazz', 8), },
  { id: 'classical', name: 'Classical', description: 'Orchestral masterpieces and epic scores.', gradient: 'from-gray-400 to-gray-600', videos: generateVideos('Classical', 8), },
];

const allVideos = GENRES.flatMap(g => g.videos);

export const LATEST_ALBUMS: Album[] = allVideos.slice(0, 10).map((video, i) => ({
    id: `album-${i}`,
    title: video.song.split(' - ')[0],
    artistName: video.user.name,
    year: 2024,
    imageUrl: `https://picsum.photos/seed/album${i}/400/400`,
    featuredVideo: video,
    tracks: [{id: 't1', title: video.song.split(' - ')[0], duration: '3:00'}]
}));

export const CHART: ChartItem[] = [
    { rank: 1, change: { status: 'same', value: 0 }, song: { ...allVideos[0], song: 'Blue Valentine - NMIXX' } },
    { rank: 2, change: { status: 'down', value: 1 }, song: { ...allVideos[1], song: 'Golden - HUNTR/X' } },
    { rank: 3, change: { status: 'up', value: 3 }, song: { ...allVideos[2], song: 'Time Capsule - Davichi' } },
    { rank: 4, change: { status: 'down', value: 1 }, song: { ...allVideos[3], song: 'Drowning - WOODZ' } },
];

export const SHORT_FORM_VIDEOS: ShortFormVideo[] = allVideos.sort(() => .5 - Math.random()).slice(0, 8);

export const MOOD_PLAYLISTS: Playlist[] = [
    { id: 'drive', title: 'Easy Listening Pop for a Fun Drive', subtitle: '#drive', imageUrl: `https://picsum.photos/seed/drive/400/400` },
    { id: 'summer', title: 'Korean Songs for a Summer Night Drive', subtitle: '#summer #drive', imageUrl: `https://picsum.photos/seed/summer/400/400` },
    { id: 'feelgood', title: 'Feel-Good Drive Playlist', subtitle: '#drive', imageUrl: `https://picsum.photos/seed/feelgood/400/400` },
];

export const HOT_TREND_VIDEOS: ShortFormVideo[] = allVideos.sort(() => .5 - Math.random()).slice(0, 8);

export const DJ_PICKS: Playlist[] = [
    { id: 'dj1', title: 'Cozy Pop Mix for a Winter Day', imageUrl: `https://picsum.photos/seed/djpick1/400/400`, curator: { name: 'POP_BOX' } },
    { id: 'dj2', title: 'Getting Through the Long Night', imageUrl: `https://picsum.photos/seed/djpick2/400/400`, curator: { name: 'Dreamus' } },
    { id: 'dj3', title: 'Sentimental Jazz from a New York Bar', imageUrl: `https://picsum.photos/seed/djpick3/400/400`, curator: { name: 'Universal Music' } },
];

export const MAGAZINE_ARTICLES: MagazineArticle[] = [
    { id: 'mag1', title: 'A Guide for Music Lovers Who Love Key!', subtitle: 'Edition M', imageUrl: `https://picsum.photos/seed/mag1/800/400`, category: 'MAGAZINE' },
    { id: 'mag2', title: 'Names We Miss in November: Yoo Jae-ha, Kim Hyun-sik', subtitle: 'Edition M', imageUrl: `https://picsum.photos/seed/mag2/800/400`, category: 'MAGAZINE' },
    { id: 'mag3', title: 'Artist of the Month: Meet NCT 127', subtitle: 'Data Lab', imageUrl: `https://picsum.photos/seed/mag3/800/400`, category: 'MAGAZINE' },
];