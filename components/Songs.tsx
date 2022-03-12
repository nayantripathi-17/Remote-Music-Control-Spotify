import { useRecoilState } from "recoil"
import { playlistTrackState } from "../atoms/playlistAtom"

import Song from "./Song";

const Songs = () => {
    const [playlistTrack, setPlaylistTrack] = useRecoilState(playlistTrackState)

    return (
        <div className="text-white px-8 flex-col pb-28 space-y-2">
            {/* Render from Playlist */}
            {playlistTrack.length > 0 && (
                playlistTrack.map((track, index) => <Song track={track} key={track.track.id?track.track.id:track.track.uri} order={index} />)
            )}
        </div>
    )
}

export default Songs
