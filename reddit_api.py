"""
Reddit API Module
Handles Reddit authentication and operations:
- Step 3: Search Reddit for recommendations (Async with parallel searches)
"""

import asyncpraw
import asyncio
from typing import Dict, List, Any


def initialize_reddit(
    client_id: str, client_secret: str, username: str, password: str, user_agent: str
) -> asyncpraw.Reddit:
    """
    Initialize async Reddit API client

    Args:
        client_id: Reddit client ID
        client_secret: Reddit client secret
        username: Reddit username
        password: Reddit password
        user_agent: Reddit user agent

    Returns:
        Async Reddit client object
    """
    reddit = asyncpraw.Reddit(
        client_id=client_id,
        client_secret=client_secret,
        username=username,
        password=password,
        user_agent=user_agent,
    )

    print(f"Async Reddit API initialized")
    return reddit


async def search_reddit_for_recommendations(
    reddit: asyncpraw.Reddit,
    query: str,
    subreddit_name: str,
    max_posts: int = 20,
    max_comments: int = 30,
) -> List[Dict[str, Any]]:
    """
    Search Reddit for recommendation posts/comments (Async)
    Focus on: "recommend", "similar to", "if you like"

    Args:
        reddit: Async Reddit client object
        query: Search query string
        subreddit_name: Name of subreddit to search
        max_posts: Maximum number of posts to retrieve
        max_comments: Maximum number of comments per post

    Returns:
        list: List of recommendation posts with comments
    """
    subreddit = await reddit.subreddit(subreddit_name)
    recommendations = []

    try:
        # Search for posts
        search_results = subreddit.search(query, limit=max_posts)

        async for post in search_results:
            # Look for recommendation keywords in title or body
            text = f"{post.title} {post.selftext}".lower()

            if any(
                keyword in text
                for keyword in [
                    "recommend",
                    "similar",
                    "if you like",
                    "check out",
                    "you might like",
                    "fans of",
                ]
            ):
                post_data = {
                    "title": post.title,
                    "body": post.selftext,
                    "score": post.score,
                    "url": f"https://reddit.com{post.permalink}",
                    "comments": [],
                }

                # Get comments
                try:
                    await post.comments.replace_more(limit=0)
                    all_comments = post.comments.list()

                    for comment in all_comments[:max_comments]:
                        try:
                            comment_text = comment.body.lower()
                            if any(
                                keyword in comment_text
                                for keyword in [
                                    "recommend",
                                    "similar",
                                    "if you like",
                                    "check out",
                                    "you might like",
                                    "try",
                                ]
                            ):
                                post_data["comments"].append(
                                    {
                                        "body": comment.body,
                                        "score": comment.score,
                                        "author": str(comment.author)
                                        if comment.author
                                        else "[deleted]",
                                    }
                                )
                        except AttributeError:
                            # Skip if comment doesn't have body attribute (e.g., MoreComments object)
                            continue
                except Exception as e:
                    pass

                if post_data["comments"] or any(
                    keyword in text for keyword in ["recommend", "similar"]
                ):
                    recommendations.append(post_data)

    except Exception as e:
        print(f"   Error searching Reddit: {e}")

    return recommendations


async def get_reddit_recommendations(
    client_id: str,
    client_secret: str,
    username: str,
    password: str,
    user_agent: str,
    tracks_data: List[Dict[str, Any]],
    subreddit_name: str,
    max_reddit_posts_per_query: int = 20,
    max_comments_per_post: int = 30,
    num_top_tracks: int = 3,
    num_bottom_tracks: int = 3,
    num_random_tracks: int = 3,
    num_top_artists: int = 2,
    num_bottom_artists: int = 2,
    num_random_artists: int = 2,
) -> Dict[str, Any]:
    """
    Step 3: Search Reddit for Recommendations (Async with parallel searches)

    Args:
        client_id: Reddit client ID
        client_secret: Reddit client secret
        username: Reddit username
        password: Reddit password
        user_agent: Reddit user agent
        tracks_data: List of track dictionaries from Spotify
        subreddit_name: Name of subreddit to search
        max_reddit_posts_per_query: Maximum posts to fetch per query
        max_comments_per_post: Maximum comments per post
        num_top_tracks: Number of top (most popular) tracks to select
        num_bottom_tracks: Number of bottom (least popular) tracks to select
        num_random_tracks: Number of random tracks to select
        num_top_artists: Number of top artists to select
        num_bottom_artists: Number of bottom artists to select
        num_random_artists: Number of random artists to select

    Returns:
        dict: Contains all_reddit_data, selected_tracks, and selected_artists
    """
    print("=" * 80)
    print("SEARCHING REDDIT FOR RECOMMENDATIONS (PARALLEL)")
    print("=" * 80)

    # Initialize Reddit client within async context
    async with asyncpraw.Reddit(
        client_id=client_id,
        client_secret=client_secret,
        username=username,
        password=password,
        user_agent=user_agent,
    ) as reddit:
        print("Async Reddit API initialized")

        # Import random for random selection
        import random

        # Get diverse track selection: top, bottom, and random
        sorted_tracks = sorted(tracks_data, key=lambda x: x["popularity"], reverse=True)

        # Check if playlist has enough tracks
        total_tracks_needed = num_top_tracks + num_bottom_tracks + num_random_tracks
        if len(sorted_tracks) < total_tracks_needed:
            print(
                f"   Warning: Playlist has only {len(sorted_tracks)} tracks, need {total_tracks_needed} for diverse selection"
            )
            print(f"   Using available tracks...")
            selected_tracks = sorted_tracks
        else:
            # Top tracks
            top_tracks = sorted_tracks[:num_top_tracks]
            # Bottom tracks
            bottom_tracks = sorted_tracks[-num_bottom_tracks:]
            # Random tracks (excluding top and bottom)
            middle_tracks = sorted_tracks[
                num_top_tracks : -num_bottom_tracks if num_bottom_tracks > 0 else None
            ]
            if len(middle_tracks) >= num_random_tracks:
                random_tracks = random.sample(middle_tracks, num_random_tracks)
            else:
                random_tracks = middle_tracks

            selected_tracks = top_tracks + bottom_tracks + random_tracks

        # Get diverse artist selection: top, bottom, and random
        all_artists_list = list(
            set([artist for track in tracks_data for artist in track["artists"]])
        )

        total_artists_needed = num_top_artists + num_bottom_artists + num_random_artists
        if len(all_artists_list) < total_artists_needed:
            print(
                f"   Warning: Playlist has only {len(all_artists_list)} unique artists, need {total_artists_needed} for diverse selection"
            )
            print(f"   Using available artists...")
            selected_artists = all_artists_list
        else:
            # For artists, we don't have popularity, so we'll use first, last, and random from the list
            top_artists = all_artists_list[:num_top_artists]
            bottom_artists = all_artists_list[-num_bottom_artists:]
            middle_artists = all_artists_list[
                num_top_artists : -num_bottom_artists
                if num_bottom_artists > 0
                else None
            ]
            if len(middle_artists) >= num_random_artists:
                random_artists = random.sample(middle_artists, num_random_artists)
            else:
                random_artists = middle_artists

            selected_artists = top_artists + bottom_artists + random_artists

        print(f"\nSearching for recommendations based on DIVERSE selection:")
        print(
            f"   - {len(selected_tracks)} tracks (top {num_top_tracks} + bottom {num_bottom_tracks} + random {num_random_tracks})"
        )
        print(
            f"   - {len(selected_artists)} artists (top {num_top_artists} + bottom {num_bottom_artists} + random {num_random_artists})"
        )
        print(f"   - Running ALL searches in parallel...")
        print()

        # Create all search tasks for tracks
        track_search_tasks = []
        for idx, track in enumerate(selected_tracks, 1):
            query = f"{track['name']} {track['artist_names']} recommend"
            print(f"[Track {idx}/{len(selected_tracks)}] Queuing: '{track['name']}'")
            task = search_reddit_for_recommendations(
                reddit,
                query,
                subreddit_name,
                max_reddit_posts_per_query,
                max_comments_per_post,
            )
            track_search_tasks.append(task)

        # Create all search tasks for artists
        artist_search_tasks = []
        for idx, artist in enumerate(selected_artists, 1):
            query = f"{artist} recommend similar"
            print(f"[Artist {idx}/{len(selected_artists)}] Queuing: '{artist}'")
            task = search_reddit_for_recommendations(
                reddit,
                query,
                subreddit_name,
                max_reddit_posts_per_query,
                max_comments_per_post,
            )
            artist_search_tasks.append(task)

        print(
            f"\nExecuting {len(track_search_tasks) + len(artist_search_tasks)} searches in parallel..."
        )
        print()

        # Run ALL searches in parallel (tracks + artists together)
        all_results = await asyncio.gather(*track_search_tasks, *artist_search_tasks)

        # Flatten all results and show individual search results
        all_reddit_data = []

        # Display track search results
        for idx, results in enumerate(all_results[: len(selected_tracks)], 1):
            track_name = selected_tracks[idx - 1]["name"]
            if results:
                all_reddit_data.extend(results)
                print(f"[{idx}/{len(selected_tracks)}] Searching: '{track_name}'")
                print(f"         Found {len(results)} recommendation posts/threads")
            else:
                print(f"[{idx}/{len(selected_tracks)}] Searching: '{track_name}'")
                print(f"         No recommendations found")

        # Display artist search results
        for idx, results in enumerate(all_results[len(selected_tracks) :], 1):
            artist_name = selected_artists[idx - 1]
            if results:
                all_reddit_data.extend(results)
                print(
                    f"[Artist {idx}/{len(selected_artists)}] Searching: '{artist_name}'"
                )
                print(f"         Found {len(results)} recommendation posts/threads")
            else:
                print(
                    f"[Artist {idx}/{len(selected_artists)}] Searching: '{artist_name}'"
                )
                print(f"         No recommendations found")

        print(
            f"\nTotal Reddit data collected: {len(all_reddit_data)} posts with recommendations"
        )
        print(
            f"   Total comments: {sum(len(post['comments']) for post in all_reddit_data)}"
        )

    return {
        "all_reddit_data": all_reddit_data,
        "top_tracks": selected_tracks,
        "all_artists": selected_artists,
    }
