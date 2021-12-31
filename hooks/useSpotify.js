import { useSession, signIn } from "next-auth/react"
import { useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-node";


const { NEXT_PUBLIC_VERCEL_URL,SPOTIFY_CLIENT_SECRET,SPOTIFY_CLIENT_ID } = process.env;


const spotifyApi = new SpotifyWebApi({
    clientId: SPOTIFY_CLIENT_ID,
    clientSecret: SPOTIFY_CLIENT_SECRET,
    redirectUri: `${NEXT_PUBLIC_VERCEL_URL}/api/auth/callback/spotify`
})

function useSpotify() {
    const { data:session,status} = useSession();

    useEffect(() => {
        if(session){
            //If refreshtoken fails, it will generate the error and user is directed to login
            if(session.error === "RefreshAccessTokenError"){
                signIn();
            }
            spotifyApi.setAccessToken(session?.user?.accessToken)
        }
    }, [session])

    return spotifyApi;
}

export default useSpotify;
