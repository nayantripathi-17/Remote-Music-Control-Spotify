import { atom, RecoilState } from "recoil";

export const playlistState: RecoilState<SpotifyApi.SinglePlaylistResponse | SpotifyApi.UsersSavedTracksResponse | null> = atom({
    key: "playlistState",
    default: null
})

export const playlistTrackState: RecoilState<SpotifyApi.SavedTrackObject[] | SpotifyApi.PlaylistTrackObject[]> = atom({
    key: "playlistState",
    default: []
})

export const playlistIdState = atom({
    key: "playlistIdState",
    default: "liked"
})