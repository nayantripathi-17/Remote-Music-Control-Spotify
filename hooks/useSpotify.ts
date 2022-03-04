import { useSession, signIn } from "next-auth/react"
import { useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-node";
import urljoin from "url-join";
import { ServerSession } from "../types";

const { DEPLOYED_URL } = process.env; 
const redirect_uri = urljoin(String(DEPLOYED_URL), `api`, `auth`, `callback`, `spotify`)

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: redirect_uri
})

function useSpotify() {
    const { data } = useSession();
    const session = data as ServerSession

    useEffect(() => {
        if (session) {
            //If refreshtoken fails, it will generate the error and user is directed to login
            if (session.error === "RefreshAccessTokenError") {
                signIn();
            }
            spotifyApi.setAccessToken(session?.user?.accessToken)
        }
    }, [session])

    return spotifyApi;
}

export default useSpotify;
