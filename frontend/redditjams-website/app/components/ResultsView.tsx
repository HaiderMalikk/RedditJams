import Image from "next/image";
import { ApiResponse } from "../types/api";

interface ResultsViewProps {
  data: ApiResponse;
  onReset: () => void;
}

export default function ResultsView({ data, onReset }: ResultsViewProps) {
  const { playlist_details, recommendations, metadata } = data;

  if (!playlist_details || !recommendations) {
    return null;
  }

  // Format date from YYYY-MM-DD to Month Year
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="mx-auto max-w-6xl">
      {/* Try Another Playlist Button */}
      <div className="mb-8 text-center">
        <button
          onClick={onReset}
          className="bg-primary rounded-lg px-8 py-3 font-semibold text-white transition-colors hover:bg-[#E63D00]"
        >
          Try Another Playlist
        </button>
      </div>

      {/* User's Playlist Details */}
      <div className="mb-12 overflow-hidden rounded-lg border-2 border-black bg-white shadow-lg">
        <div className="flex flex-col gap-6 p-8 md:flex-row md:items-center">
          {playlist_details.album_art && (
            <div className="flex-shrink-0">
              <Image
                src={playlist_details.album_art}
                alt={playlist_details.name}
                width={200}
                height={200}
                className="h-[200px] w-[200px] rounded-lg border-2 border-black object-cover shadow-md"
              />
            </div>
          )}
          <div className="flex-1">
            <h2 className="text-primary mb-2 text-3xl font-bold">
              {playlist_details.name}
            </h2>
            <p className="mb-2 text-lg text-gray-700">
              by <span className="font-semibold">{playlist_details.owner}</span>
            </p>
            <p className="text-md text-gray-600">
              {playlist_details.total_tracks} tracks analyzed
            </p>
            {metadata && (
              <p className="text-md mt-2 text-gray-600">
                Based on {metadata.reddit_posts_found} Reddit recommendations
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Recommendations Header */}
      <div className="mb-8 text-center">
        <h2 className="mb-2 text-4xl font-bold text-black">
          Your Personalized Recommendations
        </h2>
        <p className="text-gray-600">
          Ranked from most to least recommended based on your taste
        </p>
      </div>

      {/* Recommendations Cards */}
      <div className="space-y-6">
        {recommendations.map((track, index) => (
          <div
            key={track.id}
            className="group overflow-hidden rounded-lg border-2 border-black bg-white shadow-lg transition-all hover:shadow-xl"
          >
            <div className="flex flex-col gap-6 p-6 md:flex-row">
              {/* Rank Badge */}
              <div className="flex-shrink-0">
                <div className="bg-primary flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold text-white shadow-md">
                  #{index + 1}
                </div>
              </div>

              {/* Album Art */}
              {track.album_art && (
                <div className="flex-shrink-0">
                  <Image
                    src={track.album_art}
                    alt={track.album}
                    width={160}
                    height={160}
                    className="h-[160px] w-[160px] rounded-lg border border-gray-300 object-cover shadow-sm transition-transform group-hover:scale-105"
                  />
                </div>
              )}

              {/* Track Details */}
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <h3 className="mb-2 text-2xl font-bold text-black">
                    {track.name}
                  </h3>
                  <p className="mb-1 text-lg text-gray-700">{track.artist}</p>
                  <p className="text-md mb-2 text-gray-600">{track.album}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <span>{formatDate(track.release_date)}</span>
                    <span>•</span>
                    <span>{track.duration_readable}</span>
                    <span>•</span>
                    <span>Popularity: {track.popularity}/100</span>
                  </div>
                </div>

                {/* Listen on Spotify Button */}
                <div className="mt-4">
                  <a
                    href={track.external_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-primary inline-block rounded-lg px-6 py-2 font-semibold text-white transition-colors hover:bg-[#E63D00]"
                  >
                    Listen on Spotify
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Try Another Playlist Button (Bottom) */}
      <div className="mt-12 text-center">
        <button
          onClick={onReset}
          className="bg-primary rounded-lg px-8 py-3 font-semibold text-white transition-colors hover:bg-[#E63D00]"
        >
          Try Another Playlist
        </button>
      </div>
    </div>
  );
}
