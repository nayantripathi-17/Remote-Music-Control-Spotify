/* eslint-disable @next/next/no-img-element */
import {
  PauseIcon,
  RewindIcon,
  VolumeUpIcon,
  FastForwardIcon,
  PlayIcon,
  ReplyIcon,
} from "@heroicons/react/solid";
import {
  SwitchHorizontalIcon,
  HeartIcon,
  VolumeUpIcon as VolumeDownIcon,
} from "@heroicons/react/outline";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import useSongInfo from "../hooks/useSongInfo";
import useSpotify from "../hooks/useSpotify";
import { debounce } from "lodash";

function Player() {
  const spotifyApi = useSpotify();
  const { data: session } = useSession();
  const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [volume, setVolume] = useState(100);

  const songInfo = useSongInfo();

  const fetchCurrentSong = useCallback(async () => {
    try {
      if (songInfo === "") {
        const currentTrackResponse = await spotifyApi.getMyCurrentPlayingTrack()
        setCurrentTrackId(currentTrackResponse.body.item ? currentTrackResponse.body.item.id : "")
        const playbackState = await spotifyApi.getMyCurrentPlaybackState()
        setIsPlaying(playbackState.body.is_playing)
      }
    }
    catch (err) {
      console.log(err);
      setCurrentTrackId("")
      setIsPlaying(false);
    }
  }, [spotifyApi, songInfo, setIsPlaying, setCurrentTrackId]);

  const handlePlayPause = async () => {
    const { body: { is_playing } } = await spotifyApi.getMyCurrentPlaybackState()
    if (is_playing) {
      spotifyApi.pause()
      setIsPlaying(false)
    }
    else {
      spotifyApi.play()
      setIsPlaying(true)
    }
  }

  const debouncedAdjustVolume = useCallback(
    debounce((volume) => {
      spotifyApi.setVolume(volume).catch(err => { })
    }, 500),
    []
  )

  const prevSong = async ()=>{
    await spotifyApi.skipToPrevious()
    fetchCurrentSong()
  }

  useEffect(() => {
    if (spotifyApi.getAccessToken() && currentTrackId !== "") {
      //fetch song info
      fetchCurrentSong();
      setVolume(100);
    }
  }, [currentTrackId, spotifyApi, session, fetchCurrentSong]);

  
  useEffect(() => {
    if (volume > 0 && volume < 100) {
      debouncedAdjustVolume(volume);
    }
  }, [volume])


  return (
    <div
      className="h-24 bg-gradient-to-b from-black to-gray-900 
    text-white overflow-hidden grid grid-cols-3 text-xs 
    md:text-base px-2 md:px-8"
    >
      {/* Left */}
      <div className="flex items-center space-x-4">
        {songInfo !== "" && (<img
          alt="Album image"
          className="hidden md:inline h-14 w-14"
          src={songInfo?.album?.images?.[0]?.url}
        />)}
        {songInfo !== "" && (<div>
          <h3>{songInfo?.name}</h3>
          <p>{songInfo?.artists?.[0].name}</p>
        </div>)}
      </div>
      {/* Center */}
      <div className="flex items-center justify-evenly pr-5">
        <SwitchHorizontalIcon className="button hidden sm:inline" />
        <RewindIcon
          onClick={() => spotifyApi.skipToPrevious().then(fetchCurrentSong()).catch(err => console.log(err))}
          className="button"
        />

        {isPlaying ?
          (<PauseIcon onClick={handlePlayPause} className="button w-10 h-10" />) :
          (<PlayIcon onClick={handlePlayPause} className="button w-10 h-10" />)}

        <FastForwardIcon
          onClick={() => spotifyApi.skipToNext().then(fetchCurrentSong()).catch(err => console.log(err))} className="button" />
        <ReplyIcon className="button hidden sm:inline" />
      </div>
      {/* Right */}
      <div className="flex items-center space-x-3 justify-end">
        <VolumeDownIcon className="button"
          onClick={() => volume > 0 && setVolume(volume - 10)} />
        <input
          className="w-14 sm:w-24 md:w-28 lg:w-40"
          type="range" min={0} max={100} value={volume}
          onChange={event => setVolume(Number(event.target.value))} />
        <VolumeUpIcon className="button"
          onClick={() => volume < 100 && setVolume(volume + 10)} />
      </div>
    </div>
  );
}

export default Player;
