import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './api'
import { QueryClient, QueryClientProvider } from 'react-query'
import { RecoilRoot } from 'recoil'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1분
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      suspense: true,
    },
  },
})
const container = document.getElementById('root')
const root = ReactDOM.createRoot(container!)

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <App />
      </RecoilRoot>
    </QueryClientProvider>
  </React.StrictMode>,
)
