import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

const ROOM_ID_KEY = 'current_room_id'

export const getRoomId = async (): Promise<string> => {
  try {
    const roomId = await redis.get<string>(ROOM_ID_KEY)
    return roomId || ''
  } catch (error) {
    console.error('Error fetching room ID:', error)
    return ''
  }
}

export const updateRoomId = async (id: string): Promise<void> => {
  try {
    await redis.set(ROOM_ID_KEY, id)
  } catch (error) {
    console.error('Error updating room ID:', error)
    throw new Error('Failed to update room ID')
  }
}
