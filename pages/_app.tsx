import { AppProps } from 'next/app'
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query'
import { RecoilRoot } from 'recoil'
import { Global, css } from '@emotion/react'
import emotionReset from 'emotion-reset'
import Header from '../components/common/Header'

const GlobalStyles = css`
  ${emotionReset}

  a {
    text-decoration: none;
    color: inherit;

    &:hover {
      cursor: pointer;
    }
  }
  * {
    box-sizing: border-box;
  }
  body {
    font-family: NanumGothic;
    font-size: 12px;
    background-color: rgba(20, 20, 20, 1);
    color: white;
    padding-top: 50px;
  }
  button {
    &:hover {
      cursor: pointer;
    }
  }
  #root {
    overflow: hidden;
  }
`

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1분
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  },
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Global styles={GlobalStyles} />
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <RecoilRoot>
            <Header />
            <Component {...pageProps} />
          </RecoilRoot>
        </Hydrate>
      </QueryClientProvider>
    </>
  )
}
export default MyApp
