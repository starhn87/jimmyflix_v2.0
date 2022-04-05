import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './Components/App'
import './api'
import { Provider } from 'react-redux'
import store from './redux/store'

const container = document.getElementById('root')
const root = ReactDOM.createRoot(container!)

root.render(
  <Provider store={store}>
    <App />
  </Provider>,
)
