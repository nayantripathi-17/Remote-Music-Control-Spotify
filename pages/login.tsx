import { GetServerSideProps } from "next";
import { getProviders, signIn } from "next-auth/react";
import { LoginProps } from "../types";
import Image from 'next/image';
//@ts-ignore
import spotifyIconImage from '../public/static/images/logos/01_RGB/02_PNG/Spotify_Logo_RGB_Green.png'
import Head from "next/head";

export default function Login({ providers }: LoginProps) {

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <div className="flex flex-col items-center bg-black min-h-screen w-full justify-center">
        <Image
          className="mb-10"
          src={spotifyIconImage}
          alt="Spotify Icon"
          height={200}
          width={666}
          placeholder="blur"
        />
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


export const getServerSideProps: GetServerSideProps = async () => {
  const providers = await getProviders();

  return {
    props: {
      providers,
    },
  };
}
