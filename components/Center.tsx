/* eslint-disable @next/next/no-img-element */
import { ChevronDoubleDownIcon } from "@heroicons/react/outline"
import { signOut } from "next-auth/react"
import { useState, useEffect, useMemo, UIEvent, useCallback } from "react"
import random from "lodash/random"
import { useRecoilState, useRecoilValue } from "recoil"
import { playlistIdState, playlistState, playlistTrackState } from "../atoms/playlistAtom"
import useSpotify from "../hooks/useSpotify"
import Songs from "./Songs";
import { CenterProps, isSinglePlayListResponse } from "../types"


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
    const [playlist, setPlaylist] = useRecoilState(playlistTrackState)
    const [offset, setOffset] = useState(0)

    const scrollEvent = useCallback((event: React.UIEvent<HTMLElement>) => {
        const bottom = Math.floor(event.currentTarget.scrollHeight - event.currentTarget.scrollTop) === event.currentTarget.clientHeight;

        if (bottom && playlistId === "liked") {
            setOffset((offset) => offset + 50)
        }
    }, [playlistId])

    useEffect(() => {
        setColor(colors[random(6, false)])
    }, [playlistId, colors])

    useEffect(() => {
        const fetchAndSetTracks = async () => {
            setIsLoading(true)
            if (playlistId === "liked") {
                const savedTracks = await spotifyApi.getMySavedTracks({ limit: 50, offset })
                setPlaylist((playlist) => {
                    const prevPlaylist = playlist as SpotifyApi.SavedTrackObject[]
                    return prevPlaylist.concat(savedTracks.body.items)
                })
            }
            else {
                const playlistResponse = await spotifyApi.getPlaylist(playlistId);
                setPlaylist(playlistResponse.body.tracks.items)
            }
            setIsLoading(false)
        }
        fetchAndSetTracks();

    }, [spotifyApi, playlistId, setPlaylist, offset])


    return (
        <div className="flex-grow overflow-y-scroll h-screen scrollbar-hide" onScroll={scrollEvent}>
            {!isLoading ? (
                <>
                    <header className="absolute top-5 right-8">
                        <div className="flex items-center bg-black space-x-3 text-white 
                            opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2"
                            onClick={() => signOut()}>
                            {session?.user?.image &&
                                (<img
                                    className="rounded-full w-11 h-11"
                                    src={session?.user?.image}
                                    alt="User Profile Photo" />
                                )}
                            <h2>{session?.user?.name ? session?.user?.name : "User"}</h2>
                            <ChevronDoubleDownIcon className="h-5 w-5" />
                        </div>
                    </header>

                    <section className={`flex items-end space-x-7 bg-gradient-to-b ${color} to-black h-80 text-white p-8`}
                    >
                        <img className="h-44 w-44 shadow-2xl"
                            src={
                                isSinglePlayListResponse(playlist)
                                    ? playlist?.images?.[0]?.url : `https://i.pinimg.com/564x/fe/5c/36/fe5c36b8b4cbaa728f3c03a311e002cb.jpg`}
                            alt="playlist icon" />
                        <div>
                            <p>PLAYLIST</p>
                            <h1 className="sm:text-2xl md:text-3xl xl:5xl font-bold">{
                                isSinglePlayListResponse(playlist) ?
                                    playlist?.name : `My Liked Songs`}</h1>
                        </div>
                    </section>
                    <Songs />
                </>) : <section className="bg-gradient-to-b from-gray-900 to-black h-screen text-white p-8 animate-pulse"></section>}
        </div>
    )
}

export default Center
