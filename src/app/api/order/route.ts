import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { MerchantAPI } from '@/lib/merchant-api'
import { env } from '@/env'
import type { CreateOrderFormValues } from '@/features/billing-settings'
import { log } from '@/lib/observability'

export async function POST(request: Request) {
  const { orgId, userId } = await auth()

  if (!orgId || !userId) {
    return NextResponse.json(
      {
        code: 'not_authorized',
        type: 'not_authorized_error',
        status_code: 401,
      },
      {
        status: 401,
      }
    )
  }

  const client = await clerkClient()

  const body = (await request.json()) as CreateOrderFormValues

  const organization = await client.organizations.getOrganization({
    organizationId: orgId,
  })

  const { revolutCustomerId } = organization.publicMetadata as {
    revolutCustomerId: string
  }

  const merchantApi = new MerchantAPI({
    apiKey: env.REVOLUT_API_KEY,
    version: '1.0',
    environment: 'sandbox',
  })

  const lineItems = body.lineItems.map((lineItem) => {
    const totalPriceWithoutTax = lineItem.price * lineItem.quantity
    const taxes = totalPriceWithoutTax * 0.2

    return {
      name: lineItem.name,
      unitPriceAmount: lineItem.price,
      totalAmount: totalPriceWithoutTax + taxes,
      quantity: {
        value: lineItem.quantity,
        unit: 'seat',
      },
      taxes: [
        {
          name: 'Tax',
          amount: taxes,
        },
      ],
      type: 'service',
    }
  })

  const order = await merchantApi.createOrder({
    amount:
      lineItems.reduce((acc, lineItem) => acc + lineItem.totalAmount, 0) * 100,
    captureMode: 'automatic',
    currency: 'GBP',
    customer: { id: revolutCustomerId },
    lineItems,
    redirectUrl: `${env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}/settings/billing`,
  })

  log.info('Order was created', {
    orderId: order.id,
    customerId: revolutCustomerId,
    orgId,
  })

  return NextResponse.json(order)
}
