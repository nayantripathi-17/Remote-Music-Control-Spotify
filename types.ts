import { Account, User } from "next-auth";
import { BuiltInProviderType } from "next-auth/providers";
import { ClientSafeProvider, LiteralUnion } from "next-auth/react";
import { Session } from "next-auth";
import { ReactElement, MouseEventHandler } from "react";

export type ClickHandler = React.MouseEvent<HTMLElement>;

export interface LoginProps {
    providers: Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider>
}

export type ServerSession = (Session & {
    user: {
        accessToken: string,
        refereshToken: string,
        username: string
    }
}) | null

export type JWTtoken = Promise<JWTtoken | undefined> & {
    name: string,
    email: string,
    picture: string,
    sub: string,
    accessToken?: string,
    refreshToken?: string,
    profileName?: string
    accessTokenExpires?: number,
}

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

export const isSinglePlayListResponse = (playlist: any): playlist is SpotifyApi.SinglePlaylistResponse => {
    return playlist?.tracks !== undefined
}

export interface SongProps {
    track: SpotifyApi.SavedTrackObject,
    order: number,
}

export interface CenterProps {
    session: ServerSession | Session
}
export interface HomeProps {
    // session: ServerSession | Session,
    playlists: SpotifyApi.PlaylistObjectSimplified[]
}

export interface SidebarLinksProps {
    component: ReactElement,
    clickHandler: MouseEventHandler
}

export interface Pagination {
    next?: string;
    items: object[];
}