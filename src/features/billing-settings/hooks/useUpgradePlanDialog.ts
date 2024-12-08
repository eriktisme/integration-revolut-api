import { useState } from 'react'
import type { Plan } from '../data'
import type { BillingPeriod } from './useBillingSettings'

interface Props {
  plan: Plan
  billingPeriod: BillingPeriod
}

export const useUpgradePlanDialog = (props: Props) => {
  const [seats, setSeats] = useState(1)
  const basePrice =
    props.billingPeriod === 'yearly'
      ? props.plan.yearlyPrice
      : props.plan.monthlyPrice

  const totalPrice = basePrice * seats

  return {
    seats,
    setSeats,
    basePrice,
    totalPrice,
  }
}
