import { error, text } from '@sveltejs/kit'

import { getRoomId, updateRoomId } from '$lib/room-id.server'

import { SUPABASE_DEFAULT_KEY } from '$env/static/private'

export const GET = async () => {
  try {
    const roomId = await getRoomId()
    return text(roomId)
  } catch {
    throw error(500, { field: '', message: 'Failed to retrieve room ID' })
  }
}

export const PUT = async ({ request }) => {
  const authHeader = request.headers.get('authorization')

  if (!authHeader || authHeader !== `Bearer ${SUPABASE_DEFAULT_KEY}`) {
    throw error(401, { field: 'authorization', message: 'Unauthorized' })
  }

  try {
    const newRoomId = await request.text()
    await updateRoomId(newRoomId)
    return text(newRoomId)
  } catch {
    throw error(500, { field: '', message: 'Failed to update room ID' })
  }
}
