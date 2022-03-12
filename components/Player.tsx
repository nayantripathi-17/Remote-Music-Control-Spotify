/* eslint-disable @next/next/no-img-element */
import {
  PauseIcon,
  RewindIcon,
  VolumeUpIcon,
  FastForwardIcon,
  PlayIcon,
  ReplyIcon,
  VolumeOffIcon as Mute,
} from "@heroicons/react/solid";
import {
  SwitchHorizontalIcon,
  VolumeUpIcon as VolumeDownIcon,
  VolumeOffIcon as Muted,
  RefreshIcon as Sync,
} from "@heroicons/react/outline";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import useSpotify from "../hooks/useSpotify";
import debounce from "lodash/debounce";
import PlayerLeft from "./PlayerLeft";
import fetchCurrentSong from "../lib/fetchCurrentSong";
import fetchSongInfo from "../lib/fetchSongInfo";

function Player() {
  const spotifyApi = useSpotify();
  const { data: session } = useSession();
  const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [volume, setVolume] = useState(100);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [songInfo, setSongInfo] = useState<"" | SpotifyApi.SingleTrackResponse>("")

  useEffect(() => {
    const fetchSong = async () => {
      const response = await fetchSongInfo(spotifyApi, currentTrackId)
      setSongInfo(response)
    }
    fetchSong();
  }, [currentTrackId, spotifyApi])

  const handlePlayPause = async () => {
    try {
      const is_playing = (await spotifyApi.getMyCurrentPlaybackState())?.body?.is_playing
      if (is_playing) {
        await spotifyApi.pause()
        setIsPlaying(false)
      }
      else {
        await spotifyApi.play()
        setIsPlaying(true)
      }
    }
    catch (err) {
      console.log(err)
    } finally {
      await fetchCurrentSong(spotifyApi, setCurrentTrackId, setIsPlaying);
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedAdjustVolume = useCallback(
    debounce(async (volume: number) => {
      try {
        await spotifyApi.setVolume(volume)
      }
      catch (err) {
        console.log(err)
      }
    }, 500),
    []
  )

  const prevSong = async () => {
    setIsRefreshing(true)
    try {
      await spotifyApi.skipToPrevious()
    }
    catch (err) {
      console.log(err)
    }
    finally {
      setTimeout(async () => {
        await fetchCurrentSong(spotifyApi, setCurrentTrackId, setIsPlaying);
        setIsRefreshing(false)
      }, 1000)
    }
  }

  const nextSong = async () => {
    setIsRefreshing(true)
    try {
      await spotifyApi.skipToNext()
    }
    catch (err) {
      console.log(err)
    }
    finally {
      setTimeout(async () => {
        await fetchCurrentSong(spotifyApi, setCurrentTrackId, setIsPlaying);
        setIsRefreshing(false)
      }, 1000)
    }
  }

  const updateSong = async () => {
    setIsRefreshing(true)
    fetchCurrentSong(spotifyApi, setCurrentTrackId, setIsPlaying)
      .then(() => setIsRefreshing(false))
  }

  useEffect(() => {
    try {
      if (spotifyApi.getAccessToken()) {
        //fetch song info
        fetchCurrentSong(spotifyApi, setCurrentTrackId, setIsPlaying);
        setVolume(100);
      }
    }
    catch (err) {
      console.log(err)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrackId, spotifyApi, session]);


  useEffect(() => {
    if (volume >= 0 && volume <= 100) {
      debouncedAdjustVolume(volume);
    }
  }, [volume, debouncedAdjustVolume])


  return (
    <div
      className="h-24 bg-gradient-to-b from-black to-gray-900 
    text-white overflow-hidden grid grid-cols-3 text-xs 
    md:text-base px-2 md:px-8"
    >
      {/* Left */}
      <PlayerLeft songInfo={songInfo} />
      {/* Center */}
      <div className="flex items-center justify-evenly pr-5">
        {isRefreshing ? (<Sync className="button animate-spin" />)
          :
          (<Sync className="button" onClick={updateSong} />)}
        <SwitchHorizontalIcon className="button hidden sm:inline" />
        <RewindIcon
          onClick={prevSong}
          className="button"
        />

        {isPlaying ?
          (<PauseIcon onClick={handlePlayPause} className="button w-10 h-10" />) :
          (<PlayIcon onClick={handlePlayPause} className="button w-10 h-10" />)}

        <FastForwardIcon
          onClick={nextSong} className="button" />
        <ReplyIcon className="button hidden sm:inline" />
      </div>
      {/* Right */}
      <div className="flex items-center space-x-3 justify-end">
        {volume > 0 && <Mute className="button" onClick={() => setVolume(0)} />}
        {volume === 0 ?
          <Muted className="button" onClick={() => setVolume(100)} />
          :
          <VolumeDownIcon className="button"
            onClick={() => volume - 10 <= 0 ? setVolume(0) : setVolume(volume - 10)} />}
        <input
          className="w-14 sm:w-24 md:w-28 lg:w-40"
          type="range" min={0} max={100} value={volume}
          onChange={event => setVolume(Number(event.target.value))} />
        <VolumeUpIcon className="button"
          onClick={() => volume + 10 >= 100 ? setVolume(100) : setVolume(volume + 10)} />
      </div>
    </div>
  );
}

export default Player;

