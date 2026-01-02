import { json, type RequestHandler } from '@sveltejs/kit'

interface Player {
  UUID: string
  prefixes?: string[]
  username?: string
  suffixes?: string[]
}

const wrapWithColor = (color: string, content: string) => `<color=${color}>${content}</color>`

export const GET: RequestHandler = () => {
  const players: Player[] = [
    {
      UUID: 'aeryle',
      prefixes: ['👑'],
      username: wrapWithColor('#ffd700', '{nickname}'),
    },
    {
      UUID: 't1nquen#goat',
      prefixes: ['🤡'],
    },
    {
      UUID: 'andrew',
      prefixes: ['👍', '💵'],
    },
    {
      UUID: 'adam',
      prefixes: ['🔥'],
    },
    {
      UUID: 'thirdone',
      prefixes: ['👎'],
    },
    {
      UUID: 'tacosman',
      prefixes: ['🐎'],
      suffixes: ['🤑'],
    },
    {
      UUID: 'jazinth',
      prefixes: ['🧽'],
    },
    {
      UUID: 'ceta',
      prefixes: ['🐐'],
      suffixes: ['🤖'],
    },
    {
      UUID: 'dodo',
      prefixes: ['🦤'],
    },
  ]

  return json(players)
}
