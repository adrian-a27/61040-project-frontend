export type SongData = {
  songTitle: string;
  albumName: string;
  artists: string;
  image: string;
  preview_url: string | null;
  id: string;
};

type ApiResponse = {
  name: string;
  album: { name: string; images: { url: string }[] };
  artists: { name: string }[];
  image: string;
  preview_url: string;
  id: string;
};

type AuthToken = { token: string; accessDate: Date };

// API Constants
const SPOTIFY_CLIENT_ID = "43a977114b864a989c93a6269ee06b66";
const SPOTIFY_CLIENT_SECRET = "f3c729ed875c4ac582b867eeefa9bc7a";
let authToken = <AuthToken>{ token: "", accessDate: new Date(0) };

// API Endpoints
const searchEndpoint = new URL("https://api.spotify.com/v1/search");
const getTrackEndpoint = new URL("https://api.spotify.com/v1/tracks/");

async function getAuthToken() {
  if (Date.now() - authToken.accessDate.getTime() > 3600000) {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `grant_type=client_credentials&client_id=${SPOTIFY_CLIENT_ID}&client_secret=${SPOTIFY_CLIENT_SECRET}`,
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const authResponse = await response.json();

    authToken = {
      token: authResponse.access_token,
      accessDate: new Date(),
    };
  }
  return authToken.token;
}

export async function searchSongs(query: string): Promise<SongData[]> {
  const params = { q: query, type: "track", market: "US", limit: "3" };
  searchEndpoint.search = new URLSearchParams(params).toString();
  const response = await fetch(searchEndpoint, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${await getAuthToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const results = (await response.json()).tracks.items;

  return results.map((item: ApiResponse) => ({
    songTitle: item.name,
    albumName: item.album.name,
    artists: item.artists.map((artistObj) => artistObj.name).join(", "),
    image: item.album.images[0].url,
    preview_url: item.preview_url,
    id: item.id,
  }));
}

export async function getSongBySpotifyId(spotifyId: string): Promise<SongData> {
  const params = { market: "US" };

  const trackEndpoint = new URL(getTrackEndpoint.toString() + spotifyId);
  // trackEndpoint.search = new URLSearchParams(params).toString();

  const response = await fetch(trackEndpoint, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${await getAuthToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const track = (await response.json()) as ApiResponse;
  return {
    songTitle: track.name,
    albumName: track.album.name,
    artists: track.artists.map((artistObj) => artistObj.name).join(", "),
    image: track.album.images[0].url,
    preview_url: track.preview_url,
    id: spotifyId,
  };
}
