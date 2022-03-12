/* eslint-disable @next/next/no-img-element */
import { useState, useEffect, useMemo } from "react"
import { useRecoilState, useRecoilValue } from "recoil"
import useSpotify from "../hooks/useSpotify"
import random from "lodash/random"
import { playlistIdState, playlistState, playlistTrackState } from "../atoms/playlistAtom"
import Songs from "./Songs";
import { CenterProps, isSinglePlayListResponse } from "../types"
import ProfileBar from "./ProfileBar"

function Center({ session }: CenterProps) {

    const colors = useMemo(() => [
        "from-indigo-500",
        "from-blue-500",
        "from-green-500",
        "from-red-500",
        "from-yellow-500",
        "from-pink-500",
        "from-purple-500"
    ], [])

    const spotifyApi = useSpotify();
    const [color, setColor] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const playlistId = useRecoilValue(playlistIdState);
    const [playlistTrack, setPlaylistTrack] = useRecoilState(playlistTrackState)
    const [playlist, setPlaylist] = useRecoilState(playlistState)

    useEffect(() => {
        setColor(colors[random(6, false)])
    }, [playlistId, colors])

    useEffect(() => {
        try {
            const fetchAndSetTracks = async () => {
                setIsLoading(true)
                if (playlistId === "liked") {
                    const savedTracks = await spotifyApi.getMySavedTracks({ limit: 50, offset: 0 })
                    const total = savedTracks.body.total
                    var items = savedTracks.body.items

                    //Auto pagination
                    var batches = total % 50 === 0 ? (total / 50) - 1 : Math.floor(total / 50)
                    const totalBatch = batches + 1

                    while (batches > 0) {
                        const offset = (totalBatch - batches) * 50
                        const response = await spotifyApi.getMySavedTracks({ limit: 50, offset: offset })
                        items = items.concat(response.body.items)
                        batches -= 1;
                    }

                    setPlaylistTrack((playlistTrack) => {
                        const prevPlaylist = playlistTrack as SpotifyApi.SavedTrackObject[]
                        return prevPlaylist.concat(items)
                    })
                    setPlaylist(savedTracks.body)
                }
                else {
                    const playlistResponse = await spotifyApi.getPlaylist(playlistId);
                    setPlaylistTrack(playlistResponse.body.tracks.items)
                    setPlaylist(playlistResponse.body)
                }
                setIsLoading(false)
            }
            fetchAndSetTracks();
        }
        catch (err) {
            console.log(err)
        }

    }, [spotifyApi, playlistId, setPlaylist, setPlaylistTrack])


    return (
        <div className="flex-grow overflow-y-scroll h-screen scrollbar-hide">
            {!isLoading ? (
                <>
                    <header className="absolute top-5 right-8">
                        <ProfileBar session={session} />
                    </header>
                    <section className={`flex items-end space-x-7 bg-gradient-to-b ${color} to-black h-80 text-white p-8`}
                    >
                        <img className="h-44 w-44 shadow-2xl"
                            src={
                                isSinglePlayListResponse(playlist)
                                    ? playlist?.images?.[0]?.url : `https://i.pinimg.com/564x/fe/5c/36/fe5c36b8b4cbaa728f3c03a311e002cb.jpg`}
                            alt="playlist icon" />

                        <h1 className="sm:text-2xl md:text-3xl xl:5xl font-bold">{
                            isSinglePlayListResponse(playlist) ?
                                playlist?.name : `My Liked Songs`}</h1>

                    </section>
                    <Songs />
                </>)
                :
                <section className="bg-gradient-to-b from-gray-900 to-black h-screen text-white p-8 animate-pulse"></section>}
        </div>
    )
}

export default Center
