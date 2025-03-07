// export const GET = async event => {
//   const {url,locals: { supabase }} = event;
//   const code = url.searchParams.get('code') as string
//   const next = url.searchParams.get('next') ?? '/'

import { redirect } from '@sveltejs/kit'

//   if (code) {
//     const { error } = await supabase.auth.exchangeCodeForSession(code)
//     if (!error) {
//       throw redirect(303, `/${next.slice(1)}`)
//     }
//   }

//   // return the user to an error page with instructions
//   throw redirect(303, '/auth/auth-code-error')
// }

export const GET = async ({ url, locals: { supabase } }) => {
  const code = url.searchParams.get('code') as string
  const next = url.searchParams.get('next') ?? '/'

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) throw redirect(303, `/${next.slice(1)}`)
  }

  // return the user to an error page with instructions
  throw redirect(303, '/auth/auth-code-error')
}
