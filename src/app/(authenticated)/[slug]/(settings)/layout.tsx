import 'server-only'

import { ReactNode } from 'react'
import { SidebarProvider } from '@/components/ui/sidebar'
import { auth } from '@clerk/nextjs/server'
import { notFound } from 'next/navigation'
import { SettingsSidebar } from '@/components/settings-sidebar'

export default async function Layout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  if (
    !(await auth.protect({
      role: 'org:admin',
    }))
  ) {
    return notFound()
  }

  return (
    <SidebarProvider defaultOpen>
      <SettingsSidebar />
      <main className="flex min-h-svh flex-1 flex-col">{children}</main>
    </SidebarProvider>
  )
}
