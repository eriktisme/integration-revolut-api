import type { Plan } from '../data'
import type { BillingPeriod } from '../hooks'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface Props {
  billingPeriod: BillingPeriod
  plan: Plan
  currentPlan?: Plan
}

export const UpgradePlanDialog = (props: Props) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {!props.currentPlan && props.plan.name === 'Free' ? (
          <Button disabled className="w-full">
            Current Plan
          </Button>
        ) : (
          <Button className="w-full">Upgrade Plan</Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{/* Placeholder */}</DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
