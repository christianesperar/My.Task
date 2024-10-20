import { json } from '@tanstack/start'
import { StartAPIMethodCallback } from '@tanstack/start/api'
import { parse } from 'cookie'

import { fakeApiLoadTime } from '@app/helpers'

export function authMiddleware<T extends string>(
  handler: StartAPIMethodCallback<T>,
): StartAPIMethodCallback<T> {
  return async (ctx) => {
    await fakeApiLoadTime()

    const cookies = parse(ctx.request.headers.get('cookie') || '')
    const authToken = cookies['authToken']

    if (!authToken) {
      return json({ message: 'Unauthorized' }, { status: 401 })
    }

    return handler(ctx)
  }
}
