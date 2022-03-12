import { Account, User } from "next-auth";
import { BuiltInProviderType } from "next-auth/providers";
import { ClientSafeProvider, LiteralUnion } from "next-auth/react";
import { Session } from "next-auth";
import React, { ReactElement, MouseEventHandler } from "react";
import { ErrorBoundaryProps } from "react-error-boundary";
import { JWT } from "next-auth/jwt";

export type ServerSession = (Session & {
    user: {
        accessToken: string,
        refereshToken: string,
        username: string
    }
}) | null

export type ClickHandler = React.MouseEvent<HTMLElement>;

export interface LoginProps {
    providers: Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider>
}

export interface HomeProps {
    playlists: SpotifyApi.PlaylistObjectSimplified[]
}

export interface SongProps {
    track: SpotifyApi.SavedTrackObject | SpotifyApi.PlaylistTrackObject,
    order: number,
}

export interface CenterProps {
    session: ServerSession | Session
}

export interface SidebarLinksProps {
    component: ReactElement,
    clickHandler: MouseEventHandler
}

export interface ErrorFallbackProps {
    error: any
}

export type JWTtoken = JWT & {
    name: string,
    email: string,
    picture: string,
    sub: string,
    accessToken?: string,
    refreshToken?: string,
    profileName?: string
    accessTokenExpires?: number,
} | undefined

export type SpotifyAccount = Account & {
    provider: 'spotify',
    type: 'oauth',
    providerAccountId: string,
    access_token: string,
    token_type: 'Bearer',
    expires_at: number,
    refresh_token: string,
    scope: string
}

export type SpotifyUser = User & {
    name: string,
    email: string,
    id: string,
    image: string
}

// Custom Typeguards
export const isSinglePlayListResponse = (playlist: any): playlist is SpotifyApi.SinglePlaylistResponse => {
    if (playlist === null || playlist === undefined) return false
    return playlist?.tracks !== undefined
}

export const isPlaylistTrackObject = (track: any): track is SpotifyApi.PlaylistTrackObject => {
    if (track === null || track === undefined) return false
    if (track.added_at && track.added_by && track.is_local !== undefined && track.is_local !== null && track.track) return true
    return false
}