import { useRecoilValue } from "recoil"
import { playlistTrackState } from "../atoms/playlistAtom"

import Song from "./Song";

const Songs = () => {
    const playlist = useRecoilValue(playlistTrackState)

    return (
        <div className="text-white px-8 flex-col pb-28 space-y-2">
            {/* Render from Playlist */}
            {playlist.length > 0 && (
                playlist.map((track, index) => <Song track={track} key={track.track.id} order={index} />)
            )}
        </div>
    )
}

export default Songs
