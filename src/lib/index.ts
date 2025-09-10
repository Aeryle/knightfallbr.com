import { replaceState } from '$app/navigation'
import { page } from '$app/state'

export const saveText = (content: string) => {
  const url = page.url
  url.searchParams.set('nickname', content)
  replaceState(url, {})
}
