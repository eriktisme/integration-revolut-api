import 'server-only'

import type { ReactNode } from 'react'
import { auth, currentUser } from '@clerk/nextjs/server'
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import { Providers } from './providers'

export default async function Layout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  const user = await currentUser()
  const { redirectToSignIn } = await auth()

  if (!user) {
    redirectToSignIn()
  }

  const queryClient = new QueryClient()
  const dehydratedState = dehydrate(queryClient)

  return (
    <Providers>
      <HydrationBoundary state={dehydratedState}>{children}</HydrationBoundary>
    </Providers>
  )
}
