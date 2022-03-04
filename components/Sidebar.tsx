import {
  HomeIcon,
  SearchIcon,
  LibraryIcon,
  PlusCircleIcon,
  RssIcon,
  MenuIcon
} from "@heroicons/react/outline";
import { HeartIcon } from "@heroicons/react/solid"
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { playlistIdState } from "../atoms/playlistAtom";
import useSpotify from "../hooks/useSpotify";
import { ClickHandler, HomeProps } from "../types";
import HorizontalRule from "./HorizontalRule";
import SidebarLinks from "./SidebarLinks";

function Sidebar({ playlists }: HomeProps) {

  const router = useRouter();
  const spotifyApi = useSpotify();
  // const [playlists, setPlaylists] = useState<SpotifyApi.PlaylistObjectSimplified[]>([]);
  const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);


  const emptyRef = useCallback(() => { }, [])

  return (
    <>
      <div
        className="text-gray-500 text-xs lg:text-sm">
        <MenuIcon className="w-5 py-2 aboslute h-fit md:hidden" />
        <div
          className="space-y-2.5 hidden border-r border-gray-900 p-5 overflow-y-scroll scrollbar-hide h-screen
          md:max-w-[12rem] md:block
          lg:max-w-[15rem]">

          <SidebarLinks component={<><HomeIcon className="h-5 w-5" />Home</>} clickHandler={emptyRef} />
          <SidebarLinks component={<><SearchIcon className="h-5 w-5" />Search</>} clickHandler={emptyRef} />
          <SidebarLinks component={<><LibraryIcon className="h-5 w-5" />Your Library</>} clickHandler={emptyRef} />

          <HorizontalRule />

          <SidebarLinks component={<><PlusCircleIcon className="h-5 w-5" />Create Playlist</>} clickHandler={emptyRef} />
          <SidebarLinks component={<><HeartIcon className="h-5 w-5 text-blue-500" />Liked Songs</>} clickHandler={() => setPlaylistId("liked")} />
          <SidebarLinks component={<><RssIcon className="h-5 w-5 text-green-500 inline" />Your Episodes</>} clickHandler={emptyRef} />

          <HorizontalRule />

          {/* Playlists */}

          {playlists.map(playlist =>
            <SidebarLinks key={playlist.id} component={<>{playlist.name}</>} clickHandler={() => setPlaylistId(playlist.id)} />
          )}

        </div>
      </div>
    </>
  );
}

export default Sidebar;
