import { SetterOrUpdater, useRecoilState } from "recoil";
import SpotifyWebApi from "spotify-web-api-node";

const fetchCurrentSong = async (spotifyApi: SpotifyWebApi, setCurrentTrackId: SetterOrUpdater<string>, setIsPlaying: SetterOrUpdater<boolean>) => {
    try {
        const currentTrackResponse = await spotifyApi.getMyCurrentPlayingTrack()
        setCurrentTrackId(currentTrackResponse.body.item ? currentTrackResponse.body.item.id : "")
        const playbackState = await spotifyApi.getMyCurrentPlaybackState()
        setIsPlaying(playbackState.body.is_playing)
    }
    catch (err) {
        console.log(err);
        setCurrentTrackId("")
        setIsPlaying(false);
    }
}

export default fetchCurrentSong
