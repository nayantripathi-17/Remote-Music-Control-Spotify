/* eslint-disable @next/next/no-img-element */
import useSpotify from "../hooks/useSpotify";
import { RefreshIcon as Sync } from "@heroicons/react/outline"
import { signOut } from "next-auth/react"
import { useState } from "react";
import { useRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import fetchCurrentSong from "../lib/fetchCurrentSong";
import { CenterProps } from "../types";

function ProfileBar({ session }: CenterProps) {

    const spotifyApi = useSpotify();
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const updateSong = async () => {
        setIsRefreshing(true)
        fetchCurrentSong(spotifyApi, setCurrentTrackId, setIsPlaying)
            .then(() => setIsRefreshing(false))
    }

    return (
        <div className="flex items-center space-x-4" >
            <div className="bg-black text-white rounded-full p-3">
                {isRefreshing ?
                    (<Sync className="button animate-spin" />)
                    :
                    (<Sync className="button" onClick={updateSong} />)
                }
            </div>
            <div className="flex items-center space-x-3 opacity-90 hover:opacity-80 bg-black text-white rounded-full cursor-pointer p-1 pr-4"
                onClick={() => signOut()}
            >
                {session?.user?.image &&
                    (<img
                        className="rounded-full w-11 h-11"
                        src={session?.user?.image}
                        alt="User Profile Photo" />
                    )}
                <h2>{session?.user?.name ? session?.user?.name : "User"}</h2>
            </div>
        </div>
    )
}

export default ProfileBar