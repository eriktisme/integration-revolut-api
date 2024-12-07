import { log } from '@/lib/observability'
import { headers } from 'next/headers'
import { Webhook } from 'svix'
import { OrganizationJSON, WebhookEvent } from '@clerk/backend'
import { env } from '@/env'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const handleOrganizationCreated = (_: OrganizationJSON) => {
  return new Response('Organization created', { status: 201 })
}

export const POST = async (request: Request): Promise<Response> => {
  const headerPayload = await headers()
  const svixId = headerPayload.get('svix-id')
  const svixTimestamp = headerPayload.get('svix-timestamp')
  const svixSignature = headerPayload.get('svix-signature')

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response('Error occured -- no svix headers', {
      status: 400,
    })
  }

  // Get the body
  const payload = (await request.json()) as object
  const body = JSON.stringify(payload)

  const webhook = new Webhook(env.CLERK_WEBHOOK_SECRET)

  let event: WebhookEvent | undefined

  try {
    event = webhook.verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as WebhookEvent
  } catch (error) {
    log.error('Error verifying webhook:', { error })

    return new Response('Error occurred', {
      status: 400,
    })
  }

  const { id } = event.data
  const eventType = event.type

  log.info('Webhook', { id, eventType, body })

  let response: Response = new Response('', { status: 201 })

  switch (eventType) {
    case 'organization.created': {
      response = handleOrganizationCreated(event.data)
      break
    }
    default: {
      break
    }
  }

  return response
}
