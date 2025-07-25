import type { KVNamespace } from '@cloudflare/workers-types'
import { json, type RequestHandler, error } from '@sveltejs/kit'

import {
  SUPABASE_DEFAULT_KEY,
  UUID_AERYLE_KEY,
  UUID_T1NQUEN_KEY,
  UUID_ANDREW_KEY,
  UUID_ADAM_KEY,
  UUID_THIRDONE_KEY,
  UUID_SOUPTIS_KEY,
  UUID_TACOSMAN_KEY,
} from '$env/static/private'

interface ActivePlayer {
  uuid: string
  roomId: string
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
// Cleanup function to remove expired entries from KV
const cleanupExpiredPlayers = async (kv: KVNamespace) => {
  const now = Date.now()
  const expirationTime = 1000 * 60 * 10 // 10 minutes

  try {
    const list = await kv.list()
    const expiredKeys = []

    for (const key of list.keys) {
      const playerData = (await kv.get(key.name, 'json')) as ActivePlayer | null
      if (playerData && now - playerData.timestamp > expirationTime) {
        expiredKeys.push(key.name)
      }
    }

    // Delete expired entries
    for (const key of expiredKeys) {
      await kv.delete(key)
    }
  } catch (error) {
    console.error('Error cleaning up expired players:', error)
  }
}

export const GET: RequestHandler = async ({ platform }) => {
  if (!platform?.env.ACTIVE_PLAYERS_KV) {
    throw error(500, { field: '', message: 'KV storage not available' })
  }

  await cleanupExpiredPlayers(platform.env.ACTIVE_PLAYERS_KV)

  try {
    const list = await platform.env.ACTIVE_PLAYERS_KV.list()
    const players = []

    for (const key of list.keys) {
      const playerData = (await platform.env.ACTIVE_PLAYERS_KV.get(key.name, 'json')) as ActivePlayer | null
      if (playerData) {
        players.push({
          uuid: playerData.uuid,
          roomId: playerData.roomId,
          actorId: playerData.actorId,
        })
      }
    }

    return json(players)
  } catch {
    throw error(500, { field: '', message: 'Failed to retrieve active players' })
  }
}

export const PUT: RequestHandler = async ({ request, platform }) => {
  if (!platform?.env.ACTIVE_PLAYERS_KV) {
    throw error(500, { field: '', message: 'KV storage not available' })
  }

  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return json({ error: 'Missing or invalid authorization header' }, { status: 401 })
  }

  const token = authHeader.substring(7)
  let body: { uuid: keyof typeof uuidToKey; roomId: string; actorId: number }

  try {
    body = await request.json()
  } catch {
    return json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  if (token === SUPABASE_DEFAULT_KEY) {
    // SUPABASE_DEFAULT_KEY can manage any UUID
    const { uuid, roomId, actorId } = body

    if (!uuid || !roomId || actorId === undefined) {
      return json({ error: 'Missing required fields: uuid, roomId, actorId' }, { status: 400 })
    }

    if (!(uuid in uuidToKey)) {
      return json({ error: 'Invalid UUID' }, { status: 400 })
    }

    // Check for existing entry with same roomId and actorId
    const list = await platform.env.ACTIVE_PLAYERS_KV.list()
    let existingKey: string | null = null

    for (const key of list.keys) {
      const playerData = (await platform.env.ACTIVE_PLAYERS_KV.get(key.name, 'json')) as ActivePlayer | null
      if (playerData && playerData.uuid === uuid && playerData.roomId === roomId && playerData.actorId === actorId) {
        existingKey = key.name
        break
      }
    }

    const playerData: ActivePlayer = {
      uuid,
      roomId,
      actorId,
      timestamp: Date.now(),
    }

    if (existingKey) {
      // Reset timer for existing entry
      await platform.env.ACTIVE_PLAYERS_KV.put(existingKey, JSON.stringify(playerData))
    } else {
      // Add new entry
      const key = `${uuid}_${roomId}_${actorId}_${Date.now()}`
      await platform.env.ACTIVE_PLAYERS_KV.put(key, JSON.stringify(playerData))
    }
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

    const { roomId, actorId } = body

    if (!roomId || actorId === undefined) {
      return json({ error: 'Missing required fields: roomId, actorId' }, { status: 400 })
    }

    // Check for existing entry with same roomId and actorId
    const list = await platform.env.ACTIVE_PLAYERS_KV.list()
    let existingKey: string | null = null

    for (const key of list.keys) {
      const playerData = (await platform.env.ACTIVE_PLAYERS_KV.get(key.name, 'json')) as ActivePlayer | null
      if (
        playerData &&
        playerData.uuid === authorizedUuid &&
        playerData.roomId === roomId &&
        playerData.actorId === actorId
      ) {
        existingKey = key.name
        break
      }
    }

    const playerData: ActivePlayer = {
      uuid: authorizedUuid,
      roomId,
      actorId,
      timestamp: Date.now(),
    }

    if (existingKey) {
      // Reset timer for existing entry
      await platform.env.ACTIVE_PLAYERS_KV.put(existingKey, JSON.stringify(playerData))
    } else {
      // Add new entry
      const key = `${authorizedUuid}_${roomId}_${actorId}_${Date.now()}`
      await platform.env.ACTIVE_PLAYERS_KV.put(key, JSON.stringify(playerData))
    }
  }

  return json({ success: true })
}
