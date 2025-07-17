import { error, text } from '@sveltejs/kit'

import { PUBLIC_SUPABASE_DEFAULT_KEY } from '$env/static/public'

let roomId = ''

export const GET = async () => text(roomId)

export const PUT = async ({ request }) => {
  const authHeader = request.headers.get('authorization')

  if (!authHeader || authHeader !== `Bearer ${PUBLIC_SUPABASE_DEFAULT_KEY}`) {
    throw error(401, { field: 'authorization', message: 'Unauthorized' })
  }

  try {
    roomId = await request.text()
  } catch {
    throw error(500, { field: '', message: 'Internal server error' })
  }

  return text(roomId)
}
