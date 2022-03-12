import SpotifyWebApi from "spotify-web-api-node";

const fetchSongInfo = async (spotifyApi: SpotifyWebApi, currentTrackId: string): Promise<SpotifyApi.SingleTrackResponse | ""> => {
    try {
        if (currentTrackId === "" || currentTrackId == null || currentTrackId == undefined) return ""

        const trackResponse = await spotifyApi.getTrack(currentTrackId)
        return trackResponse.body
    }
    catch (err) {
        console.log(err)
        return ""
    }
}

export default fetchSongInfo

