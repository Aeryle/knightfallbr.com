import { text } from '@sveltejs/kit'

import { DISCORD_CONNECTION_URL } from '$env/static/private'

export const GET = () => {
  return text(DISCORD_CONNECTION_URL)
}
