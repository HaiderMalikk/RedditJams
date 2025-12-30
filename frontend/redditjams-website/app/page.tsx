"use client";

import Image from "next/image";
import { useState } from "react";
import InitialView from "./components/InitialView";
import LoadingView from "./components/LoadingView";
import ResultsView from "./components/ResultsView";
import ErrorView from "./components/ErrorView";
import { ApiResponse } from "./types/api";

export default function Home() {
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGetRecommendations = async () => {
    if (!playlistUrl) {
      setError("Please enter a Spotify playlist URL");
      return;
    }

    // Scroll to top before showing loading
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }

    setLoading(true);
    setResults(null);
    setError(null);

    try {
      console.log("Sending request with playlist URL:", playlistUrl);

      const response = await fetch("/api/recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ playlist_url: playlistUrl }),
      });

      const data: ApiResponse = await response.json();
      console.log("Response from API:", data);

      if (!response.ok || data.success === false) {
        console.error("Error:", data);
        setError(data.error || "Something went wrong. Please try again.");
        setLoading(false);
      } else {
        setResults(data);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error calling API:", error);
      setError(
        "Failed to connect to the server. Please make sure the backend is running and try again.",
      );
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResults(null);
    setError(null);
    setPlaylistUrl("");
  };

  const handleRegenerate = async () => {
    if (!playlistUrl) return;
    await handleGetRecommendations();
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-white font-sans">
      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        {!loading && !results && !error && (
          <InitialView
            playlistUrl={playlistUrl}
            setPlaylistUrl={setPlaylistUrl}
            onStart={handleGetRecommendations}
          />
        )}

        {loading && <LoadingView />}

        {error && <ErrorView error={error} onReset={handleReset} />}

        {results && !error && (
          <ResultsView
            data={results}
            onReset={handleReset}
            onRegenerate={handleRegenerate}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-black bg-black px-4 py-12 text-white md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between md:gap-24">
            {/* Logo - top on mobile, left on desktop */}
            <div className="hidden flex-shrink-0 md:block">
              <Image
                src="/logo.svg"
                alt="RedditJams Logo"
                width={120}
                height={120}
              />
            </div>

            {/* About, Links, and Creator - equally spaced */}
            <div className="flex flex-1 flex-col gap-8 md:flex-row md:justify-between md:gap-16">
              {/* About */}
              <div className="flex-1">
                <h4 className="text-primary mb-4 text-lg font-bold">About</h4>
                <p className="text-sm text-gray-300 md:max-w-xs">
                  RedditJams is an intelligent music recommendation system that
                  combines Spotify data, Reddit community insights, and AI to
                  help you discover your next favorite songs.
                </p>
              </div>

              {/* Links */}
              <div className="flex-1">
                <h4 className="text-primary mb-4 text-lg font-bold">Links</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a
                      href="https://github.com/HaiderMalikk/RedditJams"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary text-gray-300 transition-colors"
                    >
                      Source Code
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/HaiderMalikk/RedditJams/blob/master/licence"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary text-gray-300 transition-colors"
                    >
                      License
                    </a>
                  </li>
                </ul>
              </div>

              {/* Creator */}
              <div className="flex-1">
                <h4 className="text-primary mb-4 text-lg font-bold">Creator</h4>
                <p className="text-sm text-gray-300">
                  Built with by{" "}
                  <a
                    href="https://www.haidercodes.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary font-semibold text-white transition-colors"
                  >
                    Haider Malik
                  </a>
                </p>
                <p className="mt-2 text-xs text-gray-400">
                  © 2025 RedditJams. All rights reserved.
                </p>
              </div>
            </div>

            {/* Logo - bottom center on mobile only */}
            <div className="mt-8 flex justify-center md:hidden">
              <Image
                src="/logo.svg"
                alt="RedditJams Logo"
                width={120}
                height={120}
              />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
