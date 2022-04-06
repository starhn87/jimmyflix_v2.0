import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './api'
import { Provider } from 'react-redux'
import store from './redux/store'
import { QueryClient, QueryClientProvider } from 'react-query'

const container = document.getElementById('root')
const root = ReactDOM.createRoot(container!)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000, // 10분
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  },
})

root.render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <App />
    </Provider>
  </QueryClientProvider>,
)
