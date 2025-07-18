import type { KVNamespace } from '@cloudflare/workers-types'

const ROOM_ID_KEY = 'current_room_id'

export const getRoomId = async (kv: KVNamespace): Promise<string> => {
  return (await kv.get(ROOM_ID_KEY)) || ''
}

export const updateRoomId = async (kv: KVNamespace, id: string): Promise<void> => {
  await kv.put(ROOM_ID_KEY, id)
}
