import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { currentTrackIdState } from "../atoms/songAtom";
import useSpotify from "./useSpotify"

function useSongInfo() {
    const spotifyApi = useSpotify();
    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState)
    const [songInfo, setSongInfo] = useState<SpotifyApi.SingleTrackResponse | "">("")

    useEffect(() => {
        const fetchSongInfo = async () => {
            if (currentTrackId !== "") {
               const trackResponse = await spotifyApi.getTrack(currentTrackId)
               setSongInfo(trackResponse.body)
            }
        }
        fetchSongInfo()
    }, [currentTrackId, spotifyApi])
    return songInfo
}

export default useSongInfo;
