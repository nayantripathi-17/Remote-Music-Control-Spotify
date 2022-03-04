import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { getSession, useSession } from 'next-auth/react'
import Head from 'next/head'
import SpotifyWebApi from 'spotify-web-api-node'
import urljoin from 'url-join'
import Center from '../components/Center'
import Player from '../components/Player'
import Sidebar from '../components/Sidebar'
import spotifyApi from '../lib/spotify'
import { HomeProps, Pagination, ServerSession } from '../types'


export default function Home({ playlists }: HomeProps) {
  const { data: session } = useSession();

  return (
    <div>
      <Head>
        <title>Remote Music Control</title>
      </Head>
      <main className="bg-black h-screen overflow-hidden flex">
        <Sidebar playlists={playlists} />
        <Center session={session} />
      </main>
      {/* <div className='overflow-hidden flex-grow w-full scrollbar-hide bottom-0 sticky'>
        <Player />
      </div> */}
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const session = await getSession(context) as ServerSession;

  const { DEPLOYED_URL } = process.env;
  const redirect_uri = urljoin(String(DEPLOYED_URL), `api`, `auth`, `callback`, `spotify`)

  const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: redirect_uri
  })

  spotifyApi.setAccessToken(String(session?.user.accessToken))

  const userPlayListResponse = await spotifyApi.getUserPlaylists({ limit: 50, offset: 0 })
  const playlists = userPlayListResponse?.body?.items

  return {
    props: {
      session,
      playlists
    },
  }
}
