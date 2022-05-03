import { IncomingMessage } from 'http'
import { NextApiRequestCookies } from 'next/dist/server/api-utils'

export const isClientReq = (url: string | undefined) =>
  url?.startsWith('/_next')
