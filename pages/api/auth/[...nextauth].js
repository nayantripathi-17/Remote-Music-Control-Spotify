import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import spotifyApi,{ LOGIN_URL } from "../../../lib/spotify";

async function refreshAccessToken(token){
    try {
        spotifyApi.setAccessToken(token.accessToken);
        spotifyApi.setRefreshToken(token.refreshToken);

        const { body: refreshedToken } = await spotifyApi.refreshAccessToken();

        console.log(`Refreshed token is ${refreshedToken}`);

        return {
            ...token,
            accessToken : refreshedToken.access_token,
            accessTokenExpires: Date.now() + refreshedToken.expires_in * 1000, //updated token expiry time, 
            //currentTime+ 1 Hour
            refreshToken: refreshedToken.refresh_token ?? token.refreshToken  //use new refresh token if returned,
            // else use the one already existing
        }
        
    } catch (error) {
        console.log(error);
        return {
            ...token,
            error : "RefreshAccessTokenError"
        };        
    }
}




export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      authorization: LOGIN_URL,
      profile(profile) {
        return {
          id: profile.id,
          name: profile.display_name,
          email: profile.email,
          image: profile.images?.[0]?.url,
        };
      },
    }),
    // ...add more providers here
  ],
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, account, user }) {
      //initial sign in

      if (account && user) {
        console.log(`NEW TOKEN GENERATED`)
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          profileName: user?.name,
          accessTokenExpires: account.expires_at * 1000, //in miliseconds
        };
      }
      //if access token valid
      else if(Date.now() < token.accessTokenExpires){
          console.log(`EXISTING TOKEN VALID`)
          return token;
      }

      //if accesstoken expired, we need to refresh it
      console.log(`EXISTING TOKEN EXPIRED,REFRESHING...`)
      return await refreshAccessToken(token)

    },

    async session({ session,token }){
        session.user.accessToken = token.accessToken,
        session.user.refreshToken = token.refreshToken,
        session.user.username = token.username

        return session;
    }
  },
});
