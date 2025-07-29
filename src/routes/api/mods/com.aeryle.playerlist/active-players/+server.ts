import { json, type RequestHandler, error } from '@sveltejs/kit'
import { Redis } from '@upstash/redis'

import {
  SUPABASE_DEFAULT_KEY,
  UUID_AERYLE_KEY,
  UUID_T1NQUEN_KEY,
  UUID_ANDREW_KEY,
  UUID_ADAM_KEY,
  UUID_THIRDONE_KEY,
  UUID_SOUPTIS_KEY,
  UUID_TACOSMAN_KEY,
  KV_REST_API_TOKEN,
  KV_REST_API_URL,
} from '$env/static/private'

const redis = new Redis({
  url: KV_REST_API_URL,
  token: KV_REST_API_TOKEN,
})

interface ActivePlayer {
  uuid: string
  roomName: string
  actorId: number
  timestamp: number
}

// Map UUIDs to their API keys
const uuidToKey = {
  aeryle: UUID_AERYLE_KEY,
  't1nquen#goat': UUID_T1NQUEN_KEY,
  andrew: UUID_ANDREW_KEY,
  adam: UUID_ADAM_KEY,
  thirdone: UUID_THIRDONE_KEY,
  souptis: UUID_SOUPTIS_KEY,
  tacosman: UUID_TACOSMAN_KEY,
} as const

// Cleanup function to remove expired entries from Redis
const cleanupExpiredPlayers = async () => {
  const now = Date.now()
  const expirationTime = 1000 * 60 * 10 // 10 minutes

  try {
    const keys = await redis.keys('player:*')
    const expiredKeys = []

    for (const key of keys) {
      const playerData = await redis.get<ActivePlayer>(key)
      if (playerData && now - playerData.timestamp > expirationTime) {
        expiredKeys.push(key)
      }
    }

    // Delete expired entries
    if (expiredKeys.length > 0) {
      await redis.del(...expiredKeys)
    }
  } catch (error) {
    console.error('Error cleaning up expired players:', error)
  }
}

export const GET: RequestHandler = async () => {
  await cleanupExpiredPlayers()

  try {
    const keys = await redis.keys('player:*')
    const players: ActivePlayer[] = []

    for (const key of keys) {
      const playerData = await redis.get<ActivePlayer>(key)
      if (playerData) {
        players.push({
          uuid: playerData.uuid,
          roomName: playerData.roomName,
          actorId: playerData.actorId,
        } as ActivePlayer)
      }
    }

    return json(players, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    })
  } catch {
    throw error(500, { field: '', message: 'Failed to retrieve active players' })
  }
}

export const PUT: RequestHandler = async ({ request }) => {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return json({ error: 'Missing or invalid authorization header' }, { status: 401 })
  }

  const token = authHeader.substring(7)
  let body: { uuid: keyof typeof uuidToKey; roomName: string; actorId: number }

  try {
    body = await request.json()
  } catch {
    return json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  if (token === SUPABASE_DEFAULT_KEY) {
    // SUPABASE_DEFAULT_KEY can manage any UUID
    const { uuid, roomName, actorId } = body

    if (!uuid || !roomName || actorId === undefined) {
      return json({ error: 'Missing required fields: uuid, roomName, actorId' }, { status: 400 })
    }

    if (!(uuid in uuidToKey)) {
      return json({ error: 'Invalid UUID' }, { status: 400 })
    }

    // Check for existing entry with same roomName and actorId
    const existingKeys = await redis.keys('player:*')
    let existingKey: string | null = null

    for (const key of existingKeys) {
      const playerData = await redis.get<ActivePlayer>(key)
      if (
        playerData &&
        playerData.uuid === uuid &&
        playerData.roomName === roomName &&
        playerData.actorId === actorId
      ) {
        existingKey = key
        break
      }
    }

    const playerData: ActivePlayer = {
      uuid,
      roomName,
      actorId,
      timestamp: Date.now(),
    }

    const redisKey = existingKey || `player:${uuid}_${roomName}_${actorId}_${Date.now()}`
    await redis.set(redisKey, playerData)
  } else {
    // UUID-specific key can only manage its own UUID
    let authorizedUuid: string | null = null

    for (const [uuid, key] of Object.entries(uuidToKey) as [keyof typeof uuidToKey, string][]) {
      if (key === token) {
        authorizedUuid = uuid
        break
      }
    }

    if (!authorizedUuid) {
      return json({ error: 'Invalid API key' }, { status: 401 })
    }

    const { roomName, actorId } = body

    if (!roomName || actorId === undefined) {
      return json({ error: 'Missing required fields: roomName, actorId' }, { status: 400 })
    }

    // Check for existing entry with same roomName and actorId
    const existingKeys = await redis.keys('player:*')
    let existingKey: string | null = null

    for (const key of existingKeys) {
      const playerData = await redis.get<ActivePlayer>(key)
      if (
        playerData &&
        playerData.uuid === authorizedUuid &&
        playerData.roomName === roomName &&
        playerData.actorId === actorId
      ) {
        existingKey = key
        break
      }
    }

    const playerData: ActivePlayer = {
      uuid: authorizedUuid,
      roomName,
      actorId,
      timestamp: Date.now(),
    }

    const redisKey = existingKey || `player:${authorizedUuid}_${roomName}_${actorId}_${Date.now()}`
    await redis.set(redisKey, playerData)
  }

  return json({ success: true })
}
