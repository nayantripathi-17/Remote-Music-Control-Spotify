import { getSession } from 'next-auth/react'
import Head from 'next/head'
import Center from '../components/Center'
import Player from '../components/Player'
import Sidebar from '../components/Sidebar'


export default function Home() {
  return (
    <div>
      <Head>
        <title>Remote Music Control</title>
      </Head>
      <main className="bg-black h-screen overflow-hidden flex">
        <Sidebar />
        <Center />
      </main>
      <div className='overflow-hidden flex-grow w-full scrollbar-hide bottom-0 sticky'>
        <Player />
      </div>
    </div>
  )
}

export async function getServerSideProps(context){
  const session = await getSession(context);

  return {
    props:{
      session,
    },
  }
}
