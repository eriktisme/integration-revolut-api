import type { Metadata } from 'next'
import './globals.css'
import { ClerkLoaded, ClerkLoading, ClerkProvider } from '@clerk/nextjs'
import { Loader2Icon } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Next with Clerk',
  description: '',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="font-sans antialiased">
          <ClerkLoading>
            <div className="flex min-h-svh flex-1 items-center justify-center">
              <div className="flex flex-row items-center gap-1.5">
                <Loader2Icon className="size-5 animate-spin text-neutral-500" />
                <div className="font-medium text-neutral-700">Loading...</div>
              </div>
            </div>
          </ClerkLoading>
          <ClerkLoaded>{children}</ClerkLoaded>
        </body>
      </html>
    </ClerkProvider>
  )
}
