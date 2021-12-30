import { useRecoilValue } from "recoil"
import { playlistState } from "../atoms/playlistAtom"
import Song from "./Song";

function Songs() {
    const playlist = useRecoilValue(playlistState)
    // console.log(playlist,"new");
    return (
        <div className="text-white px-8 flex-col pb-28 space-y-2">
            {/* Render from Playlist */}
            {playlist?.tracks?.items? playlist?.tracks?.items?.map((track,index)=> 
            <Song track = {track} key={track.track.id} order={index}/>):
            //Render From Liked Songs
            playlist?.items.map((track,index)=> 
            <Song track = {track} key={track.track.id} order={index}/>)}
        </div>
    )
}

export default Songs
