export interface PlaylistDetails {
  name: string;
  owner: string;
  total_tracks: number;
  album_art: string | null;
}

export interface Recommendation {
  name: string;
  artist: string;
  album: string;
  release_date: string;
  popularity: number;
  duration_ms: number;
  duration_readable: string;
  preview_url: string | null;
  external_url: string;
  uri: string;
  album_art: string | null;
  id: string;
}

export interface RecommendationMetadata {
  total_tracks_analyzed: number;
  reddit_posts_found: number;
  recommendations_requested: number;
  recommendations_found: number;
}

export interface ApiResponse {
  success: boolean;
  playlist_details?: PlaylistDetails;
  recommendations?: Recommendation[];
  metadata?: RecommendationMetadata;
  error?: string | null;
}
