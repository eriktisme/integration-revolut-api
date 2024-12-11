import { useState } from 'react'

export type BillingPeriod = 'monthly' | 'yearly'

export const useBillingSettings = () => {
  const [selectedBillingPeriod, setSelectedBillingPeriod] =
    useState<BillingPeriod>('yearly')

  return {
    selectedBillingPeriod,
    setSelectedBillingPeriod,
  }
}
