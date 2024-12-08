import type { Plan } from '../data'
import type { BillingPeriod } from '../hooks'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { UpgradePlanFormValues } from '../api'
import { useUpgradePlan } from '../api'
import { UpgradePlanFormSchema } from '../api'
import { useToast } from '@/hooks/use-toast'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Kbd } from '@/components/ui/kbd'

interface Props {
  billingPeriod: BillingPeriod
  plan: Plan
  currentPlan?: Plan
}

export const UpgradePlanDialog = (props: Props) => {
  const [open, setOpen] = useState(false)

  const { toast } = useToast()

  const currentYear = new Date().getFullYear()

  const form = useForm<UpgradePlanFormValues>({
    resolver: zodResolver(UpgradePlanFormSchema),
    defaultValues: {
      cardNumber: '',
      expiryMonth: '',
      expiryYear: '',
      cvc: '',
    },
  })

  const upgradePlan = useUpgradePlan({
    mutationConfig: {
      onSuccess: () => {
        toast({
          title: "You've successfully paid!",
          variant: 'success',
        })

        setOpen(false)

        form.reset()
      },
    },
  })

  const onPayAndSubscribe = (values: UpgradePlanFormValues) => {
    upgradePlan.mutate(values)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) {
          form.reset()
        }

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
          <DialogDescription>Add your payment details.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onPayAndSubscribe)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="cardNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Card Number</FormLabel>
                  <FormControl>
                    <Input
                      inputMode="numeric"
                      autoComplete="cc-number"
                      type="text"
                      maxLength={19}
                      pattern="d{4} d{4} d{4} d{4}"
                      placeholder="0000 0000 0000 0000"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="space-y-2">
                  <Label>Expiration</Label>
                </div>
                <div className="flex gap-2">
                  <FormField
                    control={form.control}
                    name="expiryMonth"
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="MM" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => i + 1).map(
                            (month) => (
                              <SelectItem
                                key={month}
                                value={month.toString().padStart(2, '0')}
                              >
                                {month}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="expiryYear"
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="YYYY" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Array.from(
                            { length: 10 },
                            (_, i) => i + currentYear
                          ).map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
              <div>
                <div className="space-y-2">
                  <Label>CVC</Label>
                </div>
                <FormField
                  control={form.control}
                  name="cvc"
                  render={({ field }) => (
                    <FormControl>
                      <Input
                        inputMode="numeric"
                        autoComplete="cc-csc"
                        type="text"
                        placeholder="123"
                        maxLength={4}
                        {...field}
                      />
                    </FormControl>
                  )}
                />
              </div>
            </div>
            <DialogFooter className="space-x-2">
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
                isLoading={upgradePlan.isPending}
                type="submit"
                size="sm"
                disabled={!form.formState.isValid}
              >
                Pay and subscribe
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
