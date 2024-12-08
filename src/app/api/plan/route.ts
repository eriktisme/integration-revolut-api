import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { log } from '@/lib/observability'

export async function PATCH(request: Request) {
  const { orgId, userId } = await auth()

  if (!orgId || !userId) {
    return NextResponse.json(
      {
        code: 'not_authorized',
        type: 'not_authorized_error',
        status_code: 401,
      },
      {
        status: 401,
      }
    )
  }

  const body = await request.json()

  log.info('Plan updated', {
    body,
  })

  return NextResponse.json({})
}
