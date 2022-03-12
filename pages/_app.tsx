import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/dist/shared/lib/router/router";
import { RecoilRoot } from "recoil";
import { ErrorBoundary } from 'react-error-boundary'
import '../styles/globals.css'
import { ErrorFallbackProps } from "../types";

function ErrorFallback({ error }: ErrorFallbackProps) {

  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button>Try again</button>
    </div>
  )
}

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps & { pageProps: { session: Session } }) {

  return (
    <RecoilRoot>
      <SessionProvider session={session}>
        <ErrorBoundary
          FallbackComponent={ErrorFallback}>
          <Component {...pageProps} />
        </ErrorBoundary>
      </SessionProvider>
    </RecoilRoot >
  );
}

export default MyApp
