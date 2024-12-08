import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { MutationConfig } from '@/lib/react-query'

export const UpgradePlanFormSchema = z.object({
  cardNumber: z.string(),
  expiryMonth: z.string(),
  expiryYear: z.string(),
  cvc: z.string(),
})

export type UpgradePlanFormValues = z.infer<typeof UpgradePlanFormSchema>

export const upgradePlan = async (values: UpgradePlanFormValues) => {
  await fetch('/api/plan', {
    method: 'PATCH',
    body: JSON.stringify(values),
  })

  return Promise.resolve({})
}

type UseUpgradePlanOptions = {
  mutationConfig?: MutationConfig<typeof upgradePlan>
}

export const useUpgradePlan = ({ mutationConfig }: UseUpgradePlanOptions) => {
  const queryClient = useQueryClient()

  const { onSuccess, ...restConfig } = mutationConfig ?? {}

  return useMutation({
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({
        queryKey: ['billing-settings', 'plan'],
      })
      onSuccess?.(...args)
    },
    ...restConfig,
    mutationFn: upgradePlan,
  })
}
