import { env } from '$env/dynamic/private'
import { redirect } from '@sveltejs/kit'

export const load = () => {
  throw redirect(308, env.DISCORD_URL)
}
