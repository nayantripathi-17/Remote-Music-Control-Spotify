import SpotifyWebApi from "spotify-web-api-node";
import queryString from "query-string";
import urljoin from "url-join";

const scopes = [
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

const { DEPLOYED_URL } = process.env;
const redirect_uri = urljoin(String(DEPLOYED_URL), `api`, `auth`, `callback`, `spotify`)

const params = {
    scope: scopes,
    response_type: 'code',
    redirect_uri: redirect_uri
}

const LOGIN_URL = urljoin(`https://accounts.spotify.com`, `authorize`, `?${queryString.stringify(params)}`)

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: redirect_uri
});

export default spotifyApi
export { LOGIN_URL }