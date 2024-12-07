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

  protected async request(
    method: string,
    path: string,
    body: Record<string, string>
  ): Promise<Record<string, string>> {
    const response = await fetch(
      `${this.endpoint}${this.config.version}/${path}`,
      {
        method,
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: !['GET', 'DELETE'].includes(method)
          ? JSON.stringify(body)
          : undefined,
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
