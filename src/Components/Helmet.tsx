import React from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async'

interface IHelmet {
  content: string
}

export default function HelmetWrapper({ content }: IHelmet) {
  return (
    <HelmetProvider>
      <Helmet>
        <title>{content}</title>
      </Helmet>
    </HelmetProvider>
  )
}
