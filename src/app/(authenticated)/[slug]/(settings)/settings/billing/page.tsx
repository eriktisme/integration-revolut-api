import type { Metadata } from 'next'
import { BillingSettingsPageTemplate, plans } from '@/features/billing-settings'

export const metadata: Metadata = {
  title: 'Billing',
}

export default async function Page() {
  return <BillingSettingsPageTemplate plans={plans} />
}
