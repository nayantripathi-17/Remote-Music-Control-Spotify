import { atom } from "recoil";

export const currentTrackIdState = atom({
    key:"currentTrackIdState",
    //unique id wrt to other atoms
    default:null
});

export const isPlayingState = atom({
    key:"isPlayingState",
    //unique id wrt to other atoms
    default:false
})