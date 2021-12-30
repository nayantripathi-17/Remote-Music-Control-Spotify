import { useRecoilState } from "recoil";
import useSpotify from "../hooks/useSpotify"
import {millisecondsToMinutesAndSeconds} from "../lib/time"
import {currentTrackIdState,isPlayingState} from "../atoms/songAtom"

function Song({track,order}) {
    const spotifyApi = useSpotify();
    const [currentTrackId,setCurrentTrackId] = useRecoilState(currentTrackIdState);
    const [isPlaying,setIsPlaying] = useRecoilState(isPlayingState);

    const playSong = ()=>{
        setCurrentTrackId(track.track.id)
        setIsPlaying(true)
        spotifyApi.play({
            uris: [track.track.uri],
        }).catch(err=>console.log(err))       
    }


    return (
        <div className="grid grid-cols-2 text-gray-500 py-4 px-5
        hover:bg-gray-900 rounded-lg cursor-pointer"
        onClick={playSong}>
            <div className="flex items-center space-x-3">
                <p>{order + 1}</p>
                <img className="h-10 w-10" alt={track?.track?.name} src={track?.track?.album?.images[0]?.url}/>
                <div>
                    <p className="w-36 lg:w-64 truncate text-white">{track?.track?.name}</p>
                    <p>{track?.track?.artists[0]?.name}</p>
                </div>
            </div>
            <div className="flex items-center justify-between ml-auto md:ml-0">
                <p className="w-40 lg:w-full hidden md:inline-flex">{track?.track?.album?.name}</p>
                <p>{millisecondsToMinutesAndSeconds(track?.track?.duration_ms)}</p>
            </div>
        </div>
    )
}

export default Song
