import { atom, RecoilState } from "recoil";

export const currentTrackIdState: RecoilState<string> = atom({
    key: "currentTrackIdState",
    default: ""
});

export const isPlayingState = atom({
    key: "isPlayingState",
    default: false
})