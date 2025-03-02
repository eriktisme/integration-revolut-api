import type { Dispatch, SetStateAction } from 'react'
import type { BillingPeriod } from '../hooks'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

interface Props {
  billingPeriod: BillingPeriod
  setBillingPeriod: Dispatch<SetStateAction<BillingPeriod>>
}

export const PlanToggle = (props: Props) => {
  return (
    <div className="flex items-center justify-center space-x-2">
      <Switch
        id="billing-interval"
        checked={props.billingPeriod === 'yearly'}
        onCheckedChange={() => {
          if (props.billingPeriod === 'monthly') {
            props.setBillingPeriod('yearly')

            return
          }

          props.setBillingPeriod('monthly')
        }}
      />
      <Label htmlFor="yearly-pricing">Annual billing</Label>
    </div>
  )
}
