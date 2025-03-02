export const plans = [
  {
    id: 'plan_0',
    name: 'Free',
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: ['Feature 1'],
  },
  {
    id: 'plan_1',
    name: 'Starter',
    monthlyPrice: 10,
    yearlyPrice: 110,
    features: ['Feature 1', 'Feature 2', 'Feature 3'],
  },
  {
    id: 'plan_2',
    name: 'Professional',
    monthlyPrice: 20,
    yearlyPrice: 220,
    features: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4'],
  },
  {
    id: 'plan_3',
    name: 'Enterprise',
    monthlyPrice: 30,
    yearlyPrice: 330,
    features: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4', 'Feature 5'],
  },
]

export type Plan = (typeof plans)[0]
