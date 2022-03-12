import NextAuth, { Session, TokenSet } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import { signIn } from "next-auth/react";
import spotifyApi, { LOGIN_URL } from "../../../lib/spotify";
import { JWTtoken, SpotifyAccount, SpotifyUser } from "../../../types";

async function refreshAccessToken(token: JWTtoken) {
  try {
    if (token === undefined) return
    if (!(token.accessToken && token.refreshToken)) throw "accessToken/refreshToken undefined"
    spotifyApi.setAccessToken(token.accessToken);
    spotifyApi.setRefreshToken(token.refreshToken);

    const { body: refreshedToken } = await spotifyApi.refreshAccessToken();

    return {
      ...token,
      accessToken: refreshedToken.access_token,
      accessTokenExpires: Date.now() + refreshedToken.expires_in * 1000, //updated token expiry time, 
      //currentTime+ 1 Hour
      refreshToken: refreshedToken.refresh_token ?? token.refreshToken  //use new refresh token if returned,
      // else use the one already existing
    }

  } catch (error) {
    console.log(error)
    return {
      ...token,
      error: `RefreshAccessTokenError`
    };
  }
}


//Next-Auth
const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env;


export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      clientId: String(SPOTIFY_CLIENT_ID),
      clientSecret: String(SPOTIFY_CLIENT_SECRET),
      authorization: LOGIN_URL,
    }),
  ],
  secret: process.env.JWT_SECRET,
  session: {
    maxAge: 7 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ account }) {
      const { provider, type, token_type, expires_at, access_token, refresh_token, scope } = account;
      if (!(provider && type && token_type && expires_at && access_token && refresh_token && scope)) {
        return false
      }
      if (!(provider === `spotify` && type === `oauth` && token_type === `Bearer`)) {
        return false
      }
      return true;
    },
    //@ts-ignore
    async jwt(jwtObject) {
      try {
        //initial sign in
        const token = jwtObject.token as JWTtoken
        const account = jwtObject.account as SpotifyAccount | undefined
        const user = jwtObject.user as SpotifyUser | undefined

        if (account && user) {
          return {
            ...token,
            accessToken: String(account.access_token),
            refreshToken: String(account.refresh_token),
            profileName: String(user?.name),
            accessTokenExpires: Number(account.expires_at * 1000), //Date constructor uses miliseconds
          };
        }
        //if access token valid
        else if (token?.accessTokenExpires && Date.now() < token?.accessTokenExpires) {
          return token;
        }

        //if access token expired, we need to refresh it
        return await refreshAccessToken(token)
      } catch (err) {
        console.log(err);
      }
    },

    async session({ session, token }: { session: Session, token: TokenSet }) {
      //@ts-ignore
      session.user.accessToken = token.accessToken,
        //@ts-ignore  
        session.user.refreshToken = token.refreshToken,
        //@ts-ignore  
        session.user.username = token.username

      return session;
    }
  },
})

