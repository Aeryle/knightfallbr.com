import { isBrowser } from '@supabase/ssr'
import { redirect } from '@sveltejs/kit'

export const load = async ({ parent }) => {
  if (!isBrowser) return

  const { supabase } = await parent()
  supabase.auth.signOut()

  throw redirect(303, '/')
}
