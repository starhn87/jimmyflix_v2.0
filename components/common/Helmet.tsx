import React from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async'

interface HelmetProps {
  content: string
}

export default function HelmetWrapper({ content }: HelmetProps) {
  return (
    <HelmetProvider>
      <Helmet>
        <title>{content}</title>
      </Helmet>
    </HelmetProvider>
  )
}
