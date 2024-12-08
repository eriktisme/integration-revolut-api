import { log } from '@/lib/observability'
import { headers } from 'next/headers'
import { Webhook } from 'svix'
import type { OrganizationJSON, WebhookEvent } from '@clerk/backend'
import { env } from '@/env'
import { MerchantAPI } from '@/lib/merchant-api'
import { clerkClient } from '@clerk/nextjs/server'
import { insertWorkspace } from '@/data/queries/workspaces.queries'
import { createPool } from '@vercel/postgres'

const handleOrganizationCreated = async (data: OrganizationJSON) => {
  if (!data.created_by) {
    return new Response('Error occurred', { status: 400 })
  }

  const user = await (await clerkClient()).users.getUser(data.created_by)

  const pool = createPool({
    connectionString: env.DATABASE_URL,
    maxUses: 1,
  })

  const merchantApi = new MerchantAPI({
    apiKey: env.REVOLUT_MERCHANT_API_KEY,
    version: '1.0',
    environment: 'sandbox',
  })

  const customer = await merchantApi.createCustomer({
    email: user.emailAddresses.at(0)?.emailAddress as string,
    fullName: user.fullName as string,
    businessName: data.name,
  })

  await insertWorkspace.run(
    {
      workspace: {
        id: data.id,
        revolutCustomerId: customer.id,
      },
    },
    pool
  )

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
      response = await handleOrganizationCreated(event.data)
      break
    }
    default: {
      break
    }
  }

  return response
}
