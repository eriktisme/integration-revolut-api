'use client'

import type { Plan } from '../data'
import { PlanCard, PlanToggle } from '../components'
import { useBillingSettings } from '../hooks'

interface Props {
  plans: Plan[]
}

export const BillingSettingsPageTemplate = (props: Props) => {
  const { selectedBillingPeriod, setSelectedBillingPeriod } =
    useBillingSettings()

  return (
    <div className="mx-auto space-y-6">
      <PlanToggle
        billingPeriod={selectedBillingPeriod}
        setBillingPeriod={setSelectedBillingPeriod}
      />
      <div className="grid grid-cols-4 gap-4">
        {props.plans.map((plan) => (
          <PlanCard
            key={plan.id}
            billingPeriod={selectedBillingPeriod}
            plan={plan}
          />
        ))}
      </div>
    </div>
  )
}
