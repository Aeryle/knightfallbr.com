import { json, type RequestHandler } from '@sveltejs/kit'

interface Player {
  prefixes?: string[]
  username?: string
  postfixes?: string[]
}

const wrapWithColor = (color: string, content: string) => `<color=${color}>${content}</color>`

export const GET: RequestHandler = () => {
  const players: Record<string, Player> = {
    aeryle: {
      prefixes: ['👑'],
      username: wrapWithColor('#ffd700', '{nickname}'),
    },
    't1nquen#goat': {
      prefixes: ['🤡'],
    },
  }

  return json(players)
}
