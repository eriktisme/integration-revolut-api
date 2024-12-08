import type { Plan } from '../data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { BillingPeriod } from '../hooks'
import { CheckIcon } from 'lucide-react'
import { UpgradePlanDialog } from './UpgradePlanDialog'

interface Props {
  billingPeriod: BillingPeriod
  plan: Plan
}

export const PlanCard = (props: Props) => {
  const plan = props.plan
  const price =
    props.billingPeriod === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice

  return (
    <Card className="flex w-60 flex-col items-stretch justify-start">
      <CardHeader>
        <CardTitle>{plan.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex grow flex-col items-stretch justify-start space-y-4">
        <div className="flex gap-2.5">
          <div className="text-xl font-bold">&pound;{price}</div>
          <div className="flex flex-col">
            <span className="text-sm font-normal">per user/mo</span>
            {props.billingPeriod === 'yearly' ? (
              <span className="text-sm text-neutral-500">billed annually</span>
            ) : null}
          </div>
        </div>
        <UpgradePlanDialog
          billingPeriod={props.billingPeriod}
          plan={props.plan}
        />
        <ul className="space-y-2">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
