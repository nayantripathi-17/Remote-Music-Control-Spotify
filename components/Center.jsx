import { ChevronDoubleDownIcon } from "@heroicons/react/outline"
import { signOut, useSession } from "next-auth/react"
import { useState,useEffect } from "react"
import { random } from "lodash"
import { useRecoilState, useRecoilValue } from "recoil"
import { playlistIdState, playlistState } from "../atoms/playlistAtom"
import useSpotify from "../hooks/useSpotify"
import Songs from "./Songs";


function Center() {

    const colors = [
        "from-indigo-500",
        "from-blue-500",
        "from-green-500",
        "from-red-500",
        "from-yellow-500",
        "from-pink-500",
        "from-purple-500"]

    const spotifyApi = useSpotify();
    const {data:session} = useSession()
    const [color,setColor] = useState(null);
    const playlistId = useRecoilValue(playlistIdState);
    const [playlist,setPlaylist] = useRecoilState(playlistState)


    useEffect(() => {
        setColor(colors[random(6,false)])
    }, [playlistId])

    useEffect(()=>{
        if(playlistId==="liked"){
            spotifyApi.getMySavedTracks().then((data)=>{
                data.body.name=`My Liked Songs`;
                data.body.images = [{url:`https://i.pinimg.com/564x/fe/5c/36/fe5c36b8b4cbaa728f3c03a311e002cb.jpg`}];
                setPlaylist(data.body);
            }).catch(error=>console.log(`liked songs err ${error}`))
        }
        else{
            spotifyApi.getPlaylist(playlistId).then((data)=>{
                setPlaylist(data.body)

            }).catch(error=>console.log(`playlistid err ${error}`))
        }
        
    },[spotifyApi,playlistId])

    return (
        <div className="flex-grow overflow-y-scroll h-screen scrollbar-hide">
            <header className="absolute top-5 right-8">
                <div className="flex items-center bg-black space-x-3 text-white 
                opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2"
                onClick={()=>signOut()}>
                    <img
                    src={session?.user?.image} 
                    className="rounded-full w-11 h-11"/>
                    <h2>{session?.user?.name}</h2>
                    <ChevronDoubleDownIcon className="h-5 w-5"/>
                </div>
            </header>

            <section className={`flex items-end space-x-7 bg-gradient-to-b ${color} to-black h-80 text-white p-8`}>
                <img className="h-44 w-44 shadow-2xl" 
                src={playlist?.images?.[0].url} 
                alt="playlist icon" />
                <div>
                    <p>PLAYLIST</p>
                    <h1 className="sm:text-2xl md:text-3xl xl:5xl font-bold">{playlist?.name}</h1>
                </div>
            </section>
            <Songs />

            <div>

            </div>
        </div>
    )
}

export default Center
