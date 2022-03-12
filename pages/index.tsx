import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { getSession, useSession } from 'next-auth/react'
import Head from 'next/head'
import SpotifyWebApi from 'spotify-web-api-node'
import urljoin from 'url-join'
import { HomeProps, ServerSession } from '../types'
import dynamic from 'next/dynamic'
import fetchCurrentSong from '../lib/fetchCurrentSong'
import { useCallback, useEffect } from 'react'
import useSpotify from '../hooks/useSpotify'
import { useRecoilState } from 'recoil'
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom'

const DynamicPlayer = dynamic(() => import('../components/Player'))
const DynamicSidebar = dynamic(() => import('../components/Sidebar'))
const DynamicCenter = dynamic(() => import('../components/Center'))

export default function Home({ playlists }: HomeProps) {
  const { data: session } = useSession();

  const spotifyApi = useSpotify();
  const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);

  const fetchCurrentSongMemo = useCallback(async () => {
    await fetchCurrentSong(spotifyApi, setCurrentTrackId, setIsPlaying)
  }, [spotifyApi, setCurrentTrackId, setIsPlaying])

  useEffect(() => {
    fetchCurrentSongMemo()
  }, [fetchCurrentSongMemo])

  return (
    <>
      <Head>
        <title>Remote Music Control</title>
      </Head>
      <main className="bg-black h-screen overflow-hidden flex">
        <DynamicSidebar playlists={playlists} />
        <DynamicCenter session={session} />
      </main>
      {currentTrackId !== "" && currentTrackId != null && currentTrackId != undefined &&
        <div className='overflow-hidden flex-grow w-full scrollbar-hide bottom-0 sticky'>
          <DynamicPlayer />
        </div>}
    </>
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
  const total = userPlayListResponse.body.total
  var playlists = userPlayListResponse?.body?.items

  var batches = total % 50 === 0 ? (total / 50) - 1 : Math.floor(total / 50)
  const totalBatch = batches + 1

  while (batches > 0) {
    const response = await spotifyApi.getUserPlaylists({ limit: 50, offset: (totalBatch - batches) * 50 })
    playlists = playlists.concat(response.body.items)
    batches -= 1;
  }

  return {
    props: {
      session,
      playlists
    },
  }
}
