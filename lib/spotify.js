import SpotifyWebApi from "spotify-web-api-node";
import queryString from "query-string";
// const state = generateRandomString(16);

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
    redirect_uri: `http://localhost:3000/api/auth/callback/spotify`
}

const LOGIN_URL = `https://accounts.spotify.com/authorize?${queryString.stringify(params)}`

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: `http://localhost:3000/api/auth/callback/spotify`
});

export default spotifyApi
export { LOGIN_URL }