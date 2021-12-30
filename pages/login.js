import { getProviders, signIn } from "next-auth/react";

function Login({ providers }) {


  return (
    <div className="flex flex-col items-center bg-black min-h-screen w-full justify-center">
      <img
        className="w-96 mb-5"
        src={`/static/images/logos/01_RGB/02_PNG/Spotify_Logo_RGB_Green.png`}
        alt="Spotify Icon"
      />
      {Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <button className="bg-[#18D860] p-5 pt-4 pb-4 text-white
           rounded-full"
           onClick={() => signIn(provider.id, {callbackUrl : `/` })}>Login with {provider.name}</button>
        </div>
      ))}
    </div>
  );
}

export default Login;

export async function getServerSideProps(context) {
  const providers = await getProviders();

  return {
    props: {
      providers,
    },
  };
}
