import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Get the playlist_url from the request body
    const body = await request.json();
    const { playlist_url } = body;

    console.log("Request received from client:", playlist_url);

    if (!playlist_url) {
      return NextResponse.json(
        { error: "playlist_url is required" },
        { status: 400 },
      );
    }

    const BACKEND_URL = "https://reddit-jams-backend.vercel.app"; // vercel app

    console.log("Calling FastAPI backend at:", BACKEND_URL);

    // Make a POST request to the FastAPI backend
    const response = await fetch(`${BACKEND_URL}/api/recommendations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        playlist_url: playlist_url,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("FastAPI backend error:", errorText);
      return NextResponse.json(
        { error: `Backend error: ${response.statusText}` },
        { status: response.status },
      );
    }

    const data = await response.json();
    console.log("Data received from FastAPI:", data);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error calling FastAPI backend:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
