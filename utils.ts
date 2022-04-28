import { IncomingMessage } from 'http'
import { NextApiRequestCookies } from 'next/dist/server/api-utils'

export const isClientReq = (
  req: IncomingMessage & {
    cookies: NextApiRequestCookies
  },
) => req?.url?.startsWith('/_next')
