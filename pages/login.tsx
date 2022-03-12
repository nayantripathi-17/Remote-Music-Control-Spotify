/* eslint-disable @next/next/no-img-element */
import { GetServerSideProps } from "next";
import { getProviders, signIn } from "next-auth/react";
import { LoginProps } from "../types";
import Head from "next/head";

export default function Login({ providers }: LoginProps) {

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <div className="flex flex-col items-center bg-black min-h-screen w-full justify-center">
        {/* <Image
          className="mb-10"
          src={spotifyIconImage}
          alt="Spotify Icon"
          height={200}
          width={666}
          placeholder="blur"
        /> */}
        {
        <img 
          src="static/images/Spotify_Logo_RGB_Green.png"
          className="w-1/2 mb-4"
          placeholder="blur"
          alt="Spotify Icon"
        >
        </img>}
        {Object.values(providers).map((provider) => (
          <div key={provider.name}>
            <button className="bg-[#18D860] p-5 pt-4 pb-4 text-white
           rounded-full"
              onClick={() => signIn(provider.id, { callbackUrl: `/` })}>Login with {provider.name}</button>
          </div>
        ))}
      </div>
    </>
  )
}


export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {

  const providers = await getProviders();

  res.setHeader(
    'Cache-Control',
    'public, max-age=31536000, immutable'
  )

  if (providers === null) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      providers,
    },
  };
}
