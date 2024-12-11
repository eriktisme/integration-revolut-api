import type { Plan } from '../data'
import type { BillingPeriod } from '../hooks'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useCreateOrder } from '../api'
import { useState } from 'react'
import { Kbd } from '@/components/ui/kbd'

interface Props {
  billingPeriod: BillingPeriod
  plan: Plan
  currentPlan?: Plan
}

export const UpgradePlanDialog = (props: Props) => {
  const [open, setOpen] = useState(false)

  const price =
    props.billingPeriod === 'yearly'
      ? props.plan.yearlyPrice
      : props.plan.monthlyPrice

  const createOrder = useCreateOrder({
    mutationConfig: {
      onSuccess: () => {
        setOpen(false)
      },
    },
  })

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value)
      }}
    >
      <DialogTrigger asChild>
        {!props.currentPlan && props.plan.name === 'Free' ? (
          <Button disabled className="w-full">
            Current Plan
          </Button>
        ) : (
          <Button
            onClick={() => {
              setOpen(true)
            }}
            className="w-full"
          >
            Upgrade Plan
          </Button>
        )}
      </DialogTrigger>
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Upgrade to {props.plan.name}</DialogTitle>
        </DialogHeader>
        <DialogFooter className="space-y-2 sm:space-y-0">
          <Button
            onClick={() => {
              setOpen(false)
            }}
            variant="secondary"
            size="sm"
            type="button"
          >
            <span>Cancel</span>
            <Kbd className="ml-2">Esc</Kbd>
          </Button>
          <Button
            onClick={() => {
              createOrder.mutate({
                billingPeriod: props.billingPeriod,
                lineItems: [
                  {
                    name: props.plan.name,
                    quantity: 1,
                    price,
                  },
                ],
              })
            }}
            isLoading={createOrder.isPending}
            type="submit"
            size="sm"
          >
            Pay and subscribe
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
