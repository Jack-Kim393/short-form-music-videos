export interface SongCredits {
  composer: string;
  lyricist: string;
  producer: string;
}

export interface SongDetails {
  lyrics: string;
  credits: SongCredits;
  releaseDate: string;
  duration: string;
}

export interface ShortFormVideo {
  id: number;
  user: {
    name: string;
    avatarUrl: string;
  };
  description: string;
  song: string;
  imageUrl: string;
  videoUrl: string;
  likes: number;
  comments: number;
  genreName?: string;
  songDetails: SongDetails;
}

export interface Genre {
  id: string;
  name: string;
  description: string;
  gradient: string;
  videos: ShortFormVideo[];
}

export interface Track {
  id: string;
  title: string;
  duration: string;
}

export interface Album {
  id: string;
  title: string;
  year: number;
  imageUrl: string;
  artistName?: string;
  featuredVideo: ShortFormVideo;
  tracks: Track[];
}

export interface Comment {
  id: string;
  user: {
    name: string;
    avatarUrl: string;
  };
  text: string;
  timestamp: string;
}

export interface ChartItem {
  rank: number;
  change: {
    status: 'up' | 'down' | 'new' | 'same';
    value: number;
  };
  song: ShortFormVideo;
}

export interface Playlist {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  tags?: string[];
  curator?: {
    name: string;
    logoUrl?: string;
  };
}

export interface MagazineArticle {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  category: string;
}