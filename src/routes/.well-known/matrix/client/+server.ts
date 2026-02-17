import { json } from '@sveltejs/kit'

export const GET = () => {
  return json(
    {
      'm.homeserver': { base_url: 'https://matrix.knightfallbr.com' },
      'm.identity_server': { base_url: 'https://vector.im' },
    },
    {
      headers: {
        'Content-type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept',
      },
    }
  )
}
