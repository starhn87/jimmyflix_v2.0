import { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from 'react-query'
import { RecoilRoot } from 'recoil'
import { ThemeProvider } from 'styled-components'
import { createGlobalStyle } from 'styled-components'
import reset from 'styled-reset'
import Header from '../components/common/Header'

const GlobalStyles = createGlobalStyle`
    ${reset};
    
    a {
        text-decoration: none;
        color: inherit;

        &:hover {
          cursor: pointer
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

const theme = {
  colors: {
    //@ common style
    mainColor: '#FF6363',
    pointColor: '#304ffd',
    lightblue: '#C5E2EE',
    starColor: '#fd4',
  },
}

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
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <QueryClientProvider client={queryClient}>
        <RecoilRoot>
          <Header />
          <Component {...pageProps} />
        </RecoilRoot>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
export default MyApp
