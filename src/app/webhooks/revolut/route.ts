import { env } from '@/env'
import { createHmac, timingSafeEqual } from 'node:crypto'

export const POST = async (request: Request): Promise<Response> => {
  const headers = request.headers
  const timestamp = headers.get('revolut-request-timestamp')
  const signature = headers.get('revolut-signature')

  if (!timestamp || !signature) {
    return new Response('Error occurred -- no revolut headers', {
      status: 400,
    })
  }

  const payload = await request.json()

  if (
    !verifySignature(
      `v1.${timestamp}.${JSON.stringify(payload)}`,
      signature,
      env.REVOLUT_WEBHOOK_SIGNING_SECRET
    )
  ) {
    return new Response('Invalid signature', {
      status: 401,
    })
  }

  return new Response()
}

function verifySignature(
  payload: string,
  signature: string,
  signingSecret: string
): boolean {
  const hmac = createHmac('sha256', signingSecret)
  hmac.update(payload, 'utf-8')

  const expectedSignature = 'v1=' + hmac.digest('hex')

  return timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  )
}
