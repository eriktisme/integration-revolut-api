import { z } from 'zod'

const endpoints = {
  sandbox: 'https://sandbox-merchant.revolut.com/api/',
}

const ConfigSchema = z.object({
  environment: z.enum(['sandbox']).default('sandbox'),
  apiKey: z.string().min(1).startsWith('sk_'),
  version: z.enum(['1.0']).default('1.0'),
})

type ConfigValues = z.infer<typeof ConfigSchema>

export type CreateOrderParams = {
  amount: number
  currency: 'GBP'
  customer: {
    id: string
  }
  lineItems: Array<{
    name: string
    type: string
    quantity: {
      value: number
      unit: string
    }
    unitPriceAmount: number
    totalAmount: number
    taxes: Array<{
      name: string
      amount: number
    }>
  }>
  captureMode: 'automatic'
  redirectUrl: string
}

export class MerchantAPI {
  protected readonly config: ConfigValues

  protected readonly endpoint: string

  constructor(config: ConfigValues) {
    this.config = ConfigSchema.parse(config)
    this.endpoint = endpoints[this.config.environment]
  }

  async createCustomer(values: {
    fullName: string
    businessName: string
    email: string
  }): Promise<{
    id: string
    fullName: string
    businessName: string
  }> {
    const customer = await this.request('POST', 'customers', {
      full_name: values.fullName,
      business_name: values.businessName,
      email: values.email,
    })

    return {
      id: customer.id,
      fullName: customer.full_name,
      businessName: customer.business_name,
    }
  }

  async createOrder(values: CreateOrderParams): Promise<{
    id: string
    token: string
    type: 'payment'
    state: 'pending'
    checkoutUrl: string
  }> {
    const order = await this.request('POST', 'orders', {
      amount: values.amount,
      currency: values.currency,
      customer: {
        id: values.customer.id,
      },
      line_items: values.lineItems.map((lineItem) => ({
        name: lineItem.name,
        type: lineItem.type,
        quantity: lineItem.quantity,
        unit_price_amount: lineItem.unitPriceAmount,
        total_amount: lineItem.totalAmount,
        taxes: lineItem.taxes.map((tax) => ({
          name: tax.name,
          amount: tax.amount,
        })),
      })),
    })

    return {
      id: order.id,
      token: order.token,
      type: order.type as 'payment',
      state: order.state as 'pending',
      checkoutUrl: order.checkout_url,
    }
  }

  protected async request(
    method: string,
    path: string,
    body: Record<string, any>
  ): Promise<Record<string, string>> {
    const response = await fetch(
      `${this.endpoint}${this.config.version}/${path}`,
      {
        body: !['GET', 'DELETE'].includes(method)
          ? JSON.stringify(body)
          : undefined,
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
          'Revolut-Api-Version': '2024-09-01',
        },
        method,
      }
    )

    if (!response.ok) {
      const error = await response.json()

      console.error('Failed to request', { error })

      throw new Error('Request failed')
    }

    return response.json()
  }
}
