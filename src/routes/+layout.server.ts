import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit'

import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ locals: { safeGetSession }, cookies }) => {
  const { session } = await safeGetSession()
  return {
    session,
    cookies: cookies.getAll(),
  }
}

injectSpeedInsights()
