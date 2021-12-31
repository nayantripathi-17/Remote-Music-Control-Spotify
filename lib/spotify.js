import SpotifyWebApi from "spotify-web-api-node";
import queryString from "query-string";
const { NEXT_PUBLIC_VERCEL_URL,SPOTIFY_CLIENT_SECRET,SPOTIFY_CLIENT_ID } =  process.env;

const scopes= [
    "user-read-email",
    "user-read-private",
    "user-read-playback-state",
    "user-modify-playback-state",
    "user-read-currently-playing",
    "user-library-read",
    "playlist-read-collaborative",
    "playlist-read-private",
    "streaming",
    "user-read-recently-played",
    "user-top-read",
    "user-read-playback-position"
].join(" ");

const params = {
    scope: scopes,
    response_type: 'code',
    redirect_uri: `${NEXT_PUBLIC_VERCEL_URL}/api/auth/callback/spotify`
}

const LOGIN_URL = `https://accounts.spotify.com/authorize?${queryString.stringify(params)}`

const spotifyApi = new SpotifyWebApi({
    clientId: SPOTIFY_CLIENT_ID,
    clientSecret: SPOTIFY_CLIENT_SECRET,
    redirectUri: `${NEXT_PUBLIC_VERCEL_URL}/api/auth/callback/spotify`
});

export default spotifyApi
export { LOGIN_URL }