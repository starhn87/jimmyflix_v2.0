'use client'

import ReactDOM from 'react-dom'

export function MediaResourceHints() {
  ReactDOM.preconnect('https://image.tmdb.org')
  ReactDOM.prefetchDNS('https://image.tmdb.org')
  ReactDOM.preconnect('https://i.ytimg.com')

  return null
}
