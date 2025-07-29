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

// Store active SSE connections
const sseConnections = new Set<ReadableStreamDefaultController<Uint8Array>>()

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

// Get current active players
const getActivePlayers = async (): Promise<ActivePlayer[]> => {
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

    return players
  } catch {
    throw error(500, { field: '', message: 'Failed to retrieve active players' })
  }
}

// Broadcast to all SSE connections
const broadcastToClients = (data: any) => {
  const message = `data: ${JSON.stringify(data)}\n\n`
  const encoder = new TextEncoder()
  const encodedMessage = encoder.encode(message)

  for (const controller of sseConnections) {
    try {
      controller.enqueue(encodedMessage)
    } catch (error) {
      // Remove broken connections
      sseConnections.delete(controller)
    }
  }
}

export const GET: RequestHandler = async () => {
  let currentController: ReadableStreamDefaultController<Uint8Array>

  const stream = new ReadableStream({
    start(controller) {
      currentController = controller
      // Add this connection to our set
      sseConnections.add(controller)

      // Send SSE headers
      const encoder = new TextEncoder()
      controller.enqueue(encoder.encode('data: {"type":"connected"}\n\n'))

      // Send initial active players data
      getActivePlayers()
        .then(players => {
          const message = `data: ${JSON.stringify({ type: 'initial', players })}\n\n`
          controller.enqueue(encoder.encode(message))
        })
        .catch(err => {
          console.error('Error getting initial players:', err)
        })
    },
    cancel() {
      // Remove this connection when closed
      sseConnections.delete(currentController)
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control',
    },
  })
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

  let playerData: ActivePlayer

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
      const existingPlayerData = await redis.get<ActivePlayer>(key)
      if (
        existingPlayerData &&
        existingPlayerData.uuid === uuid &&
        existingPlayerData.roomName === roomName &&
        existingPlayerData.actorId === actorId
      ) {
        existingKey = key
        break
      }
    }

    playerData = {
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
      const existingPlayerData = await redis.get<ActivePlayer>(key)
      if (
        existingPlayerData &&
        existingPlayerData.uuid === authorizedUuid &&
        existingPlayerData.roomName === roomName &&
        existingPlayerData.actorId === actorId
      ) {
        existingKey = key
        break
      }
    }

    playerData = {
      uuid: authorizedUuid,
      roomName,
      actorId,
      timestamp: Date.now(),
    }

    const redisKey = existingKey || `player:${authorizedUuid}_${roomName}_${actorId}_${Date.now()}`
    await redis.set(redisKey, playerData)
  }

  // Broadcast the new player to all SSE clients
  broadcastToClients({
    type: 'player_added',
    player: {
      uuid: playerData.uuid,
      roomName: playerData.roomName,
      actorId: playerData.actorId,
    },
  })

  return json({ success: true })
}
