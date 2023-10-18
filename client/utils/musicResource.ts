import { SpotifyApi } from "@spotify/web-api-ts-sdk";

export type SongData = {
  songTitle: string;
  artists: string;
  image: string;
  preview_url: string | null;
  id: string;
};

export async function searchSongs(query: string): Promise<SongData[]> {
  const client_id = "43a977114b864a989c93a6269ee06b66";
  const client_secret = "9ce02b93229048c6a6a75ef32fac07a7";

  const api = SpotifyApi.withClientCredentials(client_id, client_secret);
  const items = await api.search(query, ["track"], "US", 5);

  return items.tracks.items.map((item) => ({
    songTitle: item.name,
    artists: item.artists.map((artistObj) => artistObj.name).join(", "),
    image: item.album.images[0].url,
    preview_url: item.preview_url,
    id: item.id,
  }));
}

export async function getSongBySpotifyId(spotifyId: string): Promise<SongData> {
  const client_id = "43a977114b864a989c93a6269ee06b66";
  const client_secret = "9ce02b93229048c6a6a75ef32fac07a7";

  const api = SpotifyApi.withClientCredentials(client_id, client_secret);

  const track = await api.tracks.get(spotifyId);

  return {
    songTitle: track.name,
    artists: track.artists.map((artistObj) => artistObj.name).join(", "),
    image: track.album.images[0].url,
    preview_url: track.preview_url,
    id: spotifyId,
  };
}
