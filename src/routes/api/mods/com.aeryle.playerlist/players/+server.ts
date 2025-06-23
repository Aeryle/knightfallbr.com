import { json, type RequestHandler } from '@sveltejs/kit'

interface Player {
  UUID: string
  prefixes?: string[]
  username?: string
  postfixes?: string[]
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
      prefixes: ['👍'],
      username: wrapWithColor('red', '{nickname}'),
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
      UUID: 'souptis',
      username: wrapWithColor('#d3f5f5', '{nickname}'),
    },
  ]

  return json(players)
}
