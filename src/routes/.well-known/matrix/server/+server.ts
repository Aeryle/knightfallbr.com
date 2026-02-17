import { json } from '@sveltejs/kit'

export const GET = () => {
  return json(
    { 'm.server': 'matrix.knightfallbr.com:443' },
    {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-igin': '*',
      },
    }
  )
}
