import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { MutationConfig } from '@/lib/react-query'

export const CreateOrderFormSchema = z.object({
  billingPeriod: z.enum(['monthly', 'yearly']),
  lineItems: z.array(
    z.object({
      name: z.string(),
      quantity: z.number().positive(),
      price: z.number().positive(),
    })
  ),
})

export type CreateOrderFormValues = z.infer<typeof CreateOrderFormSchema>

export const createOrder = async (values: CreateOrderFormValues) => {
  const response = await fetch('/api/order', {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(values),
  })

  if (!response.ok) {
    throw new Error('Failed to create order')
  }

  return response.json()
}

type UseCreateOrderOptions = {
  mutationConfig?: MutationConfig<typeof createOrder>
}

export const useCreateOrder = ({ mutationConfig }: UseCreateOrderOptions) => {
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
    mutationFn: createOrder,
  })
}
